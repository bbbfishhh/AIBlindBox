# backend/user_models.py
from pydantic import BaseModel, Field, RootModel, HttpUrl
from typing import List


class NameInput(BaseModel):
    """
    Represents the input for name interpretation.
    """
    name: str = Field(..., description="The name to be interpreted.")


# 定义单个意象组合的模型
class ImageryCombination(BaseModel):
    """
    Represents a single imagery combination generated from a name.
    """
    id: int = Field(..., description="Unique identifier for the imagery combination.")
    imagery1: str = Field(..., description="The first concrete, representable imagery element.")
    imagery2: str = Field(..., description="The second concrete, representable imagery element.")

# 定义 LLM 整个响应的模型，它是一个包含 ImageryCombination 对象的列表
class InterpretNameLLMResponse(RootModel):
    """
    Represents the full JSON response expected from the LLM for name interpretation.
    It should be a list of ImageryCombination objects.
    """
    root: List[ImageryCombination] = Field(..., min_length=3, max_length=3, description="A list of exactly 3 imagery combinations.")

class ImageryInput(BaseModel):
    """
    Represents the input for imagery selection.
    """
    imagery1: str = Field(..., description="The first selected imagery element.")
    imagery2: str = Field(..., description="The second selected imagery element.")

class FeedbackInput(BaseModel):
    """
    Represents the input for feedback submission.
    """
    imagery1: str = Field(..., description="The first selected imagery element.")
    imagery2: str = Field(..., description="The second selected imagery element.")


class ImageResponse(BaseModel):
    """
    Response model for the image generation endpoint.
    Contains a list of URLs for the generated images.
    """
    # HttpUrl 类型会自动校验字符串是否是有效的URL格式
    # 并且在返回时，Pydantic 会将其转换为字符串
    images: List[HttpUrl] = Field(..., description="A list of URLs for the generated images.")


class FeedbackResponse(BaseModel):
    """
    Represents the response containing feedback.
    """
    feedback: str = Field(..., description="The feedback message.")


class NameImagesResponseItem(BaseModel):
    """
    Represents one blind box image result, including its imagery and generated image URL.
    """
    id: int = Field(..., description="Unique identifier for the imagery combination.")
    imagery1: str = Field(..., description="The first concrete, representable imagery element.")
    imagery2: str = Field(..., description="The second concrete, representable imagery element.")
    image_url: HttpUrl = Field(..., description="URL of the generated image.")

# for api:generate_name_images
class NameImagesResponse(RootModel):
    """
    Represents a list of blind box image results.
    """
    root: List[NameImagesResponseItem] = Field(..., description="A list of blind box image results.")
