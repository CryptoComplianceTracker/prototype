import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exchangeInfoSchema, type InsertExchangeInfo } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useWeb3Wallet } from "@/hooks/use-web3-wallet";
import { Web3WalletConnector } from "@/components/web3-wallet-connector";
import { calculateRiskScore } from "@/lib/risk-analysis";
import type { RiskAssessment } from "@shared/schema";

interface ExchangeRegistrationFormProps {
  onRiskAssessment?: (assessment: RiskAssessment) => void;
}

export function ExchangeRegistrationForm({ onRiskAssessment }: ExchangeRegistrationFormProps) {
  const { toast } = useToast();
  const { address: walletAddress, connect } = useWeb3Wallet();

  const form = useForm<InsertExchangeInfo>({
    resolver: zodResolver(exchangeInfoSchema),
    defaultValues: {
      exchangeName: "",
      legalEntityName: "",
      registrationNumber: "",
      headquartersLocation: "",
      websiteUrl: "",
      yearEstablished: "",
      exchangeType: "CEX",
      regulatoryLicenses: "",
      complianceContactName: "",
      complianceContactEmail: "",
      complianceContactPhone: "",
      supportedBlockchains: ["Ethereum"],
      washTradingDetection: {
        automatedBotDetection: false,
        timeStampGranularity: "milliseconds",
        spoofingDetection: false,
      },
      sanctionsCompliance: {
        ofacCompliant: false,
        fatfCompliant: false,
        euCompliant: false,
      },
      kycVerificationMetrics: {
        verifiedUsers: 0,
        nonVerifiedUsers: 0,
        highRiskJurisdictionPercentage: 0,
      },
      custodyArrangements: {
        coldStoragePercentage: 0,
        hotWalletPercentage: 0,
        userFundSegregation: false,
      },
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: InsertExchangeInfo) => {
    try {
      if (!walletAddress) {
        const address = await connect();
        if (!address) {
          toast({
            title: "Wallet Required",
            description: "Please connect your wallet to create an attestation for your registration.",
            variant: "destructive",
          });
          return;
        }
      }

      // Submit registration data
      const response = await apiRequest("POST", "/api/exchange/register", {
        ...data,
        walletAddress,
      });

      // Calculate and report risk assessment
      const riskAssessment = calculateRiskScore(data);
      onRiskAssessment?.(riskAssessment);

      toast({
        title: "Registration successful",
        description: "Your exchange information has been submitted and attestation created.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Move shouldShowError inside the component to access form
  const shouldShowError = (fieldName: string) => {
    return form.formState.touchedFields[fieldName] && form.formState.errors[fieldName];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-b from-background to-muted/20 shadow-xl">
      <CardHeader className="space-y-2 pb-8 border-b">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Exchange Registration
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          Please provide detailed information about your cryptocurrency exchange.
          Fields will be validated as you type.
        </CardDescription>
        <div className="pt-4">
          <Web3WalletConnector onConnect={connect} />
          {!walletAddress && (
            <p className="text-sm text-muted-foreground mt-2">
              Connect your wallet to create an on-chain attestation of your registration
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion
              type="single"
              collapsible
              defaultValue="general"
              className="space-y-4"
            >
              <AccordionItem value="general" className="border rounded-lg px-6 shadow-sm transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:bg-muted/5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-lg font-semibold">General Information</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="exchangeName"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Exchange Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={`transition-all duration-200 ${
                                shouldShowError("exchangeName")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="legalEntityName"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Legal Entity Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={`transition-all duration-200 ${
                                shouldShowError("legalEntityName")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Business Registration Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={`transition-all duration-200 ${
                                shouldShowError("registrationNumber")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="headquartersLocation"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Headquarters Location</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Country, City"
                              className={`transition-all duration-200 ${
                                shouldShowError("headquartersLocation")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Website URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://"
                              className={`transition-all duration-200 ${
                                shouldShowError("websiteUrl")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                          {field.value && !form.formState.errors.websiteUrl && (
                            <p className="text-sm text-green-600">Valid URL format</p>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearEstablished"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Year Established</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="YYYY"
                              className={`transition-all duration-200 ${
                                shouldShowError("yearEstablished")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="exchangeType"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Exchange Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select exchange type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CEX">Centralized (CEX)</SelectItem>
                              <SelectItem value="DEX">Decentralized (DEX)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="compliance" className="border rounded-lg px-6 shadow-sm transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:bg-muted/5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-lg font-semibold">Compliance Contact</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="complianceContactName"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={`transition-all duration-200 ${
                                shouldShowError("complianceContactName")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complianceContactEmail"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className={`transition-all duration-200 ${
                                shouldShowError("complianceContactEmail")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complianceContactPhone"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Contact Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              className={`transition-all duration-200 ${
                                shouldShowError("complianceContactPhone")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="security" className="border rounded-lg px-6 shadow-sm transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:bg-muted/5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-lg font-semibold">Security & Risk Management</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="washTradingDetection.automatedBotDetection"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Automated Bot Detection System</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="washTradingDetection.spoofingDetection"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Spoofing Detection Algorithms</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="custody" className="border rounded-lg px-6 shadow-sm transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:bg-muted/5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-lg font-semibold">Custody & Storage</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="custodyArrangements.coldStoragePercentage"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Cold Storage Percentage</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="100"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className={`transition-all duration-200 ${
                                shouldShowError("custodyArrangements.coldStoragePercentage")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="custodyArrangements.hotWalletPercentage"
                      render={({ field }) => (
                        <FormItem className="transition-all duration-200">
                          <FormLabel className="font-medium">Hot Wallet Percentage</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="100"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className={`transition-all duration-200 ${
                                shouldShowError("custodyArrangements.hotWalletPercentage")
                                  ? "border-red-500 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]"
                                  : field.value
                                  ? "border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.2)]"
                                  : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="custodyArrangements.userFundSegregation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>User Fund Segregation</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sanctions" className="border rounded-lg px-6 shadow-sm transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:bg-muted/5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="text-lg font-semibold">Sanctions Compliance</span>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="sanctionsCompliance.ofacCompliant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>OFAC Compliant</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sanctionsCompliance.fatfCompliant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>FATF Compliant</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sanctionsCompliance.euCompliant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 transition-all duration-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>EU Sanctions Compliant</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="space-y-4 pt-6">
              <div className="text-sm text-muted-foreground">
                {Object.keys(form.formState.touchedFields).length > 0 &&
                  Object.keys(form.formState.errors).length > 0 && (
                    <p className="text-red-500/90 bg-red-500/5 px-4 py-2 rounded-md">
                      Please fix the validation errors before submitting
                    </p>
                  )}
              </div>
              <Button
                type="submit"
                className="w-full transition-all duration-200 shadow-lg hover:shadow-primary/20"
                disabled={!walletAddress || !form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
              {!walletAddress && (
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to submit registration
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}