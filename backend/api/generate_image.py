from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict
from services.vlm import doubao_vlm_service
from models.user_models import ImageryInput, ImageResponse, NameImagesResponse, NameImagesResponseItem, NameInput
from api.interpret_name import interpret_name
from prompts.vlm_prompts import get_image_generation_prompt

generate_image_router = APIRouter()

@generate_image_router.post("/api/generate_image", response_model=ImageResponse)
async def generate_image(input: ImageryInput):
    try:
        prompt = get_image_generation_prompt(input.imagery1, input.imagery2)

        # 内部参数，不暴露给用户
        num_images = 1  # 生成图片的数量
        image_size = "1024x1024"  # 图片尺寸

        images = await doubao_vlm_service.generate_images(
            prompt=prompt, num_images=num_images, size=image_size
        )

        # 确保返回的是 HttpUrl 列表
        http_url_images = [HttpUrl(url) for url in images]

        return ImageResponse(images=http_url_images)
    except Exception as e:
        print(f"Error generating image: {e}")  # 添加日志记录
        raise HTTPException(status_code=500, detail=str(e))


@generate_image_router.post("/api/generate_name_images", response_model=NameImagesResponse)
async def generate_name_blindbox(input: NameInput):
    try:
        # 1. 调用 /api/interpret_name 获取意象组合
        interpret_result = await interpret_name(input)

        # 2. 循环调用 /api/generate_image 生成图片
        blindbox_results = []
        for item in interpret_result.root:
            imagery_input = {"imagery1": item.imagery1, "imagery2": item.imagery2}
            image_response = await generate_image(ImageryInput(**imagery_input))
            # 假设 generate_image 返回的是 ImageResponse，需要提取 URL
            image_url = image_response.images[0] if image_response.images else None
            if image_url:
                # 创建 NameImagesResponseItem 对象
                name_image_response_item = NameImagesResponseItem(
                    id=item.id,
                    imagery1=item.imagery1,
                    imagery2=item.imagery2,
                    image_url=image_url  # 使用别名 imageUrl
                )
                blindbox_results.append(name_image_response_item)

        # 3. 返回所有图片 URL
        return NameImagesResponse(root=blindbox_results)

    except Exception as e:
        print(f"Error generating name blindbox: {e}")
        raise HTTPException(status_code=500, detail=str(e))