import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";
import { NavBar } from "@/components/nav-bar";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import ExchangeRegistrationPage from "@/pages/exchange-registration";
import StablecoinRegistrationPage from "@/pages/stablecoin-registration";
import DefiRegistrationPage from "@/pages/defi-registration";
import CompliancePage from "@/pages/compliance";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Switch>
        <ProtectedRoute path="/" component={DashboardPage} />
        <ProtectedRoute path="/dashboard" component={DashboardPage} />
        <AdminProtectedRoute path="/admin" component={AdminDashboard} />
        <ProtectedRoute path="/exchange/register" component={ExchangeRegistrationPage} />
        <ProtectedRoute path="/stablecoin/register" component={StablecoinRegistrationPage} />
        <ProtectedRoute path="/defi/register" component={DefiRegistrationPage} />
        <ProtectedRoute path="/compliance" component={CompliancePage} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;