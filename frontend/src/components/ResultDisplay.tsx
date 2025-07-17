
import React from "react";
import { Combination } from "@/data/elements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Sparkles, Download } from "lucide-react";

interface ResultDisplayProps {
  combination: Combination;
  imageUrl?: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ combination, imageUrl, onReset }) => {
  return (
    <Card className="w-[320px] md:w-[400px] bg-gradient-to-br from-blindbox-light to-white border-2 border-blindbox-primary/20 shadow-xl">
      <CardHeader className="relative overflow-hidden pb-2">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blindbox-primary via-blindbox-accent to-blindbox-blue" />
        <div className="flex items-center justify-center mb-2">
          {imageUrl ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt={combination.name} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="text-6xl animate-float">{combination.emoji}</span>
          )}
        </div>
        <CardTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blindbox-primary to-blindbox-blue">
          {combination.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-center text-gray-600">{combination.description}</p>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-blindbox-light/50">
            <span className="text-xl">{combination.element1.emoji}</span>
            <p className="text-sm font-medium">{combination.element1.name}</p>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-blindbox-pink/30">
            <span className="text-xl">{combination.element2.emoji}</span>
            <p className="text-sm font-medium">{combination.element2.name}</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full bg-blindbox-accent/10 px-3 py-1 text-sm font-medium text-blindbox-accent">
            <Sparkles className="mr-1 h-3 w-3" /> 
            可爱风格
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={onReset} 
          className="w-full bg-blindbox-primary hover:bg-blindbox-primary/80"
          size="lg"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> 
          再来一次
        </Button>

        {imageUrl && (
          <a 
            href={imageUrl}
            download={`${combination.name}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button 
              variant="outline"
              className="w-full border-blindbox-primary text-blindbox-primary hover:bg-blindbox-primary/10"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" /> 
              保存图片
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default ResultDisplay;
