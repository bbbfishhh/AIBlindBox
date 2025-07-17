
import React, { useState, useRef } from "react";
import { Box, Gift, PackageOpen, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createParticles } from "@/utils/combinationUtils";
import ResultDisplay from "./ResultDisplay";
import { useToast } from "@/components/ui/use-toast";
// BlindBox组件现在主要用于显示，实际API调用在页面级别处理

interface BlindBoxProps {
  symbol1?: string;
  symbol2?: string;
  onReset?: () => void;
}

const BlindBox: React.FC<BlindBoxProps> = ({ 
  symbol1 = "", 
  symbol2 = "", 
  onReset 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleShake = () => {
    if (isShaking || isOpen) return;
    
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
    
    toast({
      title: "摇一摇！",
      description: "里面好像有什么东西...",
      duration: 2000,
    });
  };

  const handleOpen = async () => {
    if (isOpen || isLoading) return;
    
    setIsLoading(true);
    toast({
      title: "正在生成你的专属创意",
      description: "请稍等片刻，图片生成需要一些时间...",
      duration: 5000,
    });
    
    try {
      // 模拟图片生成（实际调用在页面级别处理）
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockImageUrl = "https://via.placeholder.com/400x300?text=Generated+Image";
      
      setGeneratedImage(mockImageUrl);
        
        // Open the box
        setIsOpen(true);
        
        // Create particles for opening animation
        if (boxRef.current) {
          createParticles(boxRef.current, 30);
        }
        
        // Show result after box opening animation
        setTimeout(() => {
          setShowResult(true);
        }, 500);
        
        toast({
          title: "创意生成成功！",
          description: "你的专属可爱组合已经准备好了",
          duration: 3000,
        });
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "生成图像失败",
        description: "请检查网络连接或稍后再试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsOpen(false);
    setShowResult(false);
    setGeneratedImage(null);
    if (onReset) onReset();
  };

  const combinationName = symbol1 && symbol2 ? `${symbol1}${symbol2}` : "奇思妙想";
  const combinationDesc = symbol1 && symbol2 ? `${symbol1}与${symbol2}的奇妙组合` : "两个元素的神奇融合";

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {!showResult ? (
        <div className="relative">
          {/* 外层光环效果 */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 opacity-20 blur-lg animate-pulse"></div>
          
          {/* 主盲盒容器 */}
          <div 
            ref={boxRef} 
            className={`blind-box relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 shadow-2xl ${
              isShaking ? "animate-bounce" : ""
            } ${isOpen ? "scale-110" : "hover:scale-105"}`}
            onClick={!isOpen ? handleShake : undefined}
          >
            {/* 动态渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-500 animate-gradient-xy opacity-90"></div>
            
            {/* 动态光效层 */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shimmer"></div>
            
            {/* 微动粒子效果 */}
            {!isOpen && (
              <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/80 rounded-full animate-ping delay-300"></div>
                <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-white/70 rounded-full animate-ping delay-700"></div>
              </div>
            )}
            
            {/* 礼物盒图标 */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isOpen ? (
                <div className="relative">
                  <PackageOpen 
                    size={80} 
                    className="text-white drop-shadow-lg animate-bounce" 
                    strokeWidth={1.5} 
                  />
                  {/* 爆发光芒 */}
                  <div className="absolute -inset-8 bg-gradient-radial from-white/40 to-transparent rounded-full animate-ping"></div>
                </div>
              ) : isLoading ? (
                <div className="relative">
                  <RefreshCcw 
                    size={80} 
                    className="text-white drop-shadow-lg animate-spin" 
                    strokeWidth={1.5} 
                  />
                  <div className="absolute -inset-4 border-2 border-white/30 rounded-full animate-pulse"></div>
                </div>
              ) : (
                <div className="relative group">
                  <Gift 
                    size={80} 
                    className="text-white drop-shadow-lg transition-transform group-hover:scale-110 animate-pulse" 
                    strokeWidth={1.5} 
                  />
                  {/* 微动光晕 */}
                  <div className="absolute -inset-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                </div>
              )}
            </div>
            
            {/* 装饰边框 */}
            <div className="absolute inset-0 rounded-2xl border-2 border-white/30"></div>
          </div>
          
          {/* 底部按钮和文字 */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full mt-6 w-full flex flex-col items-center gap-3">
            {!isOpen && !isLoading && (
              <>
                <div className="text-center mb-2">
                  <p className="text-lg font-semibold text-purple-600 animate-pulse">摸一摸</p>
                  <p className="text-sm text-gray-500">里面有什么？</p>
                </div>
                <Button 
                  onClick={handleOpen}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                  disabled={isLoading}
                >
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" /> 打开盲盒
                </Button>
              </>
            )}
            
            {isLoading && (
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                </div>
                <p className="text-purple-600 font-semibold animate-pulse mb-1">
                  创意生成中...
                </p>
                <p className="text-xs text-gray-500">
                  图片生成需要一些时间，请耐心等待
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="opacity-0 animate-result-appear">
          <ResultDisplay 
            combination={{
              id: `${symbol1}-${symbol2}`,
              name: combinationName,
              description: combinationDesc,
              element1: { 
                id: "1", 
                name: symbol1, 
                description: `${symbol1}元素`, 
                emoji: "✨" 
              },
              element2: { 
                id: "2", 
                name: symbol2, 
                description: `${symbol2}元素`, 
                emoji: "🎨" 
              },
              emoji: "✨🎨",
            }} 
            imageUrl={generatedImage || ""}
            onReset={handleReset} 
          />
        </div>
      )}
    </div>
  );
};

export default BlindBox;
