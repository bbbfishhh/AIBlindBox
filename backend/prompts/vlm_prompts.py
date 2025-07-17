# backend/prompts/vlm_prompts.py

def get_image_generation_prompt(imagery1: str, imagery2: str) -> str:
    """
    Generates the prompt for the VLM to create an image based on two imagery elements,
    adhering to a blind box toy style.
    """
    return f"""
画一个融合了 '{imagery1}' 和 '{imagery2}' 特征的全新幻想生物。
以**真实感的盲盒玩具**风格呈现，参考**可爱泡泡玛特（Pop Mart）**系列的设计美学。
强调**精细的材质纹理**和**柔和的阴影处理**，使其具有强烈的**3D立体质感**。
背景应为**纯色**，简洁突出主体。
"""

# Add more VLM-specific prompts here (e.g., different styles, themes)