from rest_framework.views import exception_handler
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now, add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code

    # Log the error
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    logger.error(f"Context: {context}")

    # If it's an unhandled exception, return a generic 500 response
    if response is None:
        return Response({
            'status_code': 500,
            'detail': 'A server error occurred.'
        }, status=500)

    return response
