import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, InfoIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { TOKEN_CATEGORIES, TOKEN_TYPES, TOKEN_STANDARDS, BLOCKCHAIN_NETWORKS, REGULATORY_STATUS_OPTIONS } from "@/lib/token-types";

// Form schema
const tokenSchema = z.object({
  tokenName: z.string().min(2, "Token name must be at least 2 characters"),
  tokenSymbol: z.string().min(1, "Token symbol is required").max(10, "Token symbol should be at most 10 characters"),
  tokenCategory: z.enum(TOKEN_CATEGORIES as [string, ...string[]]),
  tokenType: z.string().min(1, "Token type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  issuerName: z.string().min(2, "Issuer name must be at least 2 characters"),
  issuerLegalEntity: z.string().min(2, "Legal entity name must be at least 2 characters"),
  websiteUrl: z.string().url("Please enter a valid URL"),
  whitepaperUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  blockchainNetworks: z.array(z.object({
    name: z.string(),
    chainId: z.string()
  })).min(1, "At least one blockchain network is required"),
  contractAddresses: z.array(z.object({
    network: z.string(),
    address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format")
  })).min(1, "At least one contract address is required"),
  tokenStandard: z.string().optional(),
  totalSupply: z.string().optional(),
  regulatoryStatus: z.string().optional(),
  jurisdictions: z.array(z.object({
    id: z.number(),
    name: z.string()
  })).optional(),
  complianceContacts: z.array(z.object({
    name: z.string(),
    email: z.string().email("Please enter a valid email"),
    role: z.string()
  })).optional(),
  kycRequirements: z.string().optional(),
  amlPolicyUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  transferRestrictions: z.string().optional(),
  assetBackingDetails: z.any().optional(),
  pegDetails: z.any().optional(),
  securityFeatures: z.any().optional(),
  tokenomicsDetails: z.any().optional(),
  whitelistStatus: z.boolean().optional(),
  securityAuditDetails: z.any().optional(),
  lastAuditDate: z.date().optional(),
  registrationStatus: z.string().default("draft")
});

type TokenFormValues = z.infer<typeof tokenSchema>;

export default function TokenRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      tokenCategory: "UTILITY", // Default category
      tokenType: "",
      description: "",
      issuerName: "",
      issuerLegalEntity: "",
      websiteUrl: "",
      whitepaperUrl: "",
      blockchainNetworks: [{ name: "", chainId: "" }],
      contractAddresses: [{ network: "", address: "" }],
      tokenStandard: "",
      totalSupply: "",
      regulatoryStatus: "",
      jurisdictions: [],
      complianceContacts: [{ name: "", email: "", role: "" }],
      kycRequirements: "",
      amlPolicyUrl: "",
      transferRestrictions: "",
      assetBackingDetails: {},
      pegDetails: {},
      securityFeatures: {},
      tokenomicsDetails: {},
      whitelistStatus: false,
      securityAuditDetails: {},
      registrationStatus: "draft"
    }
  });

  // Get available token types based on selected category
  const availableTokenTypes = useMemo(() => {
    const category = form.watch("tokenCategory");
    return TOKEN_TYPES[category as keyof typeof TOKEN_TYPES] || [];
  }, [form.watch("tokenCategory")]);

  // Get available token standards based on selected blockchain
  const availableTokenStandards = useMemo(() => {
    const networks = form.watch("blockchainNetworks");
    if (!networks || networks.length === 0 || !networks[0].name) return TOKEN_STANDARDS["Ethereum"];
    
    const primaryNetwork = networks[0].name;
    const standards = Object.keys(TOKEN_STANDARDS).find(network => 
      primaryNetwork.includes(network)
    );
    
    return standards ? TOKEN_STANDARDS[standards as keyof typeof TOKEN_STANDARDS] : TOKEN_STANDARDS["Other"];
  }, [form.watch("blockchainNetworks")]);

  // Mutation for token registration
  const registerTokenMutation = useMutation({
    mutationFn: async (values: TokenFormValues) => {
      const response = await apiRequest("POST", "/api/tokens", values);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Token Registration Submitted",
        description: "Your token has been successfully registered",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tokens"] });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error submitting your token registration",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = async (values: TokenFormValues) => {
    setLoading(true);
    try {
      await registerTokenMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error submitting token registration:", error);
    } finally {
      setLoading(false);
    }
  };

  // Contract address field array
  const addContractAddress = () => {
    const currentAddresses = form.getValues("contractAddresses") || [];
    form.setValue("contractAddresses", [
      ...currentAddresses,
      { network: "", address: "" }
    ]);
  };

  const removeContractAddress = (index: number) => {
    const currentAddresses = form.getValues("contractAddresses") || [];
    if (currentAddresses.length <= 1) return;
    form.setValue("contractAddresses", 
      currentAddresses.filter((_, i) => i !== index)
    );
  };

  // Blockchain network field array
  const addBlockchainNetwork = () => {
    const currentNetworks = form.getValues("blockchainNetworks") || [];
    form.setValue("blockchainNetworks", [
      ...currentNetworks,
      { name: "", chainId: "" }
    ]);
  };

  const removeBlockchainNetwork = (index: number) => {
    const currentNetworks = form.getValues("blockchainNetworks") || [];
    if (currentNetworks.length <= 1) return;
    form.setValue("blockchainNetworks", 
      currentNetworks.filter((_, i) => i !== index)
    );
  };

  // Compliance contact field array
  const addComplianceContact = () => {
    const currentContacts = form.getValues("complianceContacts") || [];
    form.setValue("complianceContacts", [
      ...currentContacts,
      { name: "", email: "", role: "" }
    ]);
  };

  const removeComplianceContact = (index: number) => {
    const currentContacts = form.getValues("complianceContacts") || [];
    if (currentContacts.length <= 1) return;
    form.setValue("complianceContacts", 
      currentContacts.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <Card className="w-full bg-card">
        <CardHeader>
          <CardTitle className="text-2xl">Token Registration</CardTitle>
          <CardDescription>
            Register your token with comprehensive compliance information to ensure regulatory compliance across jurisdictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Token Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Basic Token Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tokenName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Token Name" {...field} />
                        </FormControl>
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
                          <Input placeholder="Token Symbol" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tokenCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TOKEN_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the category that best describes your token
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tokenType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a token type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTokenTypes.map((type) => (
                              <SelectItem key={type.type} value={type.type}>
                                {type.type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the specific type within the chosen category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your token's purpose and functionality"
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Issuer Information */}
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-semibold">Issuer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="issuerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuer Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Issuer Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="issuerLegalEntity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Entity Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Legal Entity Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whitepaperUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Whitepaper URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/whitepaper" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Technical Information */}
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-semibold">Technical Information</h2>
                
                <div>
                  <h3 className="text-md font-medium mb-4">Blockchain Networks</h3>
                  {form.watch("blockchainNetworks")?.map((_, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end mb-4">
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`blockchainNetworks.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Network Name</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a network" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {BLOCKCHAIN_NETWORKS.map((network) => (
                                    <SelectItem key={network.chainId} value={network.name}>
                                      {network.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`blockchainNetworks.${index}.chainId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chain ID</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Chain ID" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeBlockchainNetwork(index)}
                          disabled={form.watch("blockchainNetworks")?.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBlockchainNetwork}
                    className="mt-2"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Network
                  </Button>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-4">Contract Addresses</h3>
                  {form.watch("contractAddresses")?.map((_, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end mb-4">
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`contractAddresses.${index}.network`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Network</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Network" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`contractAddresses.${index}.address`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contract Address</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="0x..." />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeContractAddress(index)}
                          disabled={form.watch("contractAddresses")?.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addContractAddress}
                    className="mt-2"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Contract Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tokenStandard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Standard</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a token standard" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTokenStandards.map((standard) => (
                              <SelectItem key={standard} value={standard}>
                                {standard}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <Input placeholder="e.g. 1,000,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Compliance Information */}
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-semibold">Compliance Information</h2>
                
                <FormField
                  control={form.control}
                  name="regulatoryStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regulatory Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select regulatory status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REGULATORY_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <h3 className="text-md font-medium mb-4">Compliance Contacts</h3>
                  {form.watch("complianceContacts")?.map((_, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end mb-4">
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`complianceContacts.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Contact Name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-4">
                        <FormField
                          control={form.control}
                          name={`complianceContacts.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="contact@example.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`complianceContacts.${index}.role`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Role" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeComplianceContact(index)}
                          disabled={form.watch("complianceContacts")?.length <= 1}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addComplianceContact}
                    className="mt-2"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Compliance Contact
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="kycRequirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KYC Requirements</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe KYC requirements for token holders" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transferRestrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transfer Restrictions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe any transfer restrictions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="amlPolicyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AML Policy URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/aml-policy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whitelistStatus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Whitelist Status</FormLabel>
                        <FormDescription>
                          Does your token use a whitelist for transfers or trading?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastAuditDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Security Audit Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Date of the most recent security audit for your token
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    By submitting this form, you certify that all information provided is accurate and complete. False 
                    or misleading information may result in rejection of your token registration and potential 
                    regulatory consequences.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}