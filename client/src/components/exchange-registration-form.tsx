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
import { useEffect } from "react";

export function ExchangeRegistrationForm() {
  const { toast } = useToast();

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
    mode: "onTouched", // Only validate after field is touched
  });

  const onSubmit = async (data: InsertExchangeInfo) => {
    try {
      await apiRequest("POST", "/api/exchange/register", data);
      toast({
        title: "Registration successful",
        description: "Your exchange information has been submitted.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Helper function to determine if a field should show error state
  const shouldShowError = (fieldName: string) => {
    return form.formState.touchedFields[fieldName] && form.formState.errors[fieldName];
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Exchange Registration</CardTitle>
        <CardDescription>
          Please provide detailed information about your cryptocurrency exchange.
          Fields will be validated as you type.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="single" collapsible defaultValue="general">
              <AccordionItem value="general">
                <AccordionTrigger>General Information</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="exchangeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exchange Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={shouldShowError("exchangeName") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Legal Entity Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={shouldShowError("legalEntityName") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Business Registration Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={shouldShowError("registrationNumber") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Headquarters Location</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Country, City"
                              className={shouldShowError("headquartersLocation") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://"
                              className={shouldShowError("websiteUrl") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Year Established</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="YYYY"
                              className={shouldShowError("yearEstablished") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Exchange Type</FormLabel>
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

              <AccordionItem value="compliance">
                <AccordionTrigger>Compliance Contact</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="complianceContactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={shouldShowError("complianceContactName") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className={shouldShowError("complianceContactEmail") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              className={shouldShowError("complianceContactPhone") ? "border-red-500" : ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security">
                <AccordionTrigger>Security & Risk Management</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="washTradingDetection.automatedBotDetection"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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

              <AccordionItem value="custody">
                <AccordionTrigger>Custody & Storage</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="custodyArrangements.coldStoragePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cold Storage Percentage</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="100"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className={shouldShowError("custodyArrangements.coldStoragePercentage") ? "border-red-500" : ""}
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
                        <FormItem>
                          <FormLabel>Hot Wallet Percentage</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="100"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className={shouldShowError("custodyArrangements.hotWalletPercentage") ? "border-red-500" : ""}
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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

              <AccordionItem value="sanctions">
                <AccordionTrigger>Sanctions Compliance</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 py-4">
                    <FormField
                      control={form.control}
                      name="sanctionsCompliance.ofacCompliant"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {Object.keys(form.formState.touchedFields).length > 0 &&
                  Object.keys(form.formState.errors).length > 0 && (
                    <p className="text-red-500">
                      Please fix the validation errors before submitting
                    </p>
                  )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}