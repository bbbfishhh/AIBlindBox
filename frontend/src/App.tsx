import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import NameInput from "./pages/NameInput";
import BlindBoxReveal from "./pages/BlindBoxReveal";
import BlindBoxReport from "./pages/BlindBoxReport";
import FinalGeneration from "./pages/FinalGeneration";
import Generator from "./pages/Generator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/name-input" element={<NameInput />} />
          <Route path="/blind-box-reveal" element={<BlindBoxReveal />} />
          <Route path="/blind-box-report" element={<BlindBoxReport />} />
          <Route path="/final-generation" element={<FinalGeneration />} />
          <Route path="/generator" element={<Generator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
