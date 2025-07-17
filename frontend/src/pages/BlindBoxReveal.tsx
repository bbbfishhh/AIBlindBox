import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Gift, PackageOpen, Sparkles, Eye, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlindBoxData } from "@/services/api";

interface SymbolCombination extends BlindBoxData {
  explanation?: string;
}

const BlindBoxReveal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { inputName, blindBoxData } = location.state || {};
  
  const [blindBoxes, setBlindBoxes] = useState<SymbolCombination[]>([]);
  const [openedBoxes, setOpenedBoxes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!inputName || !blindBoxData) {
      navigate("/name-input");
      return;
    }
    
    // 将后端数据转换为前端格式
    const formattedBlindBoxes: SymbolCombination[] = blindBoxData.map((box: BlindBoxData) => ({
      ...box,
      // explanation: `${box.imagery1}与${box.imagery2}的神秘组合，蕴含着独特的寓意等待您的发现。`
    }));
    
    setBlindBoxes(formattedBlindBoxes);
  }, [inputName, blindBoxData, navigate]);

  const handleOpenBox = async (boxId: number) => {
    if (openedBoxes.has(boxId) || isLoading) return;
    
    setIsLoading(boxId);
    
    try {
      // 盲盒数据已经包含图片URL，直接标记为已打开
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟打开动画
      
      setOpenedBoxes(prev => new Set([...prev, boxId]));
    } catch (error) {
      console.error("Failed to open box:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const allBoxesOpened = openedBoxes.size === blindBoxes.length;

  const handleViewReport = () => {
    navigate("/blind-box-report", {
      state: {
        inputName,
        openedBoxes: blindBoxes.filter(box => openedBoxes.has(box.id))
      }
    });
  };

  return (
    <div className="min-h-screen w-full py-8 px-4 bg-gradient-to-br from-blindbox-light to-blindbox-pink/20">
      <div className="max-w-6xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/name-input")}
            className="border-blindbox-primary text-blindbox-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回姓名输入
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-blindbox-primary">
              🎁 您的专属姓名盲盒已准备就绪
            </h1>
            <p className="text-lg text-gray-600">
              基于 "<span className="font-semibold text-blindbox-primary">{inputName}</span>" 生成的三个神秘盲盒
            </p>
            <Badge variant="outline" className="mt-2 border-blindbox-accent text-blindbox-accent">
              点击盲盒查看惊喜内容
            </Badge>
          </div>
          <div className="w-20" /> {/* 占位元素保持平衡 */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {blindBoxes.map((box) => {
            const isOpened = openedBoxes.has(box.id);
            const isCurrentlyLoading = isLoading === box.id;
            
            return (
              <Card 
                key={box.id}
                className={`relative transition-all duration-300 cursor-pointer hover:scale-105 ${
                  isOpened 
                    ? "bg-gradient-to-br from-white to-blindbox-light/50 border-blindbox-accent shadow-lg"
                    : "bg-white/90 border-blindbox-light hover:border-blindbox-accent"
                } border-2 shadow-md`}
                onClick={() => !isOpened && handleOpenBox(box.id)}
              >
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl text-blindbox-primary">
                    盲盒 #{box.id}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    {isCurrentlyLoading ? (
                      <div className="w-32 h-32 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blindbox-accent border-t-transparent" />
                      </div>
                    ) : isOpened ? (
                      <div className="space-y-4">
                        <div className="w-full h-32 rounded-lg overflow-hidden">
                          <img 
                            src={box.image_url} 
                            alt={`${box.imagery1} + ${box.imagery2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-semibold text-blindbox-primary">
                              {box.imagery1}
                            </span>
                            <span className="text-blindbox-accent">+</span>
                            <span className="text-lg font-semibold text-blindbox-primary">
                              {box.imagery2}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {box.explanation}
                          </p>
                          <Badge className="bg-blindbox-accent/10 text-blindbox-accent">
                            <PackageOpen className="w-3 h-3 mr-1" />
                            已揭晓
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center border-2 border-dashed border-blindbox-light rounded-lg hover:border-blindbox-accent transition-colors">
                        <Gift size={48} className="text-blindbox-primary animate-float" />
                      </div>
                    )}
                  </div>
                  
                  {!isOpened && !isCurrentlyLoading && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blindbox-primary text-blindbox-primary hover:bg-blindbox-primary/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        点击揭晓
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {allBoxesOpened && (
          <div className="text-center animate-fade-in">
            <Card className="max-w-md mx-auto bg-gradient-to-r from-blindbox-accent/10 to-blindbox-primary/10 border-blindbox-accent">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Sparkles className="w-12 h-12 mx-auto text-blindbox-accent" />
                  <h3 className="text-xl font-semibold text-blindbox-primary">
                    所有盲盒已揭晓完成！
                  </h3>
                  <p className="text-gray-600">
                    查看详细的盲盒分析报告，发现更多创意可能性
                  </p>
                  <Button
                    onClick={handleViewReport}
                    className="bg-gradient-to-r from-blindbox-primary to-blindbox-secondary hover:from-blindbox-secondary hover:to-blindbox-primary text-white"
                  >
                    查看盲盒报告
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlindBoxReveal;