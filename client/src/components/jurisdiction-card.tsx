import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check, ListChecks } from "lucide-react";
import { useLocation } from "wouter";

interface JurisdictionCardProps {
  id: number;
  name: string;
  region: string;
  risk_level: string;
  favorability_score?: number | null;
  isSubscribed?: boolean;
  showSubscribeButton?: boolean;
  subscriptionId?: number;
}

export function JurisdictionCard({
  id,
  name,
  region,
  risk_level,
  favorability_score,
  isSubscribed = false,
  showSubscribeButton = true,
  subscriptionId
}: JurisdictionCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [_, navigate] = useLocation();

  // Get risk level color
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Subscribe to jurisdiction
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/user/jurisdictions', {
        jurisdiction_id: id,
        is_primary: false,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/jurisdictions'] });
      toast({
        title: 'Subscribed Successfully',
        description: `You are now subscribed to ${name} jurisdiction.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Subscription Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Unsubscribe from jurisdiction
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      if (!subscriptionId) throw new Error('Subscription ID is required');
      await apiRequest('DELETE', `/api/user/jurisdictions/${subscriptionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/jurisdictions'] });
      toast({
        title: 'Unsubscribed Successfully',
        description: `You are no longer subscribed to ${name} jurisdiction.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Unsubscribe Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge className={getRiskLevelColor(risk_level)}>{risk_level} Risk</Badge>
        </div>
        <CardDescription>{region}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {favorability_score !== undefined && favorability_score !== null && (
          <div className="mt-2">
            <p className="text-sm font-medium text-muted-foreground">Favorability Score</p>
            <div className="w-full bg-secondary mt-1 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, favorability_score) * 10)}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-right mt-1">{favorability_score}/10</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-2">
        {isSubscribed && (
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => navigate(`/jurisdictions/${id}/checklist`)}
          >
            <ListChecks className="mr-2 h-4 w-4" />
            View Compliance Checklist
          </Button>
        )}
        
        {showSubscribeButton && (
          isSubscribed ? (
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => unsubscribeMutation.mutate()}
              disabled={unsubscribeMutation.isPending}
            >
              {unsubscribeMutation.isPending ? 'Unsubscribing...' : 'Unsubscribe'}
            </Button>
          ) : (
            <Button 
              variant="default" 
              className="w-full" 
              onClick={() => subscribeMutation.mutate()}
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? 'Subscribing...' : 'Subscribe'}
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
}