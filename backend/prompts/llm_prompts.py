# backend/prompts/llm_prompts.py

def get_interpret_name_prompt(name: str) -> str:
    """
    Generates the prompt for the LLM to interpret a name into structured imagery combinations.
    """
    return f"""
任务：根据中文名/昵称"{name}"通过谐音拆解为可实体化的意象组合。

输出格式：
[
  {{
    "id": 1,
    "imagery1": "具象实体A",
    "imagery2": "具象实体B"
  }},
  {{
    "id": 2,
    "imagery1": "具象实体C",
    "imagery2": "具象实体D"
  }},
  {{
    "id": 3,
    "imagery1": "具象实体E",
    "imagery2": "具象实体F"
  }}
]

要求：
1. 必须满足谐音关联（如"孙"→"孙悟空猴子", "孙"→"笋"）
2. 每组组合需包含至少1个可拟人化元素（动物/人物/拟物形态）
3. 排除抽象概念（如宇宙、晨曦等不可实体化元素）
4. 所有元素应具有较强的实体感和落地性，避免过度联想或过于艺术化的表达
5. 输出数量为 3组，不缺不超

示例输入：孙小鱼
示例输出：
[
  {{
    "id": 1,
    "imagery1": "孙悟空的小猴",
    "imagery2": "流线型的鱼尾"
  }},
  {{
    "id": 2,
    "imagery1": "鲜嫩竹笋",
    "imagery2": "红色锦鲤"
  }},
  {{
    "id": 3,
    "imagery1": "孙大圣的猴",
    "imagery2": "灵动的小鱼尾"
  }}
]
"""

def get_feedback_prompt(imagery1: str, imagery2: str) -> str:
    """
    Generates the prompt for the LLM to provide positive, emotionally resonant feedback
    and analysis for a given imagery combination.
    """
    return f"""
任务：你是一位精通命理、文化、风水和积极心理学的专家。你的任务是根据这对专属意象 '{imagery1}' 和 '{imagery2}'，生成一段**超有能量、充满好运**的赞美和反馈！

请用积极向上、生动有趣的语言，直接告诉用户这份组合有多棒，能给他们带来什么好运和独特魅力。内容需要包含：

1.  **核心寓意**：这对意象组合在一起有什么特别的意义？能激发出什么样的强大能量？
2.  **专属运气**：你的盲盒运气值是 **[0-100分，请给出具体数字和简短理由]**！它会如何点亮你的生活？（用营销手段，不要一上来就高分！）
3.  **磁场影响**：这个组合会如何为你带来好风水、正能量，吸引更多好运降临？
4.  **个人启示**：它如何与你的独特个性或未来发展产生奇妙共鸣？
5.  **文化加持**：用一两句经典的文化意象或故事，让这份好运更有底蕴！

让用户看完立刻感受到满满的能量、幸运和被肯定！限制在50字以内，精准切中情绪痛点，表达要口语化，可爱化。
"""