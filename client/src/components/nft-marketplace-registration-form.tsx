import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type InsertNftMarketplaceInfo, nftMarketplaceInfoSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function NftMarketplaceRegistrationForm() {
  const { toast } = useToast();
  const form = useForm<InsertNftMarketplaceInfo>({
    resolver: zodResolver(nftMarketplaceInfoSchema),
    defaultValues: {
      marketplaceName: "",
      businessEntity: "",
      websiteUrl: "",
      supportedStandards: [],
      blockchainNetworks: [],
      smartContracts: {},
      royaltyEnforcement: {},
      listingPolicies: {},
      moderationProcedures: {},
      copyrightPolicies: {},
      amlPolicies: {},
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertNftMarketplaceInfo) => {
      const response = await apiRequest("POST", "/api/nft/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register NFT marketplace");
      }
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your NFT marketplace has been registered successfully.",
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
              name="marketplaceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketplace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter marketplace name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessEntity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Entity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter legal business name" {...field} />
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
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportedStandards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supported NFT Standards</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter supported NFT standards (e.g., ERC-721, ERC-1155)" 
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
                  <FormLabel>Supported Blockchain Networks</FormLabel>
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
          Register NFT Marketplace
        </Button>
      </form>
    </Form>
  );
}
