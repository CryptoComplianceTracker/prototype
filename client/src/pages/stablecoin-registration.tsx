import { StablecoinRegistrationForm } from "@/components/stablecoin-registration-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StablecoinRegistrationPage() {
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
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">Stablecoin Issuer Registration</h1>
        <p className="text-muted-foreground mt-2">
          Register your stablecoin issuance for regulatory compliance tracking and attestation services
        </p>
      </div>

      <Tabs defaultValue="registration" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registration">Registration Form</TabsTrigger>
          <TabsTrigger value="guidance">Regulatory Guidance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registration" className="mt-6">
          <StablecoinRegistrationForm />
        </TabsContent>
        
        <TabsContent value="guidance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stablecoin Issuer Regulatory Guidance</CardTitle>
              <CardDescription>
                Key compliance considerations for stablecoin projects and issuers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Regulatory Considerations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stablecoin issuers face unique regulatory requirements depending on backing asset type and jurisdiction:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Banking licenses and eMoney regulations</li>
                  <li>Reserve assets custody and audit requirements</li>
                  <li>Financial services licensing (MSB, PSP, etc.)</li>
                  <li>Enhanced AML/KYC requirements for fiat on/off ramps</li>
                  <li>Consumer protection disclosures</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Regulatory Developments</h3>
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">EU MiCA Regulations</h4>
                        <p className="text-xs text-muted-foreground">
                          Specific asset-referenced token (ART) and e-money token (EMT) regulations
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="flex gap-1 items-center" asChild>
                        <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114" target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-3 w-3" />
                          <span className="text-xs">MiCA Text</span>
                        </a>
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">US Presidential Executive Order</h4>
                        <p className="text-xs text-muted-foreground">
                          Federal approach to regulating digital assets, including stablecoins
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="flex gap-1 items-center" asChild>
                        <a href="https://www.whitehouse.gov/briefing-room/presidential-actions/2022/03/09/executive-order-on-ensuring-responsible-development-of-digital-assets/" target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-3 w-3" />
                          <span className="text-xs">EO Text</span>
                        </a>
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">FATF Updated Guidance</h4>
                        <p className="text-xs text-muted-foreground">
                          Standards for virtual assets and virtual asset service providers, including stablecoins
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="flex gap-1 items-center" asChild>
                        <a href="https://www.fatf-gafi.org/publications/fatfrecommendations/documents/guidance-rba-virtual-assets-2021.html" target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-3 w-3" />
                          <span className="text-xs">FATF Guidance</span>
                        </a>
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Stablecoin Best Practices</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Regular attestation and/or audits of reserve assets</li>
                  <li>Clear redemption policies and procedures</li>
                  <li>Transparent reserve composition disclosures</li>
                  <li>Robust AML program with transaction monitoring</li>
                  <li>Risk disclosure documentation for users</li>
                  <li>Blacklisting capabilities for sanctioned addresses</li>
                  <li>Emergency response procedures for de-pegging scenarios</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}