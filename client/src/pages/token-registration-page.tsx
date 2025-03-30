import TokenRegistrationForm from "@/components/token-registration-form";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";

export default function TokenRegistrationPage() {
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
      <h1 className="text-3xl font-bold mb-6">Register Your Token</h1>
      <TokenRegistrationForm />
    </div>
  );
}