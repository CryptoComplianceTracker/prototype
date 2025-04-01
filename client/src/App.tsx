import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";
import { NavBar } from "@/components/nav-bar";
import { lazy, Suspense } from "react";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import ExchangeRegistrationPage from "@/pages/exchange-registration";
import StablecoinRegistrationPage from "@/pages/stablecoin-registration";
import DefiRegistrationPage from "@/pages/defi-registration";
import NftRegistrationPage from "@/pages/nft-registration";
import CompliancePage from "@/pages/compliance";
import ComplianceNewsPage from "@/pages/compliance-news";
import ComplianceDashboardPage from "@/pages/compliance-dashboard";
import ComplianceReportingPage from "@/pages/compliance-reporting";
import FundRegistrationPage from "@/pages/fund-registration";
import JurisdictionsListModal from "@/pages/jurisdictions-list-modal";
import TemplateStudioPage from "@/pages/template-studio";
import { RegistrationView } from "@/components/registration-view";
import NotFound from "@/pages/not-found";
// Token Registration Module
import TokenRegistrationPage from "@/pages/token-registration-page";
import TokenListingPage from "@/pages/token-listing-page";
import TokenDetailsPage from "@/pages/token-details-page";
import AdminTokenListingPage from "@/pages/admin-token-listing-page";
import UserJurisdictionsPage from "@/pages/user-jurisdictions-page";
import JurisdictionChecklistPage from "@/pages/jurisdiction-checklist-page";

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
          <ProtectedRoute path="/compliance-news" component={ComplianceNewsPage} />
          <ProtectedRoute path="/compliance-dashboard" component={ComplianceDashboardPage} />
          <ProtectedRoute path="/compliance-reporting" component={ComplianceReportingPage} />
          <ProtectedRoute path="/template-studio" component={TemplateStudioPage} />
          
          {/* Token Registration Routes */}
          <ProtectedRoute path="/tokens" component={TokenListingPage} />
          <ProtectedRoute path="/tokens/register" component={TokenRegistrationPage} />
          <ProtectedRoute path="/tokens/:id" component={TokenDetailsPage} />
          <AdminProtectedRoute path="/admin/tokens" component={AdminTokenListingPage} />
          
          {/* Jurisdiction Routes */}
          <ProtectedRoute path="/jurisdictions" component={JurisdictionsListModal} />
          <ProtectedRoute path="/my-jurisdictions" component={UserJurisdictionsPage} />
          <ProtectedRoute path="/jurisdictions/:jurisdictionId/checklist" component={JurisdictionChecklistPage} />

          {/* Registration View Routes */}
          <Route path="/:type-view/:id" component={RegistrationView} />

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