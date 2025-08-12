import google.generativeai as genai
import os
import json
import logging
from django.conf import settings
from decouple import config

logger = logging.getLogger(__name__)

def configure_gemini():
    """Configures the Gemini API key."""
    # Use decouple.config to read from the .env file
    api_key = config("GEMINI_API_KEY", default=None) 
    if not api_key:
        logger.critical("CRITICAL: GEMINI_API_KEY environment variable not set. The service cannot function.")
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    genai.configure(api_key=api_key)
    logger.info("Gemini API key configured successfully.")
    logger.debug(f"Configured Gemini API key: {api_key[:5]}...{api_key[-5:]}") # Masked logging

def get_ai_job_matches(user, all_open_jobs):
    """
    Orchestrates the AI-powered job matching process.
    """
    try:
        configure_gemini()
    except ValueError as e:
        logger.error(f"Gemini API configuration failed: {e}")
        return []

    logger.info(f"get_ai_job_matches: Starting process for user {user.email}")

    if not all_open_jobs.exists():
        logger.warning("get_ai_job_matches: all_open_jobs queryset is empty. Aborting.")
        return []

    user_data = {
        "id": str(user.id),
        "full_name": user.full_name,
        "bio": user.bio or "",
        "skills": user.skills,
        "xp_points": user.xp_points,
        "preferred_job_type": user.preferred_job_type
    }
    logger.debug(f"get_ai_job_matches: Prepared user data: {json.dumps(user_data, indent=2)}")

    jobs_data = [{
        "id": str(job.id),
        "title": job.title,
        "description": job.description,
        "skills_required": job.skills,
        "job_type_location": job.job_type,
        "budget": str(job.budget) if job.budget is not None else None,
        "payment_type_inferred": "PAID" if job.budget and job.budget > 0 else "BARTER"
    } for job in all_open_jobs]
    logger.debug(f"get_ai_job_matches: Prepared {len(jobs_data)} jobs for the API call.")

    prompt = f"""
    You are an intelligent job matching assistant. Your task is to analyze a user's profile
    and a list of available jobs, then provide a match score (0-100) for each job
    indicating its suitability for the user. A higher score means a better match.

    Consider the following criteria for matching:
    1.  **Semantic Skill Similarity (Most Important)**: How well do the user's skills
        semantically align with the job's required skills? Look beyond exact keywords.
        For example, "Machine Learning" implies "AI Development".
    2.  **Description-User Alignment**: How well does the user's bio and skills
        align with the job's description and requirements? Look for contextual clues.
    3.  **Payment Type Preference**: If the user prefers 'PAID' jobs, prioritize jobs with a positive budget.
        If they prefer 'BARTER' jobs, prioritize jobs with a zero or null budget. This is crucial.
    4.  **Experience Level (XP)**: Match users with higher XP points (experience) to jobs
        that appear more complex or senior based on their description and required skills.
        Match users with lower XP to more entry-level or intermediate jobs.
    5.  **Budget Alignment (for PAID jobs)**: For 'PAID' jobs, consider if the budget seems
        reasonable for the required skills and complexity. Do not penalize if no specific budget range is given for the user,
        but reward if the budget appears fair for the complexity.

    Return your response as a JSON array of objects, where each object has 'job_id' (string)
    and 'match_score' (integer between 0 and 100). Do NOT include any other text or formatting,
    only the JSON array.

    User Profile:
    {json.dumps(user_data, indent=2)}

    Available Jobs:
    {json.dumps(jobs_data, indent=2)}

    Example expected output format:
    [
        {{"job_id": "uuid-of-job-1", "match_score": 85}},
        {{"job_id": "uuid-of-job-2", "match_score": 60}}
    ]
    """
    logger.info("get_ai_job_matches: Sending prompt to Gemini API.")
    logger.debug(f"get_ai_job_matches: Full prompt being sent:\n{prompt}")

    try:
        # Changed model to 'gemini-2.5-flash'
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        if not response.parts:
            logger.error(f"Gemini API returned no parts. Prompt feedback: {response.prompt_feedback}")
            return []
        
        ai_output = response.text.strip()
        logger.info("get_ai_job_matches: Received response from Gemini API.")
        logger.debug(f"get_ai_job_matches: Raw AI output:\n{ai_output}")
        
        if ai_output.startswith("```json") and ai_output.endswith("```"):
            ai_output = ai_output[7:-3].strip()

        matched_jobs_data = json.loads(ai_output)
        logger.info(f"get_ai_job_matches: Successfully parsed JSON response. Found {len(matched_jobs_data)} items.")

        if not isinstance(matched_jobs_data, list):
            raise ValueError("AI response is not a JSON array.")
        for item in matched_jobs_data:
            if not all(k in item for k in ["job_id", "match_score"]):
                raise ValueError("AI response items are missing 'job_id' or 'match_score'.")
            if not isinstance(item["match_score"], int) or not (0 <= item["match_score"] <= 100):
                raise ValueError("AI 'match_score' is not a valid integer between 0 and 100.")

        job_scores_map = {item["job_id"]: item["match_score"] for item in matched_jobs_data}
        logger.debug(f"get_ai_job_matches: Created job scores map: {job_scores_map}")

        jobs_with_scores = [{
            "job": job,
            "match_score": job_scores_map.get(str(job.id), 0)
        } for job in all_open_jobs]
        
        sorted_jobs = sorted(jobs_with_scores, key=lambda x: x["match_score"], reverse=True)
        logger.info(f"get_ai_job_matches: Successfully sorted {len(sorted_jobs)} jobs. Returning results.")
        return sorted_jobs

    except genai.types.BlockedPromptException as e:
        logger.error(f"Gemini API request was blocked. Feedback: {e.response.prompt_feedback}")
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON response from Gemini API: {e}. Raw response was: {ai_output}")
        return []
    except ValueError as e:
        logger.error(f"AI response validation failed: {e}")
        return []
    except Exception as e:
        logger.error(f"An unexpected error occurred in get_ai_job_matches: {e}", exc_info=True)
        return []
