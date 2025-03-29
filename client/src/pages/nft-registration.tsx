import { NftMarketplaceRegistrationForm } from "@/components/nft-marketplace-registration-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, HelpCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NftRegistrationPage() {
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
        <h1 className="text-4xl font-bold">NFT Marketplace Registration</h1>
        <p className="text-muted-foreground mt-2">
          Register your NFT marketplace for regulatory compliance tracking and attestation services
        </p>
      </div>

      <Tabs defaultValue="registration" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="registration">Registration Form</TabsTrigger>
          <TabsTrigger value="guidance">Regulatory Guidance</TabsTrigger>
          <TabsTrigger value="requirements">Compliance Checklist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registration" className="mt-6">
          <Alert className="mb-6 bg-muted/50">
            <HelpCircle className="h-4 w-4" />
            <AlertTitle>Important Information</AlertTitle>
            <AlertDescription>
              This registration form collects essential information about your NFT marketplace for regulatory compliance analysis. Complete all required fields and provide accurate information.
            </AlertDescription>
          </Alert>
          <NftMarketplaceRegistrationForm />
        </TabsContent>
        
        <TabsContent value="guidance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>NFT Marketplace Regulatory Guidance</CardTitle>
              <CardDescription>
                Key compliance considerations for NFT marketplaces and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Regulatory Considerations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  NFT marketplaces face evolving regulatory requirements that vary by jurisdiction:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Marketplace operator licensing requirements</li>
                  <li>Securities law applicability for certain NFT types</li>
                  <li>Intellectual property rights and protections</li>
                  <li>AML/KYC requirements for high-value transactions</li>
                  <li>Consumer protection for marketplace users</li>
                  <li>Data privacy and protection regulations</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Jurisdiction-Specific Regulations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium">European Union</h4>
                    <p className="text-xs text-muted-foreground">
                      MiCA, GDPR, and Digital Services Act requirements for NFT platforms
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium">United States</h4>
                    <p className="text-xs text-muted-foreground">
                      SEC/CFTC oversight, state-by-state regulatory frameworks
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium">United Kingdom</h4>
                    <p className="text-xs text-muted-foreground">
                      FCA guidance on cryptoassets, including NFTs with investment characteristics
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-medium">Singapore</h4>
                    <p className="text-xs text-muted-foreground">
                      MAS licensing requirements based on NFT functionality
                    </p>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recently Updated Guidance</h3>
                <div className="border rounded-md p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">FATF Updated Guidance on NFTs</h4>
                    <p className="text-xs text-muted-foreground">Updated June 2024</p>
                  </div>
                  <p className="text-sm mt-2">
                    FATF has updated its guidance to clarify that certain NFTs which enable transfer or investment functions may be treated as Virtual Assets, requiring enhanced AML/KYC measures by marketplaces.
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2" asChild>
                    <a href="https://www.fatf-gafi.org" target="_blank" rel="noopener noreferrer">
                      Read More <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex flex-col items-start">
              <h3 className="text-sm font-medium mb-2">Disclaimer</h3>
              <p className="text-xs text-muted-foreground">
                This information is for guidance only and should not be considered legal advice. Regulations are subject to change. Consult with qualified legal counsel in your jurisdiction.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="requirements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>NFT Marketplace Compliance Checklist</CardTitle>
              <CardDescription>
                Essential compliance requirements for NFT marketplaces
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <TooltipProvider>
                  <div className="border rounded-md p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">AML/KYC Program</h3>
                        <p className="text-sm text-muted-foreground">
                          Implement appropriate customer due diligence procedures
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Required for high-value transactions and marketplaces operating in regulated jurisdictions. Typically threshold-based for NFT sales above $10,000.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="mt-2 text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Customer identification procedures</li>
                        <li>Transaction monitoring systems</li>
                        <li>Risk-based approach to verification</li>
                        <li>High-value transaction reporting</li>
                      </ul>
                    </div>
                  </div>
                
                  <div className="border rounded-md p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Intellectual Property Rights</h3>
                        <p className="text-sm text-muted-foreground">
                          Ensure proper protection of creator and collector rights
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Implement systems to verify creator rights and handle DMCA takedown requests. Clear IP rights documentation in terms of service.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="mt-2 text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Creator verification process</li>
                        <li>Copyright/trademark infringement procedures</li>
                        <li>IP ownership documentation</li>
                        <li>Royalty and resale rights enforcement</li>
                      </ul>
                    </div>
                  </div>
                
                  <div className="border rounded-md p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Consumer Protection Measures</h3>
                        <p className="text-sm text-muted-foreground">
                          Protect marketplace users with appropriate safeguards
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Provide clear risk disclosures, dispute resolution processes, and transparent fee structures to ensure fair treatment of users.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="mt-2 text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Clear terms of service and privacy policy</li>
                        <li>Transparent fee structures</li>
                        <li>Dispute resolution procedures</li>
                        <li>Escrow services for high-value transactions</li>
                        <li>Fraud prevention mechanisms</li>
                      </ul>
                    </div>
                  </div>
                
                  <div className="border rounded-md p-4 transition-colors hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Data Protection Compliance</h3>
                        <p className="text-sm text-muted-foreground">
                          Ensure compliance with relevant data privacy laws
                        </p>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Implement data protection measures in accordance with GDPR, CCPA, and other regional privacy regulations where your marketplace operates.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="mt-2 text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>User data collection limitations</li>
                        <li>Data subject access rights</li>
                        <li>Breach notification procedures</li>
                        <li>Data retention policies</li>
                      </ul>
                    </div>
                  </div>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}