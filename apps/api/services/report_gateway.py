import os
import logging
import httpx

logger = logging.getLogger(__name__)

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
    base_url = os.getenv("USER_STORIES_STUDIO_SERVER", "")
    if not base_url:
        raise ValueError("Environment variable USER_STORIES_STUDIO_SERVER is not set.")

    url = f"{base_url.rstrip('/')}/api/vtt-reports-analysis/generate"

    payload = {
        "email": "vtt.email@email.com",
        "prompt": anonymized_vtt_text,
        "context": "",
        "role": "user"
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            logger.info("Calling report service: %s", url)
            response = await client.post(url, json=payload)
            logger.info("Report service status: %s", response.status_code)
            logger.debug("Report service raw response: %s", response.text[:3000])
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            status_code = exc.response.status_code if exc.response is not None else "unknown"
            error_body = exc.response.text[:3000] if exc.response is not None else str(exc)
            logger.error(
                "Report service HTTP error. status=%s url=%s body=%s",
                status_code,
                url,
                error_body,
            )
            raise
        except httpx.RequestError as exc:
            logger.error("Report service request error. url=%s error=%s", url, str(exc))
            raise

        # Parse Anthropic-style content array
        try:
            data = response.json()
            logger.debug("Report service parsed JSON: %s", str(data)[:3000])
            if isinstance(data, dict) and "content" in data:
                content_list = data.get("content", [])
                report_text = "".join(c.get("text", "") for c in content_list if isinstance(c, dict))
                return report_text or "Sin respuesta"
            
            # Fallback if structure is different
            if isinstance(data, str): return data
            return str(data)
        except Exception:
            # If not JSON, return as text
            logger.warning("Report service response is not JSON. Returning raw text.")
            return response.text
