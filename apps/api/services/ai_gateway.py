import httpx
from typing import Optional

AI_GATEWAY_URL = "http://localhost:3000/api/generate-user-story"

async def generate_user_story(markdown_content: str) -> Optional[str]:
    """
    Calls the AI Gateway service to generate a user story from the given transcript.
    """
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            # Assuming the payload is {"input": markdown_content} 
            # We will need to verify if the Swagger says otherwise.
            # Typical payloads for these endpoints are "context", "input", or "requirement".
            response = await client.post(
                AI_GATEWAY_URL,
                json={"requirement": markdown_content}
            )
            
            if response.status_code == 200:
                data = response.json()
                # Assuming the response has a field like 'userStory' or 'result'
                # Based on the swagger path post_api_generate_user_story
                # Let's try to handle different potential response shapes.
                return data.get("userStory") or data.get("result") or data.get("content")
            
            print(f"AI Gateway error: {response.status_code} - {response.text}")
            return None
            
        except Exception as e:
            print(f"Error calling AI Gateway: {str(e)}")
            return None
