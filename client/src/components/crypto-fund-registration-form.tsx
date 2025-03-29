import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type InsertCryptoFundInfo, cryptoFundInfoSchema } from "@shared/schema";
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
import { Loader2, HelpCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function CryptoFundRegistrationForm() {
  const { toast } = useToast();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("");
  
  // Fetch jurisdictions for the dropdown
  const { data: jurisdictions } = useQuery({
    queryKey: ["/api/jurisdictions"],
    queryFn: async () => {
      const response = await fetch("/api/jurisdictions");
      if (!response.ok) throw new Error("Failed to fetch jurisdictions");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const form = useForm<InsertCryptoFundInfo>({
    resolver: zodResolver(cryptoFundInfoSchema),
    defaultValues: {
      fundName: "",
      fundType: "Hedge Fund",
      registrationNumber: "",
      jurisdiction: "",
      jurisdictionId: 0,
      legalEntityType: "Limited Partnership",
      incorporationDate: "",
      websiteUrl: "",
      contactEmail: "",
      contactPhone: "",
      aum: "",
      fundCurrency: "USD",
      minimumInvestment: "",
      redemptionTerms: "",
      investmentStrategy: {},
      assetAllocation: {
        bitcoin: 0,
        ethereum: 0,
        otherL1: 0,
        defi: 0,
        nft: 0,
        stablecoin: 0,
        other: 0
      },
      targetReturns: "",
      managementFee: "",
      performanceFee: "",
      riskProfile: {
        riskLevel: "Medium",
        volatilityTarget: "",
        maxDrawdown: "",
        riskManagement: ""
      },
      custodyArrangements: {
        custodianName: "",
        coldStorage: false,
        insuranceDetails: "",
        jurisdictionOfCustody: ""
      },
      valuationMethods: {
        methodology: "",
        frequency: "Daily",
        thirdPartyValuation: false
      },
      regulatoryLicenses: {
        licenses: [],
        registrationNumbers: {}
      },
      amlProcedures: {
        kycProvider: "",
        ongoingMonitoring: false,
        travelRule: false
      },
      servicingProviders: {
        administrator: "",
        auditor: "",
        legalCounsel: "",
        taxAdvisor: ""
      },
      restrictedInvestors: {
        restrictedCountries: [],
        investorRestrictions: ""
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCryptoFundInfo) => {
      const response = await apiRequest("POST", "/api/fund/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register crypto fund");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your crypto fund has been registered successfully.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onJurisdictionChange = (value: string) => {
    setSelectedJurisdiction(value);
    form.setValue("jurisdiction", value);
    
    // Find jurisdiction by name and set ID if found
    if (jurisdictions) {
      const found = jurisdictions.find((j: any) => j.name === value);
      if (found) {
        form.setValue("jurisdictionId", found.id);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
        <Accordion type="single" collapsible defaultValue="basic-info" className="w-full">
          <AccordionItem value="basic-info">
            <AccordionTrigger className="text-xl font-semibold">Basic Information</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fundName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fund Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter fund name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fundType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fund Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select fund type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Hedge Fund">Hedge Fund</SelectItem>
                              <SelectItem value="Venture Capital">Venture Capital</SelectItem>
                              <SelectItem value="Private Equity">Private Equity</SelectItem>
                              <SelectItem value="ETF">ETF</SelectItem>
                              <SelectItem value="Index Fund">Index Fund</SelectItem>
                              <SelectItem value="Multi-Strategy">Multi-Strategy</SelectItem>
                              <SelectItem value="Algorithmic Trading">Algorithmic Trading</SelectItem>
                              <SelectItem value="Yield Farming">Yield Farming</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="legalEntityType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Legal Entity Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select entity type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Limited Partnership">Limited Partnership (LP)</SelectItem>
                              <SelectItem value="Limited Liability Company">Limited Liability Company (LLC)</SelectItem>
                              <SelectItem value="Corporation">Corporation</SelectItem>
                              <SelectItem value="Trust">Trust</SelectItem>
                              <SelectItem value="Foundation">Foundation</SelectItem>
                              <SelectItem value="SICAV">SICAV</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter registration number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="jurisdiction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jurisdiction *</FormLabel>
                          <Select 
                            onValueChange={onJurisdictionChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select jurisdiction" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jurisdictions ? (
                                jurisdictions.map((j: any) => (
                                  <SelectItem key={j.id} value={j.name}>
                                    {j.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <>
                                  <SelectItem value="United States">United States</SelectItem>
                                  <SelectItem value="Cayman Islands">Cayman Islands</SelectItem>
                                  <SelectItem value="British Virgin Islands">British Virgin Islands</SelectItem>
                                  <SelectItem value="Singapore">Singapore</SelectItem>
                                  <SelectItem value="Switzerland">Switzerland</SelectItem>
                                  <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                                  <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="incorporationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incorporation Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>Website URL *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fund-details">
            <AccordionTrigger className="text-xl font-semibold">Fund Details</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="aum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assets Under Management (USD)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10,000,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fundCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fund Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="CHF">CHF</SelectItem>
                              <SelectItem value="SGD">SGD</SelectItem>
                              <SelectItem value="HKD">HKD</SelectItem>
                              <SelectItem value="BTC">BTC</SelectItem>
                              <SelectItem value="ETH">ETH</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minimumInvestment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Investment</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 100,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="redemptionTerms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redemption Terms</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., Monthly with 30 days notice" 
                              className="resize-none h-20"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetReturns"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Returns (% per annum)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 15-20%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="managementFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Management Fee (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="performanceFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Performance Fee (%)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 20%" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="investment-strategy">
            <AccordionTrigger className="text-xl font-semibold">Investment Strategy & Asset Allocation</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <FormLabel className="text-lg font-semibold">Investment Strategy</FormLabel>
                    <FormDescription className="mb-4">
                      Describe the fund's approach to crypto investing, strategies employed, and primary focus areas
                    </FormDescription>
                    <FormField
                      control={form.control}
                      name="investmentStrategy.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strategy Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your fund's investment strategy" 
                              className="resize-none h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-4">
                    <FormLabel className="text-lg font-semibold">Asset Allocation (%)</FormLabel>
                    <FormDescription className="mb-4">
                      Indicate the target allocation percentages across crypto assets (totaling 100%)
                    </FormDescription>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="assetAllocation.bitcoin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bitcoin (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetAllocation.ethereum"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ethereum (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetAllocation.otherL1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other L1s (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetAllocation.defi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DeFi (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetAllocation.nft"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NFTs (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetAllocation.stablecoin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stablecoins (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="assetAllocation.other"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Other (%)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" max="100" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="risk-custody">
            <AccordionTrigger className="text-xl font-semibold">Risk Profile & Custody</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <FormLabel className="text-lg font-semibold">Risk Profile</FormLabel>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
                      <FormField
                        control={form.control}
                        name="riskProfile.riskLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select risk level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Very High">Very High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="riskProfile.volatilityTarget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Volatility Target (%)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 20%" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="riskProfile.maxDrawdown"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Drawdown (%)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 30%" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="riskProfile.riskManagement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Risk Management Practices</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your risk management approach" 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormLabel className="text-lg font-semibold">Custody Arrangements</FormLabel>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-2">
                      <FormField
                        control={form.control}
                        name="custodyArrangements.custodianName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custodian Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Coinbase Custody, BitGo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="custodyArrangements.jurisdictionOfCustody"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jurisdiction of Custody</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., United States" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="custodyArrangements.insuranceDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe insurance coverage" 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="custodyArrangements.coldStorage"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Cold Storage</FormLabel>
                              <FormDescription>
                                The majority of assets are stored in cold wallets
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="compliance">
            <AccordionTrigger className="text-xl font-semibold">Compliance & Regulatory</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <FormLabel className="text-lg font-semibold">Valuation Methods</FormLabel>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                      <FormField
                        control={form.control}
                        name="valuationMethods.methodology"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valuation Methodology</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe how assets are valued" 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="valuationMethods.frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valuation Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Daily">Daily</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="valuationMethods.thirdPartyValuation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Third-Party Valuation</FormLabel>
                              <FormDescription>
                                Fund uses independent third-party for asset valuation
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormLabel className="text-lg font-semibold">AML/KYC Procedures</FormLabel>
                    
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="amlProcedures.kycProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>KYC Provider/Solution</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Chainalysis KYT, Elliptic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row mb-6">
                      <FormField
                        control={form.control}
                        name="amlProcedures.ongoingMonitoring"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md flex-1">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Ongoing Monitoring</FormLabel>
                              <FormDescription>
                                We conduct ongoing transaction monitoring
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amlProcedures.travelRule"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md flex-1">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Travel Rule Compliance</FormLabel>
                              <FormDescription>
                                We comply with FATF Travel Rule
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="regulatoryLicenses.licenses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Regulatory Licenses & Registrations</FormLabel>
                          <FormDescription className="mb-2">
                            List all licenses and registrations held by the fund
                          </FormDescription>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., SEC Registered Investment Advisor, CFTC Commodity Pool Operator" 
                              className="resize-none h-24"
                              value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                              onChange={e => field.onChange(e.target.value.split('\n'))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="service-providers">
            <AccordionTrigger className="text-xl font-semibold">Service Providers & Restrictions</AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <FormLabel className="text-lg font-semibold">Service Providers</FormLabel>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
                      <FormField
                        control={form.control}
                        name="servicingProviders.administrator"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fund Administrator</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Apex Fund Services" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="servicingProviders.auditor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Auditor</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Deloitte, PwC" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="servicingProviders.legalCounsel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal Counsel</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Cooley LLP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="servicingProviders.taxAdvisor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax Advisor</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., KPMG" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="restrictedInvestors.restrictedCountries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">Restricted Countries</FormLabel>
                          <FormDescription className="mb-2">
                            List countries where the fund cannot accept investors (one per line)
                          </FormDescription>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., North Korea, Iran, Cuba" 
                              className="resize-none h-24"
                              value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                              onChange={e => field.onChange(e.target.value.split('\n'))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="restrictedInvestors.investorRestrictions"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Additional Investor Restrictions</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="e.g., Accredited Investors Only, Qualified Purchasers Only" 
                              className="resize-none h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center mb-4 text-sm text-muted-foreground">
                <HelpCircle className="h-4 w-4 mr-1" />
                Fields marked with * are required
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Required fields must be completed before submission.
                Other fields are recommended but optional.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button type="submit" className="w-full lg:w-auto" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register Crypto Fund
        </Button>
      </form>
    </Form>
  );
}
