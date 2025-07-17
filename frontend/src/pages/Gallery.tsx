import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type CarouselApi } from "@/components/ui/carousel";
import { Sparkles, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// 样例数据 - 用户可以后续替换为实际样例
const galleryExamples = [
  {
    id: 1,
    name: "孙小鱼",
    description: "孙悟空 + 小鱼儿",
    imageUrl: "/images/Example1.JPG",
  },
  {
    id: 2,
    name: "李小龙",
    description: "水元素 + 小龙人",
    imageUrl: "/images/Example2.JPG",
  },
  {
    id: 3,
    name: "盐凤凰",
    description: "盐颗粒 + 凤凰",
    imageUrl: "/images/Example3.JPG",
  },
  {
    id: 4,
    name: "猫逸阳",
    description: "猫猫 + 羊",
    imageUrl: "/images/Example4.JPG",
  },
  {
    id: 5,
    name: "陆芳",
    description: "小鹿 + 樱花",
    imageUrl: "/images/Example5.JPG",
  },
];

const Gallery = () => {
  const navigate = useNavigate();
  const [api, setApi] = React.useState<CarouselApi>();
  const [isPaused, setIsPaused] = React.useState(false);

  const handleStartGeneration = () => {
    navigate("/name-input");
  };

  // 自动轮播功能
  useEffect(() => {
    if (!api || isPaused) return;

    const autoplay = setInterval(() => {
      api.scrollNext();
    }, 3000); // 每3秒自动切换

    return () => clearInterval(autoplay);
  }, [api, isPaused]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-8 px-4">
      {/* 顶部标题 */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="h-8 w-8 text-blindbox-accent animate-pulse" />
          <h1 className="text-4xl md:text-5xl font-bold text-blindbox-primary">
            N3 姓名盲盒制造！
          </h1>
          <Star className="h-8 w-8 text-blindbox-accent animate-pulse" />
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          <Sparkles className="h-5 w-5 text-blindbox-secondary" />
          <Sparkles className="h-4 w-4 text-blindbox-accent" />
          <Sparkles className="h-5 w-5 text-blindbox-secondary" />
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          创造独属于你自己的姓名盲盒！
        </p>
      </div>

      {/* 中部图库 - 横向滚动展示 */}
      <div className="w-full max-w-6xl mb-16">
        <h2 className="text-2xl font-semibold text-blindbox-primary text-center mb-8">
          ✨  ✨
        </h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {galleryExamples.map((example) => (
              <CarouselItem key={example.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="bg-white/90 backdrop-blur-sm border-2 border-blindbox-light hover:border-blindbox-accent transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <CardContent className="p-6">
                    {/* 图片占位区域 - 用户后续可插入实际图片 */}
                    <div className="aspect-square rounded-xl mb-4 flex items-center justify-center text-blindbox-secondary font-medium text-center p-4">
                      <img
                        src={example.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* 姓名和描述 */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-blindbox-primary mb-2">
                        {example.name}
                      </h3>
                      <p className="text-blindbox-secondary">
                        {example.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-blindbox-light hover:border-blindbox-accent" />
          <CarouselNext className="right-2 bg-white/80 hover:bg-white border-blindbox-light hover:border-blindbox-accent" />
        </Carousel>
      </div>

      {/* 底部CTA按钮 */}
      <div className="text-center">
        <Button
          onClick={handleStartGeneration}
          size="lg"
          className="bg-gradient-to-r from-blindbox-primary to-blindbox-secondary hover:from-blindbox-secondary hover:to-blindbox-primary text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          开始创造你的专属盲盒
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <p className="text-sm text-gray-500 mt-4">
          点击开始，输入你的姓名，发现属于你的奇妙组合
        </p>
      </div>
    </div>
  );
};

export default Gallery;