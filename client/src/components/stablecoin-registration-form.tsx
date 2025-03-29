import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type InsertStablecoinInfo, stablecoinInfoSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, HelpCircle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function StablecoinRegistrationForm() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch jurisdictions for the dropdown
  const { data: jurisdictions = [] } = useQuery({
    queryKey: ['/api/jurisdictions'],
    staleTime: 300000, // 5 minutes
  });

  // Enhanced form with additional compliance fields
  const form = useForm<InsertStablecoinInfo>({
    resolver: zodResolver(
      stablecoinInfoSchema.extend({
        // Add enhanced validation
        tokenSymbol: stablecoinInfoSchema.shape.tokenSymbol.max(10, "Token symbol must be 10 characters or less"),
        totalSupply: stablecoinInfoSchema.shape.totalSupply.regex(/^\d+$/, "Supply must be a number"),
      })
    ),
    defaultValues: {
      stablecoinName: "",
      tokenSymbol: "",
      issuerName: "",
      registrationNumber: "",
      jurisdiction: "",
      backingAssetType: "Fiat",
      peggedTo: "USD",
      totalSupply: "",
      websiteUrl: "",
      // Add new fields with defaults
      redemptionPolicy: "",
      auditProvider: "",
      centralBankPartnership: false,
      isRegulated: false,
      custodianName: "",
      chainIds: [], 
      complianceOfficerEmail: "",
      reserveRatio: "100",
      hasMarketMakers: false,
      backingAssetDetails: "",
      amlPolicyUrl: "",
      redemptionFrequency: "Daily",
      hasTravelRule: false,
      attestationMethod: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertStablecoinInfo) => {
      console.log("Submitting stablecoin registration:", data);
      if (!user) {
        throw new Error("You must be logged in to register a stablecoin");
      }

      const response = await apiRequest("POST", "/api/stablecoin/register", data);
      console.log("API Response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("Registration failed:", error);
        throw new Error(error.message || "Failed to register stablecoin");
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your stablecoin has been registered successfully.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertStablecoinInfo) => {
    console.log("Form submitted with data:", data);
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="backing">Backing & Reserves</TabsTrigger>
            <TabsTrigger value="compliance">Compliance & Regulation</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="mt-4 space-y-6">
            <div className="flex items-center gap-1">
              <h3 className="text-lg font-semibold">Stablecoin Information</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>This section collects essential details about your stablecoin project for regulatory tracking purposes.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="stablecoinName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stablecoin Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter stablecoin name" {...field} />
                    </FormControl>
                    <FormDescription>Official name of your stablecoin project</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenSymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USDT, USDC" {...field} />
                    </FormControl>
                    <FormDescription>Token ticker, typically 3-5 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issuerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuer Legal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter legal entity name" {...field} />
                    </FormControl>
                    <FormDescription>Legal entity responsible for token issuance</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter registration number" {...field} />
                    </FormControl>
                    <FormDescription>Corporate registration or license ID</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jurisdictions.length > 0 ? (
                          jurisdictions.map((jurisdiction: any) => (
                            <SelectItem 
                              key={jurisdiction.id} 
                              value={jurisdiction.name}
                            >
                              {jurisdiction.name}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Switzerland">Switzerland</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Singapore">Singapore</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>Primary country of incorporation</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com" {...field} />
                    </FormControl>
                    <FormDescription>Official stablecoin website</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complianceOfficerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compliance Officer Email</FormLabel>
                    <FormControl>
                      <Input placeholder="compliance@example.com" {...field} />
                    </FormControl>
                    <FormDescription>Primary contact for regulatory matters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Supply</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter total supply" {...field} />
                    </FormControl>
                    <FormDescription>Current or planned circulation amount</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          {/* Backing & Reserves Tab */}
          <TabsContent value="backing" className="mt-4 space-y-6">
            <Card className="bg-muted/30 mb-6">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                  Important Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-xs text-muted-foreground">
                  All stablecoin issuers must provide accurate information about their reserve backing. 
                  False statements may be subject to regulatory action in most jurisdictions.
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="backingAssetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backing Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select backing asset type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fiat">Fiat Currency</SelectItem>
                        <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="Commodity">Commodity</SelectItem>
                        <SelectItem value="Mixed">Mixed Assets</SelectItem>
                        <SelectItem value="Algorithmic">Algorithmic</SelectItem>
                        <SelectItem value="Sovereign">Sovereign Bonds</SelectItem>
                        <SelectItem value="Commercial">Commercial Paper</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Primary asset class backing the token</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backingAssetDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backing Asset Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the specific assets backing your stablecoin (e.g., USD in custody accounts at Silvergate Bank, USDC and ETH, etc.)" 
                        {...field} 
                        className="h-24"
                      />
                    </FormControl>
                    <FormDescription>Detailed description of reserve composition</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="peggedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pegged To</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., USD, EUR, BTC" {...field} />
                    </FormControl>
                    <FormDescription>Asset or currency being tracked</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custodianName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custodian Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., State Street, BitGo" {...field} />
                    </FormControl>
                    <FormDescription>Institution holding the reserve assets</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reserveRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserve Ratio (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormDescription>Percentage of token backed by reserves</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auditProvider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audit Provider</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grant Thornton, Deloitte" {...field} />
                    </FormControl>
                    <FormDescription>Firm that verifies reserve attestations</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attestationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attestation Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select attestation method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Professional Audit">Professional Audit</SelectItem>
                        <SelectItem value="Cryptographic Proof">Cryptographic Proof</SelectItem>
                        <SelectItem value="On-Chain Verification">On-Chain Verification</SelectItem>
                        <SelectItem value="Self Reported">Self Reported</SelectItem>
                        <SelectItem value="Regulatory Oversight">Regulatory Oversight</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How reserve backing is verified</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="redemptionPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redemption Policy</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your redemption policy, including any minimum requirements or fees"
                        {...field}
                        className="h-24"
                      />
                    </FormControl>
                    <FormDescription>How users can exchange tokens for backing assets</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasMarketMakers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Market Making Partnership
                    </FormLabel>
                    <FormDescription>
                      Check if you have formal market making partners to maintain price stability
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="redemptionFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redemption Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select redemption frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Real-time">Real-time</SelectItem>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="By Request">By Request Only</SelectItem>
                      <SelectItem value="None">None Available</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How often redemptions are processed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          {/* Compliance & Regulation Tab */}
          <TabsContent value="compliance" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="isRegulated"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Regulated Stablecoin
                      </FormLabel>
                      <FormDescription>
                        Check if you operate under a specific stablecoin or e-money regulation
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="centralBankPartnership"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Central Bank Partnership
                      </FormLabel>
                      <FormDescription>
                        Check if your project has formal relationship with a central bank
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasTravelRule"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Travel Rule Compliance
                      </FormLabel>
                      <FormDescription>
                        Check if your stablecoin implements FATF Travel Rule compliance
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amlPolicyUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AML Policy URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/aml-policy" {...field} />
                    </FormControl>
                    <FormDescription>Link to your Anti-Money Laundering policy</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="reports">
                <AccordionTrigger>Compliance Reporting Requirements</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="text-sm">
                      <p className="font-medium">Stablecoin Issuers Typically Need to Submit:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li>Proof of Reserves Reports (Monthly/Quarterly)</li>
                        <li>Stablecoin Backing Certification (Monthly)</li>
                        <li>Custodial Asset Segregation Reports</li>
                        <li>Annual Risk Assessment</li>
                        <li>Cross-Border Transfer Risk Reports</li>
                      </ul>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">View Reporting Schedule</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Stablecoin Reporting Calendar</AlertDialogTitle>
                          <AlertDialogDescription>
                            Based on your jurisdiction selection, the following reports will be required:
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid gap-4">
                          <div className="rounded-md bg-muted p-3">
                            <div className="font-medium">Monthly</div>
                            <ul className="mt-2 text-sm text-muted-foreground">
                              <li>• Proof of Reserves Attestation</li>
                              <li>• Stablecoin Backing Certification</li>
                            </ul>
                          </div>
                          <div className="rounded-md bg-muted p-3">
                            <div className="font-medium">Quarterly</div>
                            <ul className="mt-2 text-sm text-muted-foreground">
                              <li>• Licensing Status Report</li>
                              <li>• Liquidity Stress Testing</li>
                            </ul>
                          </div>
                          <div className="rounded-md bg-muted p-3">
                            <div className="font-medium">Annually</div>
                            <ul className="mt-2 text-sm text-muted-foreground">
                              <li>• Risk Assessment Report</li>
                              <li>• Operational Controls Review</li>
                            </ul>
                          </div>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Close</AlertDialogCancel>
                          <AlertDialogAction>Submit Registration to Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          {/* Technical Details Tab */}
          <TabsContent value="technical" className="mt-4 space-y-6">
            <FormField
              control={form.control}
              name="chainIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chain IDs</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List blockchain IDs where your token is deployed (e.g., Ethereum Mainnet (1), Polygon (137), etc.)" 
                      {...field} 
                      className="h-24"
                    />
                  </FormControl>
                  <FormDescription>Blockchains where your token is available</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="security">
                <AccordionTrigger>Smart Contract Security</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 text-sm">
                    <p>
                      Stablecoin issuers should provide information about smart contract security measures.
                      This includes audit reports, bug bounty programs, and details about admin key management.
                    </p>
                    <div className="border rounded-md p-3">
                      <p className="font-medium mb-2">Recommended Security Practices:</p>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Regular third-party security audits</li>
                        <li>Multi-signature admin controls</li>
                        <li>Time-lock mechanisms for major changes</li>
                        <li>Formal verification of critical functions</li>
                        <li>Secure custody of private keys</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            type="button"
            onClick={() => form.reset()}
          >
            Reset Form
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Register Stablecoin
          </Button>
        </div>
      </form>
    </Form>
  );
}