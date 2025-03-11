import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { 
  ExchangeInfo, 
  StablecoinInfo,
  DefiProtocolInfo,
  NftMarketplaceInfo,
  CryptoFundInfo 
} from "@shared/schema";

type RegistrationType = 
  | { type: 'exchange'; data: ExchangeInfo; }
  | { type: 'stablecoin'; data: StablecoinInfo; }
  | { type: 'defi'; data: DefiProtocolInfo; }
  | { type: 'nft'; data: NftMarketplaceInfo; }
  | { type: 'fund'; data: CryptoFundInfo; };

const typeLabels = {
  exchange: 'Exchange Registration',
  stablecoin: 'Stablecoin Registration',
  defi: 'DeFi Protocol Registration',
  nft: 'NFT Marketplace Registration',
  fund: 'Crypto Fund Registration',
};

export function RegistrationView() {
  const { type, id } = useParams();
  const { toast } = useToast();

  const { data: registration, isLoading } = useQuery({
    queryKey: [`/api/${type}/${id}`],
    enabled: !!type && !!id,
  });

  if (isLoading) {
    return <RegistrationSkeleton />;
  }

  if (!registration) {
    toast({
      title: "Registration not found",
      description: "The requested registration details could not be found.",
      variant: "destructive",
    });
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-background to-muted/20 shadow-xl">
      <CardHeader className="space-y-2 pb-8 border-b">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {typeLabels[type as keyof typeof typeLabels]} Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <RegistrationDetails registration={{ type, data: registration } as RegistrationType} />
      </CardContent>
    </Card>
  );
}

function RegistrationDetails({ registration }: { registration: RegistrationType }) {
  const renderField = (label: string, value: any) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
    if (typeof value === 'object') value = JSON.stringify(value, null, 2);

    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-border/50 last:border-0">
        <div className="font-medium text-muted-foreground">{label}</div>
        <div className="col-span-2">{value}</div>
      </div>
    );
  };

  const fields = Object.entries(registration.data)
    .filter(([key]) => !['id', 'userId', 'createdAt'].includes(key))
    .map(([key, value]) => renderField(
      key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value
    ));

  return <div className="space-y-1">{fields}</div>;
}

function RegistrationSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full col-span-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
