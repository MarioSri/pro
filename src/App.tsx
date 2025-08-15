import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import WorkflowManagement from "./pages/Workflow";
import Approvals from "./pages/Approvals";
import Analytics from "./pages/Analytics";
import AdvancedSignature from "./pages/AdvancedSignature";
import NotesCanvas from "./pages/NotesCanvas";
import Reminders from "./pages/Reminders";
import Emergency from "./pages/Emergency";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/workflow" element={<WorkflowManagement />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/advanced-signature" element={<AdvancedSignature />} />
          <Route path="/notes-canvas" element={<NotesCanvas />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/search" element={<Search />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
