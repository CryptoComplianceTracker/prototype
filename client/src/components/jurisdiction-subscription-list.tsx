import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { JurisdictionCard } from './jurisdiction-card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertCircle, MapPin, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type JurisdictionSubscription = {
  id: number;
  user_id: number;
  jurisdiction_id: number;
  is_primary: boolean;
  notes: string | null;
  added_at: string;
  jurisdiction_name: string;
  jurisdiction_region: string;
  jurisdiction_risk_level: string;
};

type Jurisdiction = {
  id: number;
  name: string;
  region: string;
  risk_level: string;
  favorability_score: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export function JurisdictionSubscriptionList() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get user's subscribed jurisdictions
  const { 
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError 
  } = useQuery<JurisdictionSubscription[]>({
    queryKey: ['/api/user/jurisdictions'],
    queryFn: async () => {
      const response = await fetch('/api/user/jurisdictions');
      if (!response.ok) {
        throw new Error('Failed to fetch jurisdiction subscriptions');
      }
      return response.json();
    }
  });

  // Get all available jurisdictions
  const { 
    data: jurisdictions,
    isLoading: isLoadingJurisdictions,
    error: jurisdictionsError 
  } = useQuery<Jurisdiction[]>({
    queryKey: ['/api/jurisdictions'],
    queryFn: async () => {
      const response = await fetch('/api/jurisdictions');
      if (!response.ok) {
        throw new Error('Failed to fetch jurisdictions');
      }
      return response.json();
    }
  });

  // Filter jurisdictions for the dialog based on search term
  const filteredJurisdictions = jurisdictions?.filter(jurisdiction => {
    if (!searchTerm) return true;
    return (
      jurisdiction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurisdiction.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Group jurisdictions by region for regional tab
  const jurisdictionsByRegion = filteredJurisdictions?.reduce<Record<string, Jurisdiction[]>>((acc, jurisdiction) => {
    const region = jurisdiction.region;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(jurisdiction);
    return acc;
  }, {});

  // Check if a jurisdiction is already subscribed
  const isSubscribed = (jurisdictionId: number) => {
    return subscriptions?.some(sub => sub.jurisdiction_id === jurisdictionId);
  };

  // Get subscription ID for a jurisdiction
  const getSubscriptionId = (jurisdictionId: number) => {
    return subscriptions?.find(sub => sub.jurisdiction_id === jurisdictionId)?.id;
  };

  if (isLoadingSubscriptions) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your jurisdiction subscriptions...</span>
      </div>
    );
  }

  if (subscriptionsError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load your jurisdiction subscriptions. Please try again.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Jurisdictions</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Jurisdiction</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Browse Jurisdictions</DialogTitle>
              <DialogDescription>
                Subscribe to jurisdictions to receive regulatory updates and compliance information.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center space-x-2 mb-4">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search jurisdictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex-1 overflow-hidden">
              {isLoadingJurisdictions ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading jurisdictions...</span>
                </div>
              ) : jurisdictionsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load jurisdictions. Please try again.
                  </AlertDescription>
                </Alert>
              ) : (
                <Tabs defaultValue="all" className="h-full flex flex-col">
                  <TabsList>
                    <TabsTrigger value="all">All Jurisdictions</TabsTrigger>
                    <TabsTrigger value="regions">By Region</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="flex-1 overflow-y-auto mt-4">
                    {filteredJurisdictions?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium">No jurisdictions found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search term.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredJurisdictions?.map(jurisdiction => (
                          <JurisdictionCard
                            key={jurisdiction.id}
                            id={jurisdiction.id}
                            name={jurisdiction.name}
                            region={jurisdiction.region}
                            risk_level={jurisdiction.risk_level}
                            favorability_score={jurisdiction.favorability_score}
                            isSubscribed={isSubscribed(jurisdiction.id)}
                            subscriptionId={getSubscriptionId(jurisdiction.id)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="regions" className="flex-1 overflow-y-auto mt-4">
                    {Object.keys(jurisdictionsByRegion || {}).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium">No regions found</p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search term.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {Object.entries(jurisdictionsByRegion || {}).map(([region, jurisdictions]) => (
                          <div key={region}>
                            <div className="flex items-center mb-4">
                              <MapPin className="w-5 h-5 mr-2 text-primary" />
                              <h3 className="text-xl font-bold">{region}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {jurisdictions.map(jurisdiction => (
                                <JurisdictionCard
                                  key={jurisdiction.id}
                                  id={jurisdiction.id}
                                  name={jurisdiction.name}
                                  region={jurisdiction.region}
                                  risk_level={jurisdiction.risk_level}
                                  favorability_score={jurisdiction.favorability_score}
                                  isSubscribed={isSubscribed(jurisdiction.id)}
                                  subscriptionId={getSubscriptionId(jurisdiction.id)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {subscriptions?.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">No Jurisdictions Subscribed</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You haven't subscribed to any jurisdictions yet. Add jurisdictions to receive regulatory updates.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
          >
            Browse Jurisdictions
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions?.map(subscription => (
            <JurisdictionCard
              key={subscription.id}
              id={subscription.jurisdiction_id}
              name={subscription.jurisdiction_name}
              region={subscription.jurisdiction_region}
              risk_level={subscription.jurisdiction_risk_level}
              isSubscribed={true}
              subscriptionId={subscription.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}