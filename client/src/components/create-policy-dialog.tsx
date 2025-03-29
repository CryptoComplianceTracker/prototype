import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

// Define the policy form schema
const policyFormSchema = z.object({
  name: z.string().min(3, {
    message: "Policy name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  type: z.string().min(1, {
    message: "Please select a policy type.",
  }),
  jurisdiction_id: z.coerce.number().optional(),
  status: z.string().default("draft"),
  version: z.string().default("1.0"),
  content: z.string().min(20, {
    message: "Policy content must be at least 20 characters.",
  }),
});

type PolicyFormValues = z.infer<typeof policyFormSchema>;

const defaultValues: Partial<PolicyFormValues> = {
  status: "draft",
  version: "1.0",
};

interface CreatePolicyDialogProps {
  trigger?: React.ReactNode;
  onPolicyCreated?: () => void;
}

export function CreatePolicyDialog({ 
  trigger,
  onPolicyCreated
}: CreatePolicyDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
    defaultValues,
  });
  
  const policyMutation = useMutation({
    mutationFn: async (data: PolicyFormValues) => {
      const response = await apiRequest("POST", "/api/policies", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Policy created",
        description: "Your new policy has been created successfully.",
      });
      
      // Reset form and close dialog
      form.reset(defaultValues);
      setOpen(false);
      
      // Invalidate policies queries
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Callback if provided
      if (onPolicyCreated) {
        onPolicyCreated();
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to create policy",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: PolicyFormValues) {
    policyMutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create Policy</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Policy</DialogTitle>
          <DialogDescription>
            Create a new compliance policy for your organization. Policies can be drafted, reviewed, and approved through a workflow process.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AML Policy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aml">Anti-Money Laundering</SelectItem>
                        <SelectItem value="kyc">Know Your Customer</SelectItem>
                        <SelectItem value="sanctions">Sanctions Compliance</SelectItem>
                        <SelectItem value="governance">Corporate Governance</SelectItem>
                        <SelectItem value="risk">Risk Assessment</SelectItem>
                        <SelectItem value="data_protection">Data Protection</SelectItem>
                        <SelectItem value="crypto_custody">Crypto Custody</SelectItem>
                        <SelectItem value="travel_rule">Travel Rule</SelectItem>
                        <SelectItem value="transaction_monitoring">Transaction Monitoring</SelectItem>
                        <SelectItem value="reporting">Regulatory Reporting</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="Brief description of the policy purpose and scope" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the policy content here. You can describe procedures, requirements, and guidelines." 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This content will be versioned. You can update it later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={policyMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={policyMutation.isPending}>
                {policyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Policy"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}