import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type InsertStablecoinInfo, stablecoinInfoSchema } from "@shared/schema";
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
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function StablecoinRegistrationForm() {
  const { toast } = useToast();
  const form = useForm<InsertStablecoinInfo>({
    resolver: zodResolver(stablecoinInfoSchema),
    defaultValues: {
      stablecoinName: "",
      tokenSymbol: "",
      issuerName: "",
      registrationNumber: "",
      jurisdiction: "",
      backingAssetType: "Fiat",
      peggedTo: "USD",
      totalSupply: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertStablecoinInfo) => {
      const response = await apiRequest("POST", "/api/stablecoin/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register stablecoin");
      }
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your stablecoin has been registered successfully.",
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
              name="stablecoinName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stablecoin Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter stablecoin name" {...field} />
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
                    <Input placeholder="e.g., USDT, USDC" {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g., United States, Singapore" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    </SelectContent>
                  </Select>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register Stablecoin
        </Button>
      </form>
    </Form>
  );
}
