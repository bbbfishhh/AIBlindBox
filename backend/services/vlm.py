# backend/services/vlm.py
import httpx
from typing import List, Optional, Dict, Any
from config import Config

class DoubaoSeedreamService:
    def __init__(self):
        self.api_key = Config.DOUBAO_SEEDREAM_API_KEY
        # This endpoint should be configured in your .env and config.py
        # Based on the documentation, it's typically: "https://ark.cn-beijing.volces.com/api/v3/images/generations"
        self.endpoint = Config.DOUBAO_SEEDREAM_ENDPOINT
        self.client = httpx.AsyncClient()

    async def generate_images(
        self,
        prompt: str, # Now takes a direct prompt string
        num_images: int = 1, # Default to 1 image for a general call, but can be changed
        size: str = "1024x1024", # Default image size
        response_format: str = "url", # Default to URL for download links
        model_id: str = "doubao-seedream-3-0-t2i-250415", # Default model ID as per docs
        seed: Optional[int] = None, # Optional random seed
        guidance_scale: Optional[float] = None, # Optional guidance scale
        watermark: bool = False # Optional watermark inclusion
    ) -> List[str]:
        """
        Calls the Doubao-Seedream API to generate images based on a given prompt.

        Args:
            prompt (str): The text prompt used to generate the image(s).
            num_images (int): The number of images to generate (e.g., 1, 3).
                              Note: The Doubao-Seedream API documentation sample only shows 'usage' with "generated_images": 1.
                              You might need to verify if it supports generating multiple images per single request
                              or if you need to make 'num_images' requests.
                              For this implementation, we assume the API can handle 'num_images' implicitly
                              or that the client is expected to call this method 'num_images' times if needed.
                              The current API structure returns 'data' as a list, implying multiple image support.
            size (str): The width and height in pixels for the generated image, e.g., "1024x1024".
                        Required to be between [512x512, 2048x2048].
            response_format (str): The desired format for the generated image(s).
                                   Options: "url" (downloadable JPEG link), "b64_json" (Base64 encoded string).
            model_id (str): The Model ID for the text-to-image model or an Endpoint ID.
            seed (Optional[int]): An optional random seed to control the randomness of the generated content.
                                  Using the same seed can help maintain relative stability.
            guidance_scale (Optional[float]): An optional value for the consistency between the model's output
                                              and the prompt. Higher values mean less freedom for the model.
            watermark (bool): Whether the generated image should include a watermark.

        Returns:
            List[str]: A list of URLs for the generated images.
                       If 'response_format' is "b64_json", this will return Base64 strings.

        Raises:
            Exception: If the API call fails or returns an error message.
        """

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        # The prompt is now directly passed to the method
        payload: Dict[str, Any] = {
            "model": model_id,
            "prompt": prompt,
            "response_format": response_format,
            "size": size,
            "watermark": watermark # Directly setting the boolean value
        }

        # Add optional parameters if provided
        if seed is not None:
            payload["seed"] = seed
        if guidance_scale is not None:
            payload["guidance_scale"] = guidance_scale

        print(f"Calling Doubao-Seedream with payload: {payload}") # For debugging

        try:
            # Increased timeout as image generation can be time-consuming
            response = await self.client.post(self.endpoint, headers=headers, json=payload, timeout=120)
            response.raise_for_status() # Raises HTTPStatusError for bad responses (4xx or 5xx)

            response_data = response.json()
            print(f"Doubao-Seedream response: {response_data}") # For debugging

            if response_data.get("error"):
                error_message = response_data["error"]
                print(f"Doubao-Seedream API returned error: {error_message}")
                raise Exception(f"Doubao-Seedream API error: {error_message}")

            if response_data and "data" in response_data and isinstance(response_data["data"], list):
                # Extract URLs or Base64 strings based on response_format
                if response_format == "url":
                    results = [item["url"] for item in response_data["data"] if "url" in item]
                elif response_format == "b64_json":
                    results = [item["b64_json"] for item in response_data["data"] if "b64_json" in item]
                else:
                    results = [] # Should not happen with valid response_format

                if len(results) < num_images:
                    print(f"Warning: Doubao-Seedream returned {len(results)} images, expected {num_images}.")
                return results
            else:
                # If the response structure is unexpected
                print(f"Unexpected Doubao-Seedream response structure: {response_data}")
                raise Exception("Failed to parse Doubao-Seedream response: invalid data format or missing 'data' key.")

        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            error_details = e.response.text
            print(f"Doubao-Seedream HTTP error {status_code}: {error_details}")
            if status_code == 400 and "SensitiveContentDetected" in error_details:
                raise Exception("Input or generated content may contain sensitive information. Please try a different prompt.")
            elif status_code == 429:
                raise Exception("Request rate limit exceeded. Please try again later.")
            else:
                raise Exception(f"Doubao-Seedream API request failed: {status_code} - {error_details}")
        except httpx.RequestError as e:
            print(f"Doubao-Seedream request error: {e}")
            raise Exception(f"Network or request error, unable to connect to Doubao-Seedream service: {e}")
        except Exception as e:
            print(f"An unexpected error occurred during Doubao-Seedream call: {e}")
            raise Exception(f"Image generation service internal error: {e}")

# Instantiate the service at the end of the file for import
doubao_vlm_service = DoubaoSeedreamService()