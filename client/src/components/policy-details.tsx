import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Edit, Check, X, Clock, AlertTriangle, FileText, Tag, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PolicyDetailsProps {
  policyId: number;
  open: boolean;
  onClose: () => void;
}

export function PolicyDetails({ policyId, open, onClose }: PolicyDetailsProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch policy details
  const { data: policy, isLoading } = useQuery({
    queryKey: ["/api/policies", policyId],
    queryFn: async () => {
      const response = await fetch(`/api/policies/${policyId}`);
      if (!response.ok) throw new Error("Failed to fetch policy details");
      return response.json();
    },
    enabled: !!policyId && open,
  });

  // Fetch policy versions
  const { data: versions, isLoading: isLoadingVersions } = useQuery({
    queryKey: ["/api/policies", policyId, "versions"],
    queryFn: async () => {
      const response = await fetch(`/api/policies/${policyId}/versions`);
      if (!response.ok) throw new Error("Failed to fetch policy versions");
      return response.json();
    },
    enabled: !!policyId && open,
  });

  // Fetch policy tags
  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ["/api/policies", policyId, "tags"],
    queryFn: async () => {
      const response = await fetch(`/api/policies/${policyId}/tags`);
      if (!response.ok) throw new Error("Failed to fetch policy tags");
      return response.json();
    },
    enabled: !!policyId && open,
  });

  // Fetch policy obligations
  const { data: obligations, isLoading: isLoadingObligations } = useQuery({
    queryKey: ["/api/policies", policyId, "obligations"],
    queryFn: async () => {
      const response = await fetch(`/api/policies/${policyId}/obligations`);
      if (!response.ok) throw new Error("Failed to fetch policy obligations");
      return response.json();
    },
    enabled: !!policyId && open,
  });

  const updatePolicyMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await apiRequest("PUT", `/api/policies/${policyId}`, {
        content: { text: data.content },  // Use the expected object structure
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Policy updated",
        description: "Policy content has been updated successfully.",
      });
      
      // Cancel edit mode
      setEditMode(false);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/policies", policyId] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update policy",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const addVersionMutation = useMutation({
    mutationFn: async (data: { content: string; version: string; change_notes: string }) => {
      const response = await apiRequest("POST", `/api/policies/${policyId}/versions`, {
        ...data,
        content: { text: data.content }  // Use the expected object structure
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "New version created",
        description: "A new version of this policy has been created.",
      });
      
      // Cancel edit mode
      setEditMode(false);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/policies", policyId] });
      queryClient.invalidateQueries({ queryKey: ["/api/policies", policyId, "versions"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create version",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async (tag: string) => {
      const response = await apiRequest("POST", `/api/policies/${policyId}/tags`, { tag });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Tag added",
        description: "Tag has been added to the policy.",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/policies", policyId, "tags"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add tag",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleStartEdit = () => {
    if (policy) {
      // Handle content being an object with a text property or a string
      const content = typeof policy.content === 'object' && policy.content !== null
        ? policy.content.text || JSON.stringify(policy.content)
        : policy.content || "";
      
      setEditedContent(content);
      setEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    if (editedContent) {
      updatePolicyMutation.mutate({ content: editedContent });
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleCreateVersion = () => {
    if (policy && editedContent) {
      const versionNumber = versions && versions.length > 0 
        ? (parseFloat(versions[0].version) + 0.1).toFixed(1) 
        : "1.1";
        
      addVersionMutation.mutate({
        content: editedContent,
        version: versionNumber,
        change_notes: `Updated policy content on ${new Date().toISOString().split('T')[0]}`,
      });
    }
  };

  const handleAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tag = formData.get('tag') as string;
    
    if (tag) {
      addTagMutation.mutate(tag);
      (e.target as HTMLFormElement).reset();
    }
  };

  const statusVariants = {
    draft: { bg: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", icon: <Clock className="h-4 w-4 mr-1" /> },
    review_needed: { bg: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300", icon: <AlertTriangle className="h-4 w-4 mr-1" /> },
    active: { bg: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: <Check className="h-4 w-4 mr-1" /> },
    archived: { bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300", icon: <FileText className="h-4 w-4 mr-1" /> },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!policy) return null;

  const status = policy.status as keyof typeof statusVariants || "draft";
  const statusStyle = statusVariants[status] || statusVariants.draft;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl">{policy.name}</DialogTitle>
            <Badge 
              variant="outline" 
              className={`${statusStyle.bg} flex items-center capitalize`}
            >
              {statusStyle.icon}
              {policy.status.replace("_", " ")}
            </Badge>
          </div>
          <DialogDescription>
            {policy.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="obligations">Obligations</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Policy Type: <span className="font-medium">{policy.type}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Last Updated: <span className="font-medium">{formatDate(policy.updated_at || policy.created_at)}</span>
                </p>
              </div>
              
              {!editMode ? (
                <Button size="sm" onClick={handleStartEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCreateVersion}>
                    <FileText className="h-4 w-4 mr-2" />
                    Save as New Version
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit} disabled={updatePolicyMutation.isPending}>
                    {updatePolicyMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>

            {editMode ? (
              <Textarea 
                className="min-h-[300px] font-mono text-sm"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <div className="border rounded-md p-4 min-h-[300px] whitespace-pre-wrap">
                {typeof policy.content === 'object' && policy.content !== null
                  ? policy.content.text || JSON.stringify(policy.content, null, 2)
                  : policy.content || ""}
              </div>
            )}
          </TabsContent>

          <TabsContent value="versions">
            {isLoadingVersions ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : versions && versions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Change Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version: any) => (
                    <TableRow key={version.id}>
                      <TableCell className="font-medium">{version.version}</TableCell>
                      <TableCell>{formatDate(version.created_at)}</TableCell>
                      <TableCell>User #{version.created_by}</TableCell>
                      <TableCell>{version.change_notes}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No versions found. Edit the policy and create a new version to start tracking changes.
              </div>
            )}
          </TabsContent>

          <TabsContent value="tags">
            <Card>
              <CardHeader>
                <CardTitle>Policy Tags</CardTitle>
                <CardDescription>
                  Add tags to categorize and find this policy more easily
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTag} className="flex items-center space-x-2 mb-4">
                  <Input
                    name="tag"
                    placeholder="Add a new tag..."
                    className="flex-grow"
                  />
                  <Button type="submit" size="sm" disabled={addTagMutation.isPending}>
                    {addTagMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Tag className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </form>

                <div className="flex flex-wrap gap-2 mt-2">
                  {isLoadingTags ? (
                    <div className="w-full flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : tags && tags.length > 0 ? (
                    tags.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags added yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="obligations">
            <Card>
              <CardHeader>
                <CardTitle>Linked Obligations</CardTitle>
                <CardDescription>
                  Map this policy to regulatory obligations from different jurisdictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingObligations ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : obligations && obligations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Obligation</TableHead>
                        <TableHead>Jurisdiction</TableHead>
                        <TableHead>Coverage Level</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {obligations.map((obligation: any) => (
                        <TableRow key={obligation.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <span>Obligation #{obligation.obligation_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            <Badge className={obligation.coverage_level >= 75 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : obligation.coverage_level >= 50
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }>
                              {obligation.coverage_level}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost">
                              <LinkIcon className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No obligations mapped yet. Use the Obligation Mapper tab to link regulatory obligations to this policy.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}