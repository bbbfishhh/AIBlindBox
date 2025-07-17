
// Element type definitions
export type Element = {
  id: string;
  name: string;
  description: string;
  emoji: string;
};

export type Combination = {
  id: string;
  name: string;
  description: string;
  element1: Element;
  element2: Element;
  emoji: string;
};

// First set of elements
export const elements: Element[] = [
  {
    id: "bamboo",
    name: "竹子",
    description: "修长挺直的竹子",
    emoji: "🎋",
  },
  {
    id: "doraemon",
    name: "哆啦A梦",
    description: "来自未来的机器猫",
    emoji: "🐱",
  },
  {
    id: "fish",
    name: "小鱼",
    description: "活泼可爱的小鱼",
    emoji: "🐟",
  },
  {
    id: "bamboo_shoot",
    name: "笋",
    description: "鲜嫩可口的竹笋",
    emoji: "🌱",
  },
  {
    id: "crab",
    name: "蟹",
    description: "横行霸道的螃蟹",
    emoji: "🦀",
  },
  {
    id: "apple",
    name: "苹果",
    description: "红润多汁的苹果",
    emoji: "🍎",
  },
  {
    id: "star",
    name: "星星",
    description: "闪烁的星星",
    emoji: "⭐",
  },
  {
    id: "cloud",
    name: "云朵",
    description: "飘浮的云",
    emoji: "☁️",
  },
  {
    id: "cat",
    name: "猫咪",
    description: "慵懒的猫",
    emoji: "😺",
  },
  {
    id: "robot",
    name: "机器人",
    description: "智能机器人",
    emoji: "🤖",
  },
];

// Example predefined combinations
export const predefinedCombinations: Combination[] = [
  {
    id: "sunxiaoyu",
    name: "孙小鱼",
    description: "笋和小鱼的有趣组合",
    element1: elements.find(e => e.id === "bamboo_shoot")!,
    element2: elements.find(e => e.id === "fish")!,
    emoji: "🌱🐟",
  },
  {
    id: "mudabao",
    name: "木大宝",
    description: "竹子和哆啦A梦的奇特组合",
    element1: elements.find(e => e.id === "bamboo")!,
    element2: elements.find(e => e.id === "doraemon")!,
    emoji: "🎋🐱",
  },
  {
    id: "xiepingguo",
    name: "谢苹果",
    description: "蟹和苹果的美味组合",
    element1: elements.find(e => e.id === "crab")!,
    element2: elements.find(e => e.id === "apple")!,
    emoji: "🦀🍎",
  },
  {
    id: "starcat",
    name: "星星猫",
    description: "星星和猫咪的梦幻组合",
    element1: elements.find(e => e.id === "star")!,
    element2: elements.find(e => e.id === "cat")!,
    emoji: "⭐😺",
  },
  {
    id: "cloudrobot",
    name: "云朵机器人",
    description: "云朵和机器人的科技组合",
    element1: elements.find(e => e.id === "cloud")!,
    element2: elements.find(e => e.id === "robot")!,
    emoji: "☁️🤖",
  },
];
