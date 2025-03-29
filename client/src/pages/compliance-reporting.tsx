import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import ComplianceReportingModule from "@/components/compliance-reporting-module";

export default function ComplianceReporting() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <div className="container px-4 py-6 md:px-6 md:py-10 lg:px-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Compliance Reporting</h1>
        <p className="text-muted-foreground mt-2">Manage and track your regulatory reports across jurisdictions</p>
      </div>
      
      <ComplianceReportingModule />
    </div>
  );
}