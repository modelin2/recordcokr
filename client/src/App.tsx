import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import FranchisePage from "@/pages/franchise";
import FAQPage from "@/pages/faq";
import NaverBooking from "@/pages/naver-booking";
import MenuPage from "@/pages/menu";
import Admin from "@/pages/admin";
import LoginPage from "@/pages/login";
import UserManagement from "@/pages/user-management";
import PhotoPage from "@/pages/photo";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/franchise" component={FranchisePage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/naver-booking" component={NaverBooking} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin">
        <ProtectedRoute requireAdmin={true}>
          <Admin />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute requireAdmin={true}>
          <UserManagement />
        </ProtectedRoute>
      </Route>
      <Route path="/photo">
        <ProtectedRoute requireAdmin={true}>
          <PhotoPage />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
