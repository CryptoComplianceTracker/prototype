import TokenRegistrationList from "@/components/token-registration-list";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";

export default function TokenListingPage() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">My Token Registrations</h1>
      <TokenRegistrationList />
    </div>
  );
}