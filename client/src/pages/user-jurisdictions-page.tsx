import React from 'react';
import { JurisdictionSubscriptionList } from '@/components/jurisdiction-subscription-list';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { Loader2 } from 'lucide-react';

export default function UserJurisdictionsPage() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/auth" />;
  }
  
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">My Jurisdictions</h1>
      <div className="mb-8">
        <p className="text-muted-foreground">
          Manage jurisdictions that you're subscribed to. Subscribed jurisdictions provide regulatory updates,
          compliance requirements, and other relevant information directly to your dashboard.
        </p>
      </div>
      
      <JurisdictionSubscriptionList />
    </div>
  );
}