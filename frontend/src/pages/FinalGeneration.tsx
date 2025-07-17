import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Gift, PackageOpen, RefreshCw, ArrowLeft, Download, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateImageFromImageries } from "@/services/api";

interface GeneratedBox {
  id: string;
  symbol1: string;
  symbol2: string;
  imageUrl?: string;
  rarity: string;
  analysis: string;
  isOpened: boolean;
}

const FinalGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { inputName, selectedSymbols, originalBlindBoxes } = location.state || {};
  
  const [currentBox, setCurrentBox] = useState<GeneratedBox | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<GeneratedBox[]>([]);

  useEffect(() => {
    if (!selectedSymbols || selectedSymbols.length !== 2) {
      navigate("/blind-box-report");
      return;
    }
    
    generateNewBox();
  }, [selectedSymbols, navigate]);

  const generateNewBox = async () => {
    if (!selectedSymbols || selectedSymbols.length !== 2) return;
    
    setIsGenerating(true);
    setCurrentBox(null);
    
    try {
      // 调用后端API生成新的盲盒图片
      const result = await generateImageFromImageries(selectedSymbols[0], selectedSymbols[1]);
      
      const newBox: GeneratedBox = {
        id: `${Date.now()}`,
        symbol1: selectedSymbols[0],
        symbol2: selectedSymbols[1],
        rarity: getRandomRarity(),
        analysis: generateAnalysis(selectedSymbols[0], selectedSymbols[1]),
        isOpened: false,
        imageUrl: result.images[0] // 使用生成的第一张图片
      };
      
      setCurrentBox(newBox);
      
      toast({
        title: "盲盒生成成功！",
        description: "您的专属创意盲盒已准备就绪",
      });
    } catch (error) {
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const openCurrentBox = async () => {
    if (!currentBox || currentBox.isOpened || isOpening) return;
    
    setIsOpening(true);
    
    try {
      // 盲盒已经包含生成的图片，直接开启
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟开启动画
      
      const openedBox = {
        ...currentBox,
        isOpened: true
      };
      
      setCurrentBox(openedBox);
      setGenerationHistory(prev => [openedBox, ...prev]);
      
      toast({
        title: "盲盒已开启！",
        description: `${currentBox.symbol1} × ${currentBox.symbol2} 的奇妙融合`,
      });
    } catch (error) {
      toast({
        title: "开启失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsOpening(false);
    }
  };

  const getRandomRarity = () => {
    const rarities = ["稀有", "珍贵", "传说", "史诗"];
    return rarities[Math.floor(Math.random() * rarities.length)];
  };

  const generateAnalysis = (symbol1: string, symbol2: string) => {
    const analyses = [
      `${symbol1}的力量与${symbol2}的美学完美融合，创造出独特的视觉盛宴`,
      `这是${symbol1}与${symbol2}跨越时空的相遇，充满了无限的想象空间`,
      `${symbol1}的精神内核与${symbol2}的外在表现形成了和谐统一`,
      `从${symbol1}到${symbol2}，这是一场关于美与力量的对话`
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      "稀有": "text-blue-500 border-blue-500",
      "珍贵": "text-purple-500 border-purple-500", 
      "传说": "text-yellow-500 border-yellow-500",
      "史诗": "text-red-500 border-red-500"
    };
    return colors[rarity as keyof typeof colors] || "text-blue-500 border-blue-500";
  };

  return (
    <div className="min-h-screen w-full py-8 px-4 bg-gradient-to-br from-blindbox-light to-blindbox-pink/20">
      <div className="max-w-4xl mx-auto">
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
              最终生成与再创作
            </h1>
            <p className="text-gray-600">
              {selectedSymbols?.join(" × ")} 的奇妙组合
            </p>
          </div>
          
          <div className="w-20" /> {/* 占位元素保持平衡 */}
        </div>

        {/* 当前盲盒生成区域 */}
        <div className="mb-8">
          {isGenerating ? (
            <Card className="max-w-lg mx-auto bg-white/90 border-2 border-blindbox-primary/20">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blindbox-accent border-t-transparent mb-4" />
                <h3 className="text-xl font-semibold text-blindbox-primary mb-2">
                  正在生成您的专属盲盒...
                </h3>
                <p className="text-gray-600 text-center">
                  {selectedSymbols?.[0]} 与 {selectedSymbols?.[1]} 的创意融合进行中
                </p>
              </CardContent>
            </Card>
          ) : currentBox && (
            <Card className="max-w-lg mx-auto bg-white/90 border-2 border-blindbox-primary/20 shadow-xl">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge className={`${getRarityColor(currentBox.rarity)} bg-transparent`}>
                    {currentBox.rarity}级
                  </Badge>
                </div>
                <CardTitle className="text-xl text-blindbox-primary">
                  {currentBox.symbol1} × {currentBox.symbol2}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  {isOpening ? (
                    <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-blindbox-accent rounded-lg">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blindbox-accent border-t-transparent" />
                    </div>
                  ) : currentBox.isOpened ? (
                    <div className="space-y-4">
                      <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={currentBox.imageUrl} 
                          alt={`${currentBox.symbol1} × ${currentBox.symbol2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center space-y-3">
                        <div className="bg-blindbox-light/30 p-4 rounded-lg">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-red-400" />
                            <span className="font-semibold text-blindbox-primary">创意分析</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {currentBox.analysis}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = currentBox.imageUrl || '';
                              link.download = `${currentBox.symbol1}-${currentBox.symbol2}.jpg`;
                              link.click();
                            }}
                            className="border-blindbox-primary text-blindbox-primary"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            保存
                          </Button>
                          
                          <Button
                            onClick={generateNewBox}
                            size="sm"
                            className="bg-blindbox-accent hover:bg-blindbox-accent/80"
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            再生成
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-blindbox-primary rounded-lg cursor-pointer hover:border-blindbox-accent transition-colors"
                      onClick={openCurrentBox}
                    >
                      <div className="text-center">
                        <Gift size={64} className="text-blindbox-primary mx-auto mb-2 animate-float" />
                        <p className="text-sm text-blindbox-primary font-medium">
                          点击开启盲盒
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {!currentBox.isOpened && !isOpening && (
                  <div className="text-center">
                    <Button
                      onClick={openCurrentBox}
                      className="bg-gradient-to-r from-blindbox-primary to-blindbox-secondary hover:from-blindbox-secondary hover:to-blindbox-primary"
                    >
                      <PackageOpen className="w-4 h-4 mr-2" />
                      开启盲盒
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* 重新生成按钮 */}
        {currentBox && !isGenerating && (
          <div className="text-center mb-8">
            <Button
              onClick={generateNewBox}
              variant="outline"
              size="lg"
              className="border-blindbox-accent text-blindbox-accent hover:bg-blindbox-accent/10"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              不满意？再生成一个
            </Button>
          </div>
        )}

        {/* 历史生成记录 */}
        {generationHistory.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-blindbox-primary mb-4 text-center">
              历史生成记录
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generationHistory.map((box) => (
                <Card key={box.id} className="bg-white/80 border border-blindbox-light">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blindbox-primary">
                        {box.symbol1} × {box.symbol2}
                      </span>
                      <Badge className={`${getRarityColor(box.rarity)} bg-transparent text-xs`}>
                        {box.rarity}
                      </Badge>
                    </div>
                    <div className="w-full h-24 rounded overflow-hidden mb-2">
                      <img 
                        src={box.imageUrl} 
                        alt={`${box.symbol1} × ${box.symbol2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {box.analysis}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinalGeneration;