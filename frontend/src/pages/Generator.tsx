import React, { useState, useEffect } from "react";
import BlindBox from "@/components/BlindBox";
import { Sparkles, Search, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { generateNameImages, checkApiConnection, type SymbolOption } from "@/services/api";

const Index = () => {
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [symbolOptions, setSymbolOptions] = useState<SymbolOption[]>([]);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>("");
  const [showBlindBox, setShowBlindBox] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  
  // 检查API连接状态
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await checkApiConnection();
      setApiConnected(connected);
      if (!connected) {
        console.log('API connection failed - backend may not be running');
      }
    };
    
    checkConnection();
  }, []);
  
  const handleAnalyze = async () => {
    if (!name.trim()) {
      toast({
        title: "请输入您的姓名或昵称",
        description: "需要分析姓名才能生成创意组合",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await generateNameImages(name);
      setSymbolOptions(response.symbol_dict);
      
      // Auto-select first option
      if (response.symbol_dict.length > 0) {
        setSelectedSymbolId(response.symbol_dict[0].id.toString());
      }
      
      toast({
        title: "分析完成",
        description: `从"${name}"中找到了${response.symbol_dict.length}个可能的意象组合`,
      });
      
      // 连接成功后更新状态
      setApiConnected(true);
    } catch (error) {
      console.error('Symbol generation error:', error);
      const errorMessage = error instanceof Error ? error.message : "分析失败，请稍后重试";
      
      toast({
        title: "分析失败",
        description: errorMessage,
        variant: "destructive"
      });
      
      // 如果是网络连接问题，更新连接状态
      if (errorMessage.includes('无法连接')) {
        setApiConnected(false);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleGenerateImage = () => {
    if (!selectedSymbolId) {
      toast({
        title: "请选择一个意象组合",
        description: "需要选择意象组合才能生成盲盒",
        variant: "destructive"
      });
      return;
    }
    
    setShowBlindBox(true);
    
    // Scroll to blindbox
    setTimeout(() => {
      document.getElementById("blindbox-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  const resetGenerator = () => {
    setShowBlindBox(false);
    setSymbolOptions([]);
    setSelectedSymbolId("");
  };

  const selectedSymbol = symbolOptions.find(option => option.id.toString() === selectedSymbolId);
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-10 px-4">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blindbox-primary flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-blindbox-accent" />
          奇思妙想盲盒
          <Sparkles className="h-6 w-6 text-blindbox-accent" />
        </h1>
        <p className="text-lg text-gray-600">
          输入你的姓名或昵称，探索奇妙组合！
        </p>
      </div>
      
      {/* API连接状态提示 */}
      {apiConnected === false && (
        <Alert className="mb-6 max-w-md border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>后端服务未连接</strong><br />
            请确保后端服务已启动并运行在 localhost:8000
          </AlertDescription>
        </Alert>
      )}
      
      {apiConnected === true && (
        <Alert className="mb-6 max-w-md border-green-200 bg-green-50">
          <Wifi className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            后端服务连接正常
          </AlertDescription>
        </Alert>
      )}
      
      {!showBlindBox ? (
        <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border border-blindbox-light">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">姓名或昵称</label>
              <div className="flex gap-2">
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="请输入姓名或昵称"
                  className="flex-1"
                />
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !name.trim()}
                  variant="outline"
                  className="bg-blindbox-primary text-white hover:bg-blindbox-primary/80"
                >
                  <Search className="h-4 w-4 mr-1" />
                  {isAnalyzing ? "分析中..." : "分析"}
                </Button>
              </div>
            </div>
            
            {symbolOptions.length > 0 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">选择意象组合</label>
                  <Select value={selectedSymbolId} onValueChange={setSelectedSymbolId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择一个意象组合" />
                    </SelectTrigger>
                    <SelectContent>
                      {symbolOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                          {option.symbol1} + {option.symbol2}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleGenerateImage}
                  className="w-full bg-blindbox-accent hover:bg-blindbox-accent/80 text-white"
                  disabled={!selectedSymbolId}
                >
                  <Sparkles className="mr-2 h-4 w-4" /> 
                  生成可爱盲盒
                </Button>
                
                <p className="text-xs text-center text-gray-500">
                  盲盒将根据你选择的意象生成可爱风格的创意组合
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div id="blindbox-section" className="w-full flex flex-col items-center justify-center">
          <BlindBox 
            symbol1={selectedSymbol?.symbol1 || ""} 
            symbol2={selectedSymbol?.symbol2 || ""} 
            onReset={resetGenerator} 
          />
        </div>
      )}
      
      {!showBlindBox && (
        <div className="mt-12 md:mt-16 text-center max-w-md">
          <h2 className="font-medium text-xl mb-2 text-blindbox-primary">如何玩？</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li>1. 输入你的姓名或昵称</li>
            <li>2. 从分析结果中选择一个意象组合</li>
            <li>3. 点击生成可爱盲盒</li>
            <li>4. 摇一摇盲盒，查看你的专属创意组合！</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Index;
