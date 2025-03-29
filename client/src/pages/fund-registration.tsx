import { CryptoFundRegistrationForm } from "@/components/crypto-fund-registration-form";
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
import { Loader2 } from "lucide-react";

export default function FundRegistrationPage() {
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
        <h1 className="text-4xl font-bold">Crypto Fund Registration</h1>
        <p className="text-muted-foreground mt-2">
          Register your crypto fund for regulatory compliance tracking and attestation services
        </p>
      </div>

      <Tabs defaultValue="registration" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registration">Registration Form</TabsTrigger>
          <TabsTrigger value="guidance">Regulatory Guidance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registration" className="mt-6">
          <CryptoFundRegistrationForm />
        </TabsContent>
        
        <TabsContent value="guidance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Crypto Fund Regulatory Guidance</CardTitle>
              <CardDescription>
                Key information for crypto fund managers about compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Regulatory Considerations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Depending on your fund's jurisdiction, strategy, and investor base, there are several regulatory frameworks that may apply:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Securities regulations for tokenized assets</li>
                  <li>Investment advisor/manager registration requirements</li>
                  <li>AML/KYC compliance for investor onboarding</li>
                  <li>Custody and safekeeping of crypto assets</li>
                  <li>Tax reporting obligations for crypto trades and gains</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Popular Fund Jurisdictions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium">Cayman Islands</h4>
                    <p className="text-xs text-muted-foreground">
                      Popular for offshore funds, with the CIMA's virtual asset service provider (VASP) regime
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium">Switzerland</h4>
                    <p className="text-xs text-muted-foreground">
                      Clear regulatory framework via FINMA with favorable crypto taxation
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium">Singapore</h4>
                    <p className="text-xs text-muted-foreground">
                      MAS licensing for fund managers, with clear guidelines for digital assets
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium">United States</h4>
                    <p className="text-xs text-muted-foreground">
                      SEC/CFTC oversight with various exemptions available for private funds
                    </p>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Documentation Requirements</h3>
                <p className="text-sm mb-4">
                  The following documentation is generally required for crypto fund formation and compliance:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Fund formation documents (LPA, Operating Agreement)</li>
                  <li>Private Placement Memorandum (PPM)</li>
                  <li>Subscription agreements</li>
                  <li>AML/KYC procedures manual</li>
                  <li>Custody and security policy</li>
                  <li>Valuation policy</li>
                  <li>Risk disclosure documents</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}