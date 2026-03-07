import os
import httpx

async def generate_report(anonymized_vtt_text: str) -> str:
    """
    Sends the anonymized VTT content to the external User Stories Studio server
    at /vtt-reports-analysis/generate and returns the generated report as a string.

    Request format:
    {
      "email": "vtt.email@email.com",
      "prompt": "<anonymized_text>",
      "context": "",
      "role": "user"
    }

    The external service returns an Anthropic-style JSON:
    { "content": [ { "text": "Report content..." }, ... ] }
    """
    base_url = os.getenv("USER-STORIES-STUDIO-SERVER", "")
    if not base_url:
        raise ValueError("Environment variable USER-STORIES-STUDIO-SERVER is not set.")

    url = f"{base_url.rstrip('/')}/api/vtt-reports-analysis/generate"

    payload = {
        "email": "vtt.email@email.com",
        "prompt": anonymized_vtt_text,
        "context": "",
        "role": "user"
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()

        # Parse Anthropic-style content array
        try:
            data = response.json()
            if isinstance(data, dict) and "content" in data:
                content_list = data.get("content", [])
                report_text = "".join(c.get("text", "") for c in content_list if isinstance(c, dict))
                return report_text or "Sin respuesta"
            
            # Fallback if structure is different
            if isinstance(data, str): return data
            return str(data)
        except Exception:
            # If not JSON, return as text
            return response.text
