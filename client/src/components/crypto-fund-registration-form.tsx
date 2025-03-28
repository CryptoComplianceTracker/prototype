import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type InsertCryptoFundInfo, cryptoFundInfoSchema } from "@shared/schema";
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

export function CryptoFundRegistrationForm() {
  const { toast } = useToast();
  const form = useForm<InsertCryptoFundInfo>({
    resolver: zodResolver(cryptoFundInfoSchema),
    defaultValues: {
      fundName: "",
      fundType: "Hedge Fund",
      registrationNumber: "",
      jurisdiction: "",
      websiteUrl: "",
      investmentStrategy: {},
      assetAllocation: {},
      riskProfile: {},
      custodyArrangements: {},
      valuationMethods: {},
      regulatoryLicenses: {},
      amlProcedures: {},
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCryptoFundInfo) => {
      const response = await apiRequest("POST", "/api/fund/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register crypto fund");
      }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fundName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fund Name</FormLabel>
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
                  <FormLabel>Fund Type</FormLabel>
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
                  <FormLabel>Registration Number</FormLabel>
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
                  <FormLabel>Jurisdiction</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., United States, Cayman Islands" {...field} />
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
                    <Input placeholder="https://www.example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register Crypto Fund
        </Button>
      </form>
    </Form>
  );
}
