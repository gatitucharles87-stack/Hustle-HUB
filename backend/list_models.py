import google.generativeai as genai
import os

def list_gemini_models():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        return

    genai.configure(api_key=api_key)

    print("Available Gemini Models:")
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(f"  {m.name} (Supports generateContent)")
        else:
            print(f"  {m.name}")

if __name__ == "__main__":
    list_gemini_models()