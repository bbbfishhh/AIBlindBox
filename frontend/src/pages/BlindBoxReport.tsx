import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, Sparkles, ArrowRight, Crown, Heart, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateFeedback, BlindBoxData } from "@/services/api";

// 使用API中定义的类型

const BlindBoxReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { inputName, openedBoxes } = location.state || {};
  
  const [reports, setReports] = useState<Array<{
    boxId: number;
    report: string;
    isLoading: boolean;
  }>>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<{
    symbol1: string;
    symbol2: string;
  }>({ symbol1: "", symbol2: "" });
  const [allSymbols, setAllSymbols] = useState<string[]>([]);

  // 初始化数据和生成报告
  useEffect(() => {
    if (!inputName || !openedBoxes) {
      navigate("/name-input");
      return;
    }

    // 为每个盲盒生成报告
    const generateReports = async () => {
      const initialReports = openedBoxes.map((box: BlindBoxData) => ({
        boxId: box.id,
        report: "",
        isLoading: true
      }));
      setReports(initialReports);

      // 调用API生成报告
      for (const box of openedBoxes) {
        try {
          const feedbackResult = await generateFeedback(box.imagery1, box.imagery2);
          
          setReports(prev => prev.map(report => 
            report.boxId === box.id 
              ? { ...report, report: feedbackResult.feedback, isLoading: false }
              : report
          ));
        } catch (error) {
          console.error(`Failed to generate report for box ${box.id}:`, error);
          setReports(prev => prev.map(report => 
            report.boxId === box.id 
              ? { ...report, report: "生成报告失败，请重试", isLoading: false }
              : report
          ));
        }
      }
    };

    generateReports();

    // 收集所有意象选项（合并固定意象库和姓名解析意象）
    const collectAllSymbols = () => {
      const symbolSet = new Set<string>();
      
      // 从已打开的盲盒中提取意象
      openedBoxes.forEach((box: BlindBoxData) => {
        symbolSet.add(box.imagery1);
        symbolSet.add(box.imagery2);
      });
      
      // 添加固定的意象库
      const fixedSymbols = ["凤凰", "小龙人", "小猴孙", "太阳", "月亮", "兔子", "牛", "大海", "猫猫", "鱼", "蛇", "九尾狐", "关羽", "马", "梅花", "鸟"];
      fixedSymbols.forEach(symbol => symbolSet.add(symbol));
      
      setAllSymbols(Array.from(symbolSet));
    };

    collectAllSymbols();
  }, [inputName, openedBoxes, navigate]);

  const getRarityLevel = (id: number) => {
    const rarities = ["稀有", "珍贵", "传说"];
    return rarities[id - 1] || "稀有";
  };

  const getRarityIcon = (id: number) => {
    const icons = [Crown, Star, Zap];
    const Icon = icons[id - 1] || Star;
    return Icon;
  };

  const getRarityColor = (id: number) => {
    const colors = ["text-yellow-500", "text-purple-500", "text-red-500"];
    return colors[id - 1] || "text-yellow-500";
  };

  const handleSymbolToggle = (symbol: string) => {
    setSelectedSymbols(prev => {
      if (prev.symbol1 === symbol) {
        return { ...prev, symbol1: "" };
      } else if (prev.symbol2 === symbol) {
        return { ...prev, symbol2: "" };
      } else if (!prev.symbol1) {
        return { ...prev, symbol1: symbol };
      } else if (!prev.symbol2) {
        return { ...prev, symbol2: symbol };
      } else {
        // 替换第一个选中的
        return { symbol1: symbol, symbol2: prev.symbol2 };
      }
    });
  };

  const handleGenerateNewBox = () => {
    if (!selectedSymbols.symbol1 || !selectedSymbols.symbol2) return;
    
    navigate("/final-generation", {
      state: {
        inputName,
        selectedSymbols: [selectedSymbols.symbol1, selectedSymbols.symbol2],
        originalBlindBoxes: openedBoxes
      }
    });
  };

  if (!openedBoxes) {
    navigate("/name-input");
    return null;
  }

  return (
    <div className="min-h-screen w-full py-8 px-4 bg-gradient-to-br from-blindbox-light to-blindbox-pink/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blindbox-primary mb-4">
            📊 "{inputName}" 的盲盒分析报告
          </h1>
          <p className="text-lg text-gray-600">
            每个盲盒都有独特的稀有度和情感价值，现在可以选择新的组合进行再创作
          </p>
        </div>

        {/* 盲盒报告展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {openedBoxes.map((box: BlindBoxData) => {
            const report = reports.find(r => r.boxId === box.id);
            const RarityIcon = getRarityIcon(box.id);
            const rarityColor = getRarityColor(box.id);
            const rarity = getRarityLevel(box.id);
            
            return (
              <Card key={box.id} className="bg-white/90 border-2 border-blindbox-light shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <RarityIcon className={`w-5 h-5 ${rarityColor}`} />
                    <Badge variant="outline" className={`${rarityColor} border-current`}>
                      {rarity}级
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-blindbox-primary">
                    {box.imagery1} + {box.imagery2}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="w-full h-32 rounded-lg overflow-hidden">
                    <img 
                      src={box.image_url} 
                      alt={`${box.imagery1} + ${box.imagery2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {report?.isLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-gray-600">正在生成深度解析...</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {report?.report || `${box.imagery1}与${box.imagery2}的神秘组合，蕴含着独特的寓意。`}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 意象选择区域 */}
        <Card className="bg-white/90 border-2 border-blindbox-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blindbox-primary flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              选择两个意象进行再创作
            </CardTitle>
            <p className="text-gray-600">
              从下方选择任意两个意象标签，创造全新的盲盒组合
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 统一意象选择区域 */}
            <div>
              <h3 className="text-lg font-semibold text-blindbox-primary mb-3">
                选择意象进行组合 (从所有可用意象中选择两个)
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {allSymbols.map((symbol) => (
                  <Button
                    key={symbol}
                    variant={selectedSymbols.symbol1 === symbol || selectedSymbols.symbol2 === symbol ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSymbolToggle(symbol)}
                    className={selectedSymbols.symbol1 === symbol || selectedSymbols.symbol2 === symbol
                      ? "bg-blindbox-accent hover:bg-blindbox-accent/80" 
                      : "border-blindbox-light hover:border-blindbox-accent"
                    }
                  >
                    {symbol}
                  </Button>
                ))}
              </div>
            </div>

            {/* 选择状态显示 */}
            <div className="mt-8 p-4 bg-blindbox-light/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blindbox-primary">
                    已选择: {[selectedSymbols.symbol1, selectedSymbols.symbol2].filter(Boolean).length}/2
                  </span>
                  {(selectedSymbols.symbol1 || selectedSymbols.symbol2) && (
                    <div className="flex gap-2">
                      {selectedSymbols.symbol1 && (
                        <Badge className="bg-blindbox-accent text-white">
                          {selectedSymbols.symbol1}
                        </Badge>
                      )}
                      {selectedSymbols.symbol2 && (
                        <Badge className="bg-blindbox-accent text-white">
                          {selectedSymbols.symbol2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleGenerateNewBox}
                  disabled={!selectedSymbols.symbol1 || !selectedSymbols.symbol2}
                  className="bg-gradient-to-r from-blindbox-primary to-blindbox-secondary hover:from-blindbox-secondary hover:to-blindbox-primary disabled:opacity-50"
                >
                  生成新盲盒
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlindBoxReport;