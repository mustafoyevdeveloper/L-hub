
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Lottery from "./pages/Lottery";
import Profile from "./pages/Profile";
import RulesPage from "./pages/Rules";
import ArchiveRoundsPage from "./pages/ArchiveRounds";
import VideosPage from "./pages/Videos";
import NewsPage from "./pages/News";
import PlansPage from "./pages/Plans";
import MiniGamesPage from "./pages/MiniGames";
import SupportPage from "./pages/Support";
import KYCPage from "./pages/KYC";
import RNGVerificationPage from "./pages/RNGVerification";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import { I18nProvider } from "./i18n/I18nProvider";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import AuthPage from "./pages/Auth";
import BackgroundOrnaments from "./components/BackgroundOrnaments";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: JSX.Element }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/auth" replace />;
  return children;
}

function AppContent() {
  const { isLoading } = useAuth();

  // Auth loading tugaguncha loading ko'rsatish
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundOrnaments />
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lottery" element={<Lottery />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/archive" element={<ArchiveRoundsPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/minigames" element={<MiniGamesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/kyc" element={<KYCPage />} />
        <Route path="/rng" element={<RNGVerificationPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </I18nProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
