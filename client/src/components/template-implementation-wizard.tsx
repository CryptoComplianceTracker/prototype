import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ChevronRight, Edit3, FileText, HelpCircle, Info, Package, Settings2, Users } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Template {
  id: string;
  name: string;
  category: string;
  region: string;
  description: string;
  content: string;
  version: string;
}

interface Entity {
  id: string;
  name: string;
  type: string;
  jurisdiction: string;
}

interface TemplateStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function TemplateImplementationWizard({ templateId, onClose }: { templateId: string, onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [implementationName, setImplementationName] = useState("");
  const [customizedContent, setCustomizedContent] = useState("");
  const [implementationNotes, setImplementationNotes] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [reviewDate, setReviewDate] = useState("");
  const { toast } = useToast();
  
  // Fetch the template details
  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    queryKey: [`/api/templates/${templateId}`],
    queryFn: async () => {
      // Mock data for demo - in real app this would be an API call
      return {
        id: "tmpl-1",
        name: "FATF Travel Rule Policy",
        category: "AML",
        region: "Global",
        description: "Standard policy template for implementing the FATF Travel Rule for virtual asset service providers",
        content: "# FATF Travel Rule Policy\n\n## 1. Overview\nThis policy outlines procedures for compliance with the Financial Action Task Force (FATF) Travel Rule...\n\n## 2. Purpose\nTo establish standards for transmitting required originator and beneficiary information during virtual asset transfers.\n\n## 3. Scope\nThis policy applies to all virtual asset transfers conducted by [ENTITY_NAME] that meet the threshold requirements.\n\n## 4. Regulatory Background\nThe FATF Recommendation 16, known as the 'Travel Rule', requires VASPs and financial institutions to include and transmit originator and beneficiary information during virtual asset transfers.\n\n## 5. Requirements\n- Collect and verify required information for both originators and beneficiaries\n- Securely transmit this information to counterparty VASPs\n- Maintain records of all transmissions\n- Implement screening measures against sanctioned individuals and entities\n\n## 6. Implementation Procedures\n### 6.1 Technical Implementation\n[ENTITY_NAME] will utilize [PROTOCOL_NAME] for secure transmission of Travel Rule data.\n\n### 6.2 Threshold\nTravel Rule requirements apply to all virtual asset transfers valued at USD/EUR 1,000 or more.\n\n### 6.3 Required Information\nFor Originators:\n- Name\n- Account number/wallet address\n- Physical address, national identity number, or date and place of birth\n\nFor Beneficiaries:\n- Name\n- Account number/wallet address\n\n## 7. Compliance Review\nThis policy will be reviewed [REVIEW_FREQUENCY] to ensure alignment with evolving regulatory requirements and industry standards.\n\n## 8. Training\nAll relevant staff will receive training on Travel Rule requirements and implementation procedures.\n\n## 9. Record Keeping\nAll Travel Rule data and transmissions will be securely stored for a minimum of five years.\n\n## 10. Responsibility\n[COMPLIANCE_OFFICER_TITLE] is responsible for overseeing implementation and ongoing compliance with this policy.",
        version: "1.2"
      };
    }
  });
  
  // Fetch entities that the user can assign the template to
  const { data: entities = [] } = useQuery({
    queryKey: ['/api/entities'],
    queryFn: async () => {
      // Mock data for demo - in real app this would be an API call
      return [
        { id: "ent-1", name: "CryptoX Exchange", type: "Exchange", jurisdiction: "Singapore" },
        { id: "ent-2", name: "DeFi Protocol Inc.", type: "DeFi Protocol", jurisdiction: "Switzerland" },
        { id: "ent-3", name: "StableCoin Ltd", type: "Stablecoin Issuer", jurisdiction: "United Kingdom" },
        { id: "ent-4", name: "Crypto Fund Partners", type: "Investment Fund", jurisdiction: "Cayman Islands" },
        { id: "ent-5", name: "NFT Marketplace Global", type: "NFT Marketplace", jurisdiction: "United States" }
      ];
    }
  });
  
  // Fetch users for assignment
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      // Mock data for demo - in real app this would be an API call
      return [
        { id: "usr-1", name: "Sarah Johnson", role: "Compliance Officer", department: "Compliance" },
        { id: "usr-2", name: "Michael Chen", role: "Legal Counsel", department: "Legal" },
        { id: "usr-3", name: "Alex Williams", role: "Compliance Analyst", department: "Compliance" },
        { id: "usr-4", name: "Lisa Rodriguez", role: "Risk Manager", department: "Risk" },
        { id: "usr-5", name: "David Kim", role: "Compliance Director", department: "Compliance" }
      ];
    }
  });
  
  // Implementation steps
  const steps: TemplateStep[] = [
    {
      id: "step-1",
      title: "Select Entity",
      description: "Choose the entity that will implement this template",
      completed: !!selectedEntity
    },
    {
      id: "step-2",
      title: "Customize Template",
      description: "Modify the template to fit your entity's specific needs",
      completed: !!customizedContent
    },
    {
      id: "step-3",
      title: "Assign Stakeholders",
      description: "Assign team members for implementation and review",
      completed: assignees.length > 0
    },
    {
      id: "step-4",
      title: "Set Review Schedule",
      description: "Establish review dates and monitoring procedures",
      completed: !!reviewDate
    }
  ];
  
  // Handle template implementation creation
  const implementTemplateMutation = useMutation({
    mutationFn: async (formData: any) => {
      // This would be an API call in a real app
      console.log("Implementing template with data:", formData);
      return { id: "impl-1", ...formData };
    },
    onSuccess: () => {
      toast({
        title: "Template implemented successfully",
        description: "The template has been customized and implemented for your entity.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Implementation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the implementation
      if (template) {
        const implementationData = {
          templateId: template.id,
          entityId: selectedEntity,
          name: implementationName || `${getEntityName()} ${template.name}`,
          content: customizedContent,
          notes: implementationNotes,
          assignees,
          reviewDate,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        
        implementTemplateMutation.mutate(implementationData);
      }
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const getEntityName = () => {
    const entity = entities.find(e => e.id === selectedEntity);
    return entity ? entity.name : "";
  };
  
  const currentProgress = Math.round(((currentStep + 1) / steps.length) * 100);
  
  if (isLoadingTemplate) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!template) return null;
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Implement Template: {template.name}</DialogTitle>
          <DialogDescription>
            Customize and implement this template for your specific entity and compliance needs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Implementation Progress</span>
            <span>{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Steps sidebar */}
          <div className="col-span-3">
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`p-3 rounded-md flex items-start space-x-3 cursor-pointer ${
                    index === currentStep 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                >
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? 'bg-green-100 text-green-700' 
                      : index === currentStep 
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="col-span-9">
            {/* Step 1: Select Entity */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md flex items-start space-x-3 mb-4">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">About Template Implementation</h4>
                    <p className="text-sm text-muted-foreground">
                      Implementing a template creates a new compliance document based on this template but customized 
                      for your specific entity. You can modify the content as needed while maintaining alignment 
                      with regulatory requirements.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="entity">Select Entity</Label>
                    <Select 
                      value={selectedEntity || undefined} 
                      onValueChange={setSelectedEntity}
                    >
                      <SelectTrigger id="entity">
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {entities.map(entity => (
                            <SelectItem key={entity.id} value={entity.id}>
                              <div className="flex flex-col">
                                <span>{entity.name}</span>
                                <span className="text-xs text-muted-foreground">{entity.type} - {entity.jurisdiction}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="implementation-name">Implementation Name (Optional)</Label>
                    <Input
                      id="implementation-name"
                      placeholder={selectedEntity ? `${getEntityName()} ${template.name}` : "Enter a name for this implementation"}
                      value={implementationName}
                      onChange={(e) => setImplementationName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      If left blank, we'll use the entity name + template name
                    </p>
                  </div>
                </div>
                
                {selectedEntity && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Selected Entity</CardTitle>
                      <CardDescription>
                        Implementation will be customized for this entity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const entity = entities.find(e => e.id === selectedEntity);
                        if (!entity) return null;
                        
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Name:</span>
                              <span className="text-sm">{entity.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Type:</span>
                              <span className="text-sm">{entity.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Jurisdiction:</span>
                              <span className="text-sm">{entity.jurisdiction}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* Step 2: Customize Template */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md flex items-start space-x-3 mb-4">
                  <Edit3 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Template Customization</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize the template content to fit your entity's specific requirements. 
                      Replace placeholders like [ENTITY_NAME] with your entity's information.
                    </p>
                  </div>
                </div>
                
                <Tabs defaultValue="edit">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="edit">Edit Content</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit">
                    <Textarea
                      className="min-h-[400px] font-mono text-sm"
                      value={customizedContent || template.content}
                      onChange={(e) => setCustomizedContent(e.target.value)}
                    />
                    
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="implementation-notes">Implementation Notes</Label>
                      <Textarea
                        id="implementation-notes"
                        placeholder="Add any notes or context about your implementation"
                        value={implementationNotes}
                        onChange={(e) => setImplementationNotes(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <div className="border rounded-md p-4 min-h-[400px] whitespace-pre-wrap font-mono text-sm">
                      {customizedContent || template.content}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {/* Step 3: Assign Stakeholders */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md flex items-start space-x-3 mb-4">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Assign Stakeholders</h4>
                    <p className="text-sm text-muted-foreground">
                      Assign team members who will be responsible for implementing, reviewing, 
                      and maintaining compliance with this template.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Select Assignees</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {users.map(user => (
                      <div 
                        key={user.id}
                        className={`p-3 border rounded-md cursor-pointer ${
                          assignees.includes(user.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                        }`}
                        onClick={() => {
                          if (assignees.includes(user.id)) {
                            setAssignees(assignees.filter(id => id !== user.id));
                          } else {
                            setAssignees([...assignees, user.id]);
                          }
                        }}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{user.name}</span>
                          {assignees.includes(user.id) && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.role}, {user.department}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Stakeholder Responsibilities</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>Implementation Lead: Oversees overall implementation of the policy</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>Subject Matter Expert: Provides domain expertise during implementation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>Reviewer: Validates implementation against regulatory requirements</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>Approver: Provides final sign-off on the implemented policy</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Step 4: Set Review Schedule */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-md flex items-start space-x-3 mb-4">
                  <Settings2 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Review and Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Establish review dates and monitoring procedures to ensure ongoing compliance with this template.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="next-review">Next Review Date</Label>
                    <Input
                      id="next-review"
                      type="date"
                      value={reviewDate}
                      onChange={(e) => setReviewDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Review Frequency</Label>
                    <Select defaultValue="quarterly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select review frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="biannually">Bi-annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Monitoring Type</Label>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select monitoring type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active Monitoring</SelectItem>
                        <SelectItem value="periodic">Periodic Review</SelectItem>
                        <SelectItem value="eventbased">Event-Based Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Implementation Summary</CardTitle>
                    <CardDescription>
                      Review your implementation details before finalizing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Template:</dt>
                        <dd className="text-sm">{template.name} (v{template.version})</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Entity:</dt>
                        <dd className="text-sm">{getEntityName()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Implementation Name:</dt>
                        <dd className="text-sm">{implementationName || `${getEntityName()} ${template.name}`}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Assignees:</dt>
                        <dd className="text-sm">{assignees.length} stakeholders assigned</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium">Next Review:</dt>
                        <dd className="text-sm">{reviewDate || "Not set"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between items-center mt-6">
          <div>
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
            )}
          </div>
          
          <Button 
            onClick={handleNextStep}
            disabled={
              (currentStep === 0 && !selectedEntity) ||
              (currentStep === 3 && !reviewDate) ||
              implementTemplateMutation.isPending
            }
          >
            {currentStep === steps.length - 1 ? (
              implementTemplateMutation.isPending ? "Implementing..." : "Implement Template"
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}