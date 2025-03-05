import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type InsertDefiProtocolInfo, defiProtocolInfoSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function DefiProtocolRegistrationForm() {
  const { toast } = useToast();
  const form = useForm<InsertDefiProtocolInfo>({
    resolver: zodResolver(defiProtocolInfoSchema),
    defaultValues: {
      protocolName: "",
      protocolType: "Lending",
      websiteUrl: "",
      smartContractAddresses: [],
      supportedTokens: [],
      blockchainNetworks: [],
      securityAudits: {},
      insuranceCoverage: {},
      riskManagement: {},
      governanceStructure: {},
      tokenomics: {},
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertDefiProtocolInfo) => {
      const response = await apiRequest("POST", "/api/defi/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register DeFi protocol");
      }
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your DeFi protocol has been registered successfully.",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="protocolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocol Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter protocol name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="protocolType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocol Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select protocol type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lending">Lending Protocol</SelectItem>
                      <SelectItem value="DEX">Decentralized Exchange</SelectItem>
                      <SelectItem value="Yield">Yield Aggregator</SelectItem>
                      <SelectItem value="Insurance">Insurance Protocol</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smartContractAddresses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Smart Contract Addresses</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter smart contract addresses (one per line)" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split('\n'))}
                      value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportedTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supported Tokens</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter supported tokens (one per line)" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split('\n'))}
                      value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blockchainNetworks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockchain Networks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter supported blockchain networks (one per line)" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split('\n'))}
                      value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register DeFi Protocol
        </Button>
      </form>
    </Form>
  );
}
