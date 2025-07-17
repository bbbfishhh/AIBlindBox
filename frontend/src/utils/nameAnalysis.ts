
// Simplified Chinese character to imagery mapping
const characterToImagery: Record<string, string[]> = {
  // Common last names
  '张': ['帐篷', '长颈鹿'],
  '王': ['王冠', '皇冕'],
  '李': ['梨子', '李子'],
  '赵': ['赵钱孙李', '超人'],
  '陈': ['沉船', '陈列品'],
  '刘': ['流水', '刘海'],
  '杨': ['杨树', '阳光'],
  '黄': ['黄色', '蜜蜂'],
  '周': ['舟船', '粥'],
  '吴': ['乌鸦', '舞者'],
  '徐': ['徐徐微风', '须鲸'],
  '孙': ['孙悟空', '竹笋'],
  '马': ['马匹', '蚂蚁'],
  '朱': ['朱砂', '猪'],
  '胡': ['胡须', '狐狸'],
  '郭': ['果实', '锅'],
  '何': ['河流', '禾苗'],
  '高': ['高山', '羔羊'],
  '林': ['森林', '木林'],
  '罗': ['螺旋', '罗盘'],

  // Common first name characters
  '伟': ['威武', '卫星'],
  '芳': ['芳香', '花朵'],
  '娜': ['娜美', '纳米'],
  '秀': ['秀丽', '绣花'],
  '英': ['英雄', '樱花'],
  '华': ['华丽', '花朵'],
  '明': ['明亮', '明星'],
  '丽': ['丽人', '梨花'],
  '涛': ['波涛', '滔滔'],
  '强': ['强壮', '墙'],
  '晨': ['晨曦', '尘埃'],
  '燕': ['燕子', '眼镜'],
  '红': ['红色', '虹'],
  '娟': ['娟秀', '卷轴'],
  '玉': ['玉石', '雨滴'],
  '洁': ['洁白', '杰出'],
  '静': ['静谧', '井'],
  '敏': ['敏捷', '蜜蜂'],
  '文': ['文字', '温柔'],
  '博': ['博学', '薄荷'],
  '欢': ['欢乐', '幻影'],
  '海': ['海洋', '嗨'],
  '凯': ['凯旋', '开心'],
  
  // Single digits and letters (for English names or usernames)
  'a': ['苹果', '箭头'],
  'b': ['蝙蝠', '气球'],
  'c': ['猫', '月亮'],
  'd': ['狗', '钻石'],
  'e': ['大象', '鹰'],
  'f': ['花', '火焰'],
  'g': ['鬼', '坚果'],
  'h': ['帽子', '心脏'],
  'i': ['冰淇淋', '岛屿'],
  'j': ['果酱', '竹子'],
  'k': ['钥匙', '袋鼠'],
  'l': ['灯笼', '狮子'],
  'm': ['山', '月亮'],
  'n': ['鸟巢', '鼻子'],
  'o': ['橙子', '猫头鹰'],
  'p': ['钢笔', '企鹅'],
  'q': ['皇后', '问号'],
  'r': ['兔子', '彩虹'],
  's': ['蛇', '星星'],
  't': ['茶', '老虎'],
  'u': ['独角兽', '伞'],
  'v': ['小提琴', '火山'],
  'w': ['鲸鱼', '魔杖'],
  'x': ['木琴', '狐狸'],
  'y': ['瑜伽', '黄色'],
  'z': ['斑马', '闪电'],
  '0': ['蛋', '圆圈'],
  '1': ['火箭', '铅笔'],
  '2': ['天鹅', '双胞胎'],
  '3': ['三叉戟', '三明治'],
  '4': ['帆船', '四叶草'],
  '5': ['钩子', '手掌'],
  '6': ['蜗牛', '樱桃'],
  '7': ['魔杖', '七彩虹'],
  '8': ['眼镜', '沙漏'],
  '9': ['气球', '九条尾巴'],
};

// Additional imagery options to enrich results
const genericImagery: string[] = [
  '龙', '凤凰', '猫', '狗', '老虎', '兔子', '熊猫', '大象',
  '花朵', '树木', '云彩', '星星', '月亮', '太阳', '彩虹',
  '水晶', '钻石', '宝石', '皇冠', '城堡', '船', '火箭',
  '音符', '书本', '魔法棒', '剑', '盾牌', '风', '火', '水', '土',
  '蜂蜜', '糖果', '冰淇淋', '蛋糕', '面包', '果汁', '茶',
  '机器人', '宇航员', '超人', '仙女', '精灵', '巫师'
];

/**
 * Analyzes a name and returns possible imagery combinations
 */
export const analyzeName = (name: string): { element1Options: string[], element2Options: string[] } => {
  const element1Options: string[] = [];
  const element2Options: string[] = [];
  
  // Process each character in the name
  for (let i = 0; i < name.length; i++) {
    const char = name[i].toLowerCase();
    
    if (characterToImagery[char]) {
      // Add all imagery for this character to options
      characterToImagery[char].forEach(imagery => {
        // Alternate between element1 and element2 options
        if (i % 2 === 0) {
          if (!element1Options.includes(imagery)) {
            element1Options.push(imagery);
          }
        } else {
          if (!element2Options.includes(imagery)) {
            element2Options.push(imagery);
          }
        }
      });
    }
  }
  
  // If we don't have enough options, add some generic ones
  if (element1Options.length < 3) {
    // Add some generic imagery to ensure we have at least a few options
    genericImagery.slice(0, 5).forEach(imagery => {
      if (!element1Options.includes(imagery)) {
        element1Options.push(imagery);
      }
    });
  }
  
  if (element2Options.length < 3) {
    // Add different generic imagery for element2
    genericImagery.slice(5, 10).forEach(imagery => {
      if (!element2Options.includes(imagery)) {
        element2Options.push(imagery);
      }
    });
  }
  
  return {
    element1Options,
    element2Options
  };
};

// Available style options for image generation
export const imageStyles = [
  { value: "realistic", label: "写实风格" },
  { value: "cartoon", label: "卡通风格" },
  { value: "watercolor", label: "水彩风格" },
  { value: "ink", label: "水墨风格" },
  { value: "3d", label: "3D立体风格" },
  { value: "anime", label: "动漫风格" },
  { value: "pixar", label: "皮克斯风格" },
];

// Template for image generation prompt
export const generateImagePrompt = (element1: string, element2: string, style: string): string => {
  const basePrompt = `A creative, whimsical fusion of ${element1} and ${element2}`;
  
  // Add style-specific keywords
  switch(style) {
    case "realistic":
      return `${basePrompt}, photorealistic, detailed texture, studio lighting, 8k`;
    case "cartoon":
      return `${basePrompt}, cartoon style, vibrant colors, simple shapes, cute character design`;
    case "watercolor":
      return `${basePrompt}, watercolor painting, soft edges, flowing pigments, artistic, traditional media`;
    case "ink":
      return `${basePrompt}, Chinese ink painting, elegant brush strokes, minimalist, black and white with subtle color accents`;
    case "3d":
      return `${basePrompt}, 3D render, volumetric lighting, smooth surfaces, Pixar style, computer generated`;
    case "anime":
      return `${basePrompt}, anime style, vibrant colors, big expressive eyes, stylized features`;
    case "pixar":
      return `${basePrompt}, Pixar style, 3D animation, expressive character, polished, family-friendly`;
    default:
      return basePrompt;
  }
};
