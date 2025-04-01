import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChecklistItem {
  id: number;
  category_id: number;
  task: string;
  responsible: string;
  notes: string | null;
  sequence: number;
  created_at: string | null;
  updated_at: string | null;
}

interface ChecklistCategory {
  id: number;
  jurisdiction_id: number;
  name: string;
  description: string | null;
  sequence: number;
  created_at: string | null;
  updated_at: string | null;
  items: ChecklistItem[];
}

interface ChecklistProgress {
  itemId: number;
  categoryId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  notes: string | null;
  completedAt: string | null;
  task: string;
  responsible: string;
  sequence: number;
}

export interface JurisdictionChecklistProps {
  jurisdictionId: number;
  jurisdictionName: string;
}

export default function JurisdictionChecklist({ jurisdictionId, jurisdictionName }: JurisdictionChecklistProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({});
  
  console.log(`JurisdictionChecklist component rendering with ID: ${jurisdictionId}, Name: ${jurisdictionName}`);
  
  // Fetch checklist categories
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useQuery({
    queryKey: [`/api/jurisdictions/${jurisdictionId}/checklists`],
    queryFn: async () => {
      console.log(`Fetching checklists for jurisdiction ID: ${jurisdictionId}`);
      const response = await fetch(`/api/jurisdictions/${jurisdictionId}/checklists`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching checklists: ${errorText}`);
        throw new Error('Failed to fetch checklists');
      }
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} checklist categories`);
      return data as ChecklistCategory[];
    },
    enabled: !!user && !!jurisdictionId
  });
  
  // Fetch user progress
  const {
    data: progress,
    isLoading: isLoadingProgress,
    error: progressError
  } = useQuery({
    queryKey: [`/api/jurisdictions/${jurisdictionId}/checklist-progress`],
    queryFn: async () => {
      console.log(`Fetching checklist progress for jurisdiction ID: ${jurisdictionId}`);
      const response = await fetch(`/api/jurisdictions/${jurisdictionId}/checklist-progress`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching checklist progress: ${errorText}`);
        throw new Error('Failed to fetch checklist progress');
      }
      const data = await response.json();
      console.log(`Successfully fetched checklist progress: ${data.length} items`);
      return data as ChecklistProgress[];
    },
    enabled: !!user && !!jurisdictionId
  });
  
  // Update item progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ itemId, status, notes }: { itemId: number, status: string, notes: string | null }) => {
      console.log(`Updating progress for item ${itemId} to status ${status}`);
      const response = await fetch(`/api/checklist-items/${itemId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error updating progress: ${errorText}`);
        throw new Error(`Failed to update progress: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully updated progress for item ${itemId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/jurisdictions/${jurisdictionId}/checklist-progress`] });
      toast({
        title: "Progress updated",
        description: "Your checklist progress has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update progress: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Initialize notes state from progress data
  useEffect(() => {
    if (progress) {
      const notes: Record<number, string> = {};
      progress.forEach(item => {
        if (item.notes) {
          notes[item.itemId] = item.notes;
        }
      });
      setItemNotes(notes);
    }
  }, [progress]);
  
  // Calculate progress statistics
  const progressStats = React.useMemo(() => {
    if (!progress) return { total: 0, completed: 0, inProgress: 0, notStarted: 0, percentComplete: 0 };
    
    const total = progress.length;
    const completed = progress.filter(p => p.status === 'completed').length;
    const inProgress = progress.filter(p => p.status === 'in_progress').length;
    const notStarted = progress.filter(p => p.status === 'not_started').length;
    const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, inProgress, notStarted, percentComplete };
  }, [progress]);
  
  // Handle status change
  const handleStatusChange = (itemId: number, status: 'not_started' | 'in_progress' | 'completed') => {
    updateProgressMutation.mutate({
      itemId,
      status,
      notes: itemNotes[itemId] || null
    });
  };
  
  // Handle notes change
  const handleNotesChange = (itemId: number, notes: string) => {
    setItemNotes(prev => ({ ...prev, [itemId]: notes }));
  };
  
  // Handle notes save
  const handleNotesSave = (itemId: number) => {
    const currentProgress = progress?.find(p => p.itemId === itemId);
    if (currentProgress) {
      updateProgressMutation.mutate({
        itemId,
        status: currentProgress.status,
        notes: itemNotes[itemId] || null
      });
    }
  };
  
  // Filter items based on selected tab
  const filteredCategories = React.useMemo(() => {
    if (!categories || !progress) return [];
    
    if (selectedTab === 'all') return categories;
    
    const statusFilter = selectedTab as 'not_started' | 'in_progress' | 'completed';
    
    return categories.map(category => {
      const filteredItems = category.items.filter(item => {
        const itemProgress = progress.find(p => p.itemId === item.id);
        return itemProgress?.status === statusFilter;
      });
      
      return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);
  }, [categories, progress, selectedTab]);
  
  if (isLoadingCategories || isLoadingProgress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading checklist data...</p>
      </div>
    );
  }
  
  if (categoriesError || progressError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {categoriesError instanceof Error ? categoriesError.message : 'Failed to load checklist data'}
          {progressError instanceof Error ? ` and ${progressError.message}` : ''}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{jurisdictionName} Compliance Checklist</h2>
          <p className="text-muted-foreground mt-1">
            Track your compliance progress for regulatory requirements in {jurisdictionName}.
          </p>
        </div>
        
        <Card className="w-full md:w-auto">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-40 space-y-1">
                <p className="text-sm font-medium">Overall Progress</p>
                <Progress value={progressStats.percentComplete} className="h-2" />
                <p className="text-sm text-muted-foreground">{progressStats.percentComplete}% Complete</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center w-full md:w-auto">
                <div>
                  <p className="text-2xl font-bold">{progressStats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{progressStats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{progressStats.notStarted}</p>
                  <p className="text-xs text-muted-foreground">Not Started</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4 grid grid-cols-4 max-w-[500px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="not_started">Not Started</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No checklist items found for this filter.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {filteredCategories.map((category) => (
                <AccordionItem 
                  key={category.id} 
                  value={category.id.toString()}
                  className="border bg-card rounded-md"
                >
                  <AccordionTrigger className="px-4 py-2 hover:no-underline">
                    <div className="flex flex-col items-start">
                      <span className="text-lg font-semibold">{category.name}</span>
                      {category.description && (
                        <span className="text-sm text-muted-foreground">{category.description}</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-0 pb-2">
                    <div className="space-y-4">
                      {category.items.map((item) => {
                        const itemProgress = progress?.find(p => p.itemId === item.id);
                        const status = itemProgress?.status || 'not_started';
                        
                        return (
                          <Card key={item.id} className="border border-muted">
                            <CardHeader className="p-4 pb-2">
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <CardTitle className="text-base">{item.task}</CardTitle>
                                  {item.responsible && (
                                    <CardDescription>
                                      Responsible: {item.responsible}
                                    </CardDescription>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant={status === 'not_started' ? 'default' : 'outline'}
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => handleStatusChange(item.id, 'not_started')}
                                  >
                                    <Circle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Not Started</span>
                                  </Button>
                                  <Button
                                    variant={status === 'in_progress' ? 'default' : 'outline'}
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => handleStatusChange(item.id, 'in_progress')}
                                  >
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">In Progress</span>
                                  </Button>
                                  <Button
                                    variant={status === 'completed' ? 'default' : 'outline'}
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => handleStatusChange(item.id, 'completed')}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Completed</span>
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              {item.notes && (
                                <div className="mt-2 p-2 bg-muted/50 rounded-md text-sm">
                                  <p className="text-muted-foreground">{item.notes}</p>
                                </div>
                              )}
                              <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium">Your Notes:</p>
                                <Textarea
                                  placeholder="Add your notes about this requirement..."
                                  value={itemNotes[item.id] || ''}
                                  onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                  className="h-24"
                                />
                                <Button 
                                  size="sm" 
                                  onClick={() => handleNotesSave(item.id)}
                                  disabled={updateProgressMutation.isPending}
                                >
                                  {updateProgressMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : null}
                                  Save Notes
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}