import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateNameImages } from "@/services/api";

const NameInput = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "请输入姓名",
        description: "请输入您的姓名或任何关键词来生成专属盲盒",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 调用后端API生成盲盒数据
      const blindBoxData = await generateNameImages(name);
      
      // 跳转到盲盒揭晓页面，传递姓名和盲盒数据
      navigate("/blind-box-reveal", { 
        state: { inputName: name, blindBoxData }
      });
    } catch (error) {
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "生成盲盒时出现错误，请重试",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-8 px-4 bg-gradient-to-br from-blindbox-light to-blindbox-pink/20 overflow-hidden relative">
      {/* Decorative Balloons - 您可以在此处替换为您的气球图片 */}
      <img src="/images/red-ballon.svg" alt="Red Balloon" className="absolute top-1/2 left-10 w-40 h-auto transform -translate-y-1/2 opacity-70" style={{ animation: 'float 6s ease-in-out infinite' }} />
      <img src="/images/blue-ballon.svg" alt="blue Balloon" className="absolute top-1/4 right-20 w-20 h-auto opacity-70" style={{ animation: 'float 8s ease-in-out infinite 1s' }} />
      <img src="/images/green-ballon.svg" alt="green Balloon" className="absolute bottom-1/4 right-10 w-40 h-auto opacity-70" style={{ animation: 'float 7s ease-in-out infinite 2s' }}/>

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-blindbox-primary">
              创造专属姓名盲盒
            </h1>
            <Sparkles className="h-8 w-8 text-blindbox-accent animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            通过输入任何关于您的关键词，为您创造一个独一无二的，仅属于您自己的盲盒！
          </p>
        </div>

        <div className="relative w-full max-w-md mt-16">
          {/* Tilted Sample Image - 您可以在此处替换为您的样例图片 */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 z-20">
            <img 
              src="/images/Example1.JPG" // 这是一个占位符
              alt="姓名盲盒样例" 
              className="w-full h-auto object-cover rounded-lg border-4 border-white shadow-xl transform -rotate-6 hover:rotate-0 hover:scale-110 transition-transform duration-300"
            />
          </div>

          <Card className="w-full bg-white/90 backdrop-blur-sm border-2 border-blindbox-primary/20 shadow-xl pt-8">
            <CardContent className="pt-6">
              <CardTitle className="text-2xl text-blindbox-primary text-center mb-6">
                输入您的姓名
              </CardTitle>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="请输入您的姓名..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-lg py-3 border-blindbox-light focus:border-blindbox-accent"
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !name.trim()}
                  className="w-full bg-gradient-to-r from-blindbox-primary to-blindbox-secondary hover:from-blindbox-secondary hover:to-blindbox-primary text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      生成中...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      生成独属于我的姓名盲盒
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NameInput;