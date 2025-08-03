import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Login } from "@/components/Login";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "@/pages/Index";
import { Rooms } from "@/pages/Rooms";
import { Reservations } from "@/pages/Reservations";
import { Guests } from "@/pages/Guests";
import { Housekeeping } from "@/pages/Housekeeping";
import { Payments } from "@/pages/Payments";
import { RoomTypes } from "@/pages/RoomTypes";
import { Settings } from "@/pages/Settings";
import "@/i18n/config";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            } />
            <Route path="/reservations" element={
              <ProtectedRoute>
                <Reservations />
              </ProtectedRoute>
            } />
            <Route path="/guests" element={
              <ProtectedRoute>
                <Guests />
              </ProtectedRoute>
            } />
            <Route path="/housekeeping" element={
              <ProtectedRoute>
                <Housekeeping />
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            } />
            <Route path="/room-types" element={
              <ProtectedRoute>
                <RoomTypes />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
