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
import NftRegistrationPage from "@/pages/nft-registration";
import CompliancePage from "@/pages/compliance";
import FundRegistrationPage from "@/pages/fund-registration";
import { RegistrationView } from "@/components/registration-view";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto max-w-7xl px-8 py-8">
        <Switch>
          <ProtectedRoute path="/" component={DashboardPage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <AdminProtectedRoute path="/admin" component={AdminDashboard} />

          {/* Registration Form Routes */}
          <ProtectedRoute path="/exchange-registration" component={ExchangeRegistrationPage} />
          <ProtectedRoute path="/stablecoin-registration" component={StablecoinRegistrationPage} />
          <ProtectedRoute path="/defi-registration" component={DefiRegistrationPage} />
          <ProtectedRoute path="/nft-registration" component={NftRegistrationPage} />
          <ProtectedRoute path="/fund-registration" component={FundRegistrationPage} />
          <ProtectedRoute path="/compliance" component={CompliancePage} />

          {/* Registration View Routes */}
          <ProtectedRoute path="/:type-view/:id" component={RegistrationView} />

          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
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