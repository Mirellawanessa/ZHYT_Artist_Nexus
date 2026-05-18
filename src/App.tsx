import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CallProvider } from "@/components/chat/CallProvider";
import Index from "./pages/Index.tsx";
import Welcome from "./pages/Welcome.tsx";
import Profile from "./pages/Profile.tsx";
import Contracts from "./pages/Contracts.tsx";
import ChatList from "./pages/ChatList.tsx";
import ChatThread from "./pages/ChatThread.tsx";
import Payments from "./pages/Payments.tsx";
import Home from "./pages/Home.tsx";
import Axs from "./pages/Axs.tsx";
import Vision from "./pages/Vision.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CallProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:conversationId" element={<ChatThread />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/axs" element={<Axs />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CallProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
