import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TutorialProvider } from "@/components/tutorial/TutorialProvider";
import { ErrorBoundary } from "@/utils/errorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import TrackDocuments from "./pages/TrackDocuments";
import Calendar from "./pages/Calendar";
import Messages from "./pages/Messages";
import WorkflowManagement from "./pages/Workflow";
import Approvals from "./pages/Approvals";
import ApprovalRouting from "./pages/ApprovalRouting";
import Analytics from "./pages/Analytics";
import AdvancedSignature from "./pages/AdvancedSignature";
import Emergency from "./pages/Emergency";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <TutorialProvider>
                      <Dashboard />
                    </TutorialProvider>
                  </ProtectedRoute>
                } />
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <TutorialProvider>
                      <Documents />
                    </TutorialProvider>
                  </ProtectedRoute>
                } />
                <Route path="/track-documents" element={
                  <ProtectedRoute>
                    <TutorialProvider>
                      <TrackDocuments />
                    </TutorialProvider>
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <TutorialProvider>
                      <Calendar />
                    </TutorialProvider>
                  </ProtectedRoute>
                } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <TutorialProvider>
                        <Messages />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/workflow" element={
                    <ProtectedRoute requiredPermissions={['canManageWorkflows']}>
                      <TutorialProvider>
                        <WorkflowManagement />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/approvals" element={
                    <ProtectedRoute requiredPermissions={['canApprove']}>
                      <TutorialProvider>
                        <Approvals />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/approval-routing" element={
                    <ProtectedRoute requiredPermissions={['canManageWorkflows']}>
                      <TutorialProvider>
                        <ApprovalRouting />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute requiredPermissions={['canViewAnalytics']}>
                      <TutorialProvider>
                        <Analytics />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/advanced-signature" element={
                    <ProtectedRoute>
                      <TutorialProvider>
                        <AdvancedSignature />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/emergency" element={
                    <ProtectedRoute>
                      <TutorialProvider>
                        <Emergency />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/search" element={
                    <ProtectedRoute>
                      <TutorialProvider>
                        <Search />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <TutorialProvider>
                        <Profile />
                      </TutorialProvider>
                    </ProtectedRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
