import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import FranchisePage from "@/pages/franchise";
import Admin from "@/pages/admin";
import LoginPage from "@/pages/login";
import UserManagement from "@/pages/user-management";
import PaymentPage from "@/pages/payment";
import PaymentSuccessPage from "@/pages/payment-success";
import PaymentFailPage from "@/pages/payment-fail";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/franchise" component={FranchisePage} />
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
      <Route path="/payment" component={PaymentPage} />
      <Route path="/payment-success" component={PaymentSuccessPage} />
      <Route path="/payment-fail" component={PaymentFailPage} />
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
