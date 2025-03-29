import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Tag, Clock, Filter, ArrowUpDown, Check, X, Copy, Download, Globe, Shield, FileText, Edit, Trash2, EyeIcon } from "lucide-react";

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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Template {
  id: string;
  name: string;
  category: string;
  region: string;
  description: string;
  lastUpdated: string;
  status: "approved" | "draft" | "archived";
  version: string;
  content: string;
  tags: string[];
  useCount: number;
  createdBy: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  templateCount: number;
}

export default function GlobalTemplateStudio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [templateToView, setTemplateToView] = useState<Template | null>(null);
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch templates
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/templates"],
    queryFn: async () => {
      // For now, return mock data; will be replaced with actual API call
      return [
        {
          id: "tmpl-1",
          name: "FATF Travel Rule Policy",
          category: "AML",
          region: "Global",
          description: "Standard policy template for implementing the FATF Travel Rule for virtual asset service providers",
          lastUpdated: "2025-03-01",
          status: "approved",
          version: "1.2",
          content: "# FATF Travel Rule Policy\n\n## 1. Overview\nThis policy outlines procedures for compliance with the Financial Action Task Force (FATF) Travel Rule...",
          tags: ["FATF", "Travel Rule", "VASP", "International"],
          useCount: 87,
          createdBy: "Global Compliance Team"
        },
        {
          id: "tmpl-2",
          name: "Customer Due Diligence Procedure",
          category: "KYC",
          region: "Global",
          description: "Comprehensive procedures for customer onboarding and ongoing due diligence",
          lastUpdated: "2025-02-15",
          status: "approved",
          version: "2.1",
          content: "# Customer Due Diligence Procedure\n\n## 1. Purpose\nThis procedure establishes the requirements for customer identification, verification, and risk assessment...",
          tags: ["KYC", "CDD", "Onboarding", "Risk Assessment"],
          useCount: 132,
          createdBy: "Global Compliance Team"
        },
        {
          id: "tmpl-3",
          name: "EU 6AMLD Compliance Framework",
          category: "AML",
          region: "European Union",
          description: "Framework for compliance with the EU's 6th Anti-Money Laundering Directive",
          lastUpdated: "2025-01-20",
          status: "approved",
          version: "1.3",
          content: "# EU 6AMLD Compliance Framework\n\n## 1. Introduction\nThis framework addresses requirements under the 6th Anti-Money Laundering Directive...",
          tags: ["EU", "6AMLD", "Europe"],
          useCount: 43,
          createdBy: "EU Compliance Team"
        },
        {
          id: "tmpl-4",
          name: "Transaction Monitoring Guidelines",
          category: "Monitoring",
          region: "Global",
          description: "Guidelines for implementing effective transaction monitoring systems",
          lastUpdated: "2025-02-28",
          status: "draft",
          version: "0.9",
          content: "# Transaction Monitoring Guidelines\n\n## 1. Objective\nThese guidelines outline best practices for transaction monitoring to detect suspicious activity...",
          tags: ["Monitoring", "Transactions", "Alerts"],
          useCount: 28,
          createdBy: "Risk Operations"
        },
        {
          id: "tmpl-5",
          name: "Crypto Asset Risk Classification Matrix",
          category: "Risk",
          region: "Global",
          description: "Matrix for classifying crypto assets based on risk factors",
          lastUpdated: "2025-03-10",
          status: "approved",
          version: "1.0",
          content: "# Crypto Asset Risk Classification Matrix\n\n## 1. Approach\nThis document provides a standardized approach to classifying crypto assets by risk level...",
          tags: ["Risk", "Classification", "Assets"],
          useCount: 64,
          createdBy: "Risk Management Team"
        },
        {
          id: "tmpl-6",
          name: "Singapore MAS PS-N02 Compliance",
          category: "Regulation",
          region: "Singapore",
          description: "Compliance framework for MAS Payment Services Notice PSN02",
          lastUpdated: "2025-02-05",
          status: "approved",
          version: "1.1",
          content: "# Singapore MAS PS-N02 Compliance\n\n## 1. Scope\nThis document outlines specific requirements for Digital Payment Token services under MAS Notice PSN02...",
          tags: ["Singapore", "MAS", "PSN02", "DPT"],
          useCount: 12,
          createdBy: "APAC Compliance Team"
        },
        {
          id: "tmpl-7",
          name: "Sanctions Screening Procedures",
          category: "Sanctions",
          region: "Global",
          description: "Procedures for effective sanctions screening and compliance",
          lastUpdated: "2025-02-10",
          status: "approved",
          version: "2.0",
          content: "# Sanctions Screening Procedures\n\n## 1. Purpose\nThis document establishes procedures for screening customers against international and domestic sanctions lists...",
          tags: ["Sanctions", "Screening", "OFAC", "UN"],
          useCount: 98,
          createdBy: "Global Compliance Team"
        },
        {
          id: "tmpl-8",
          name: "Suspicious Activity Report Filing Guide",
          category: "Reporting",
          region: "United States",
          description: "Comprehensive guide for filing SARs with FinCEN",
          lastUpdated: "2025-01-15",
          status: "approved",
          version: "1.4",
          content: "# Suspicious Activity Report Filing Guide\n\n## 1. Reporting Requirements\nThis guide outlines the requirements and procedures for filing Suspicious Activity Reports (SARs) with FinCEN...",
          tags: ["SAR", "FinCEN", "US", "Reporting"],
          useCount: 56,
          createdBy: "US Compliance Team"
        }
      ];
    }
  });

  // Template categories 
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/template-categories"],
    queryFn: async () => {
      // Mock data; will be replaced with actual API call
      return [
        { id: "cat-1", name: "AML", description: "Anti-Money Laundering policies and procedures", templateCount: 24 },
        { id: "cat-2", name: "KYC", description: "Know Your Customer and Customer Due Diligence", templateCount: 18 },
        { id: "cat-3", name: "Monitoring", description: "Transaction and activity monitoring", templateCount: 15 },
        { id: "cat-4", name: "Risk", description: "Risk assessment frameworks and methodologies", templateCount: 12 },
        { id: "cat-5", name: "Sanctions", description: "Sanctions compliance and screening", templateCount: 10 },
        { id: "cat-6", name: "Reporting", description: "Regulatory reporting requirements and procedures", templateCount: 14 },
        { id: "cat-7", name: "Regulation", description: "Specific regulatory frameworks and requirements", templateCount: 22 }
      ];
    }
  });

  // Regions 
  const { data: regions = [] } = useQuery({
    queryKey: ["/api/regions"],
    queryFn: async () => {
      // Mock data; will be replaced with actual API call
      return [
        { id: "reg-1", name: "Global", description: "Global standards applicable worldwide" },
        { id: "reg-2", name: "United States", description: "US-specific regulatory requirements" },
        { id: "reg-3", name: "European Union", description: "EU-wide regulatory requirements" },
        { id: "reg-4", name: "United Kingdom", description: "UK-specific regulatory requirements" },
        { id: "reg-5", name: "Singapore", description: "Singapore-specific regulatory requirements" },
        { id: "reg-6", name: "Hong Kong", description: "Hong Kong-specific regulatory requirements" },
        { id: "reg-7", name: "Switzerland", description: "Switzerland-specific regulatory requirements" }
      ];
    }
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: Partial<Template>) => {
      // This would be an API call in a real app
      console.log("Creating template:", templateData);
      return { id: `tmpl-${Date.now()}`, ...templateData };
    },
    onSuccess: () => {
      toast({
        title: "Template created",
        description: "New template has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Filter templates based on search, category, and region
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    const matchesRegion = !selectedRegion || template.region === selectedRegion;
    
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const handleCreateTemplate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const templateData = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      region: formData.get("region") as string,
      description: formData.get("description") as string,
      content: formData.get("content") as string,
      status: "draft" as const,
      version: "0.1",
      lastUpdated: new Date().toISOString().split('T')[0],
      tags: (formData.get("tags") as string).split(",").map(tag => tag.trim()),
      useCount: 0,
      createdBy: "Current User" // Would come from auth in real app
    };
    
    createTemplateMutation.mutate(templateData);
  };

  // Implementation of template clone functionality
  const handleCloneTemplate = (template: Template) => {
    const clonedTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
      status: "draft" as const,
      version: "0.1",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    createTemplateMutation.mutate(clonedTemplate);
  };

  const statusVariant = {
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    draft: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Global Template Studio</h2>
          <p className="text-muted-foreground mt-1">
            Create, manage, and deploy standardized compliance templates across your organization
          </p>
        </div>
        
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Filter templates by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div 
                className={`p-2 cursor-pointer rounded-md ${!selectedCategory ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => setSelectedCategory(null)}
              >
                <div className="flex justify-between items-center">
                  <span>All Categories</span>
                  <span className="text-sm text-muted-foreground">{templates.length}</span>
                </div>
              </div>
              
              {categories.map(category => (
                <div 
                  key={category.id}
                  className={`p-2 cursor-pointer rounded-md ${selectedCategory === category.name ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <div className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.templateCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regions</CardTitle>
              <CardDescription>Filter templates by region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div 
                className={`p-2 cursor-pointer rounded-md ${!selectedRegion ? 'bg-primary/10' : 'hover:bg-muted'}`}
                onClick={() => setSelectedRegion(null)}
              >
                <div className="flex justify-between items-center">
                  <span>All Regions</span>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              {regions.map(region => (
                <div 
                  key={region.id}
                  className={`p-2 cursor-pointer rounded-md ${selectedRegion === region.name ? 'bg-primary/10' : 'hover:bg-muted'}`}
                  onClick={() => setSelectedRegion(region.name)}
                >
                  <div className="flex justify-between items-center">
                    <span>{region.name}</span>
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">{region.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search templates..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" />
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="mr-2 h-4 w-4" />
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <X className="mr-2 h-4 w-4" />
                      Archived
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Most Used
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Clock className="mr-2 h-4 w-4" />
                      Recently Updated
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map(template => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={statusVariant[template.status]}
                          >
                            {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center mr-4">
                            <Globe className="mr-1 h-4 w-4" />
                            {template.region}
                          </div>
                          <div className="flex items-center mr-4">
                            <Tag className="mr-1 h-4 w-4" />
                            {template.category}
                          </div>
                          <div className="flex items-center mr-4">
                            <Clock className="mr-1 h-4 w-4" />
                            v{template.version}
                          </div>
                          <div className="flex items-center">
                            <FileText className="mr-1 h-4 w-4" />
                            Used {template.useCount} times
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {template.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 w-24 flex flex-col justify-center items-center border-l">
                        <div className="flex flex-col space-y-2 items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => setTemplateToView(template)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => handleCloneTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => setTemplateToEdit(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-8 w-8"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No templates found</h3>
                  <p className="text-muted-foreground mt-2">
                    We couldn't find any templates matching your filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a standardized compliance template that can be used across your organization.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateTemplate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Template Name</Label>
                <Input id="name" name="name" placeholder="Enter template name" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="region">Region</Label>
                  <Select name="region" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {regions.map(region => (
                          <SelectItem key={region.id} value={region.name}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the template and its purpose"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g. KYC, Onboarding, AML"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Template Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter the template content..."
                  className="font-mono h-[300px]"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createTemplateMutation.isPending}>
                {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Template Dialog */}
      {templateToView && (
        <Dialog open={!!templateToView} onOpenChange={() => setTemplateToView(null)}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>{templateToView.name}</DialogTitle>
                <Badge 
                  variant="outline" 
                  className={statusVariant[templateToView.status]}
                >
                  {templateToView.status.charAt(0).toUpperCase() + templateToView.status.slice(1)}
                </Badge>
              </div>
              <DialogDescription>
                {templateToView.description}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="content">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="usage">Usage & History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div className="bg-muted/30 p-6 rounded-md font-mono whitespace-pre-wrap text-sm">
                  {templateToView.content}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleCloneTemplate(templateToView)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Clone
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" onClick={() => {
                    setTemplateToView(null);
                    setTemplateToEdit(templateToView);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="metadata">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Category</h4>
                      <p className="text-sm text-muted-foreground">{templateToView.category}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Region</h4>
                      <p className="text-sm text-muted-foreground">{templateToView.region}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Version</h4>
                      <p className="text-sm text-muted-foreground">{templateToView.version}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Last Updated</h4>
                      <p className="text-sm text-muted-foreground">{templateToView.lastUpdated}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Created By</h4>
                      <p className="text-sm text-muted-foreground">{templateToView.createdBy}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Usage Count</h4>
                      <p className="text-sm text-muted-foreground">{templateToView.useCount}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {templateToView.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="usage">
                <Table>
                  <TableCaption>Recent usage history for this template</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entity</TableHead>
                      <TableHead>Date Used</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Derived Policy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>CryptoX Exchange</TableCell>
                      <TableCell>2025-03-15</TableCell>
                      <TableCell>Sarah Johnson</TableCell>
                      <TableCell>CryptoX {templateToView.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DeFi Protocol Inc.</TableCell>
                      <TableCell>2025-03-12</TableCell>
                      <TableCell>Michael Chen</TableCell>
                      <TableCell>DeFi Protocol {templateToView.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Token Ventures</TableCell>
                      <TableCell>2025-03-08</TableCell>
                      <TableCell>Alex Williams</TableCell>
                      <TableCell>TV Compliance Policy</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setTemplateToView(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Template Dialog */}
      {templateToEdit && (
        <Dialog open={!!templateToEdit} onOpenChange={() => setTemplateToEdit(null)}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Template</DialogTitle>
              <DialogDescription>
                Make changes to the template. You can update content, metadata, and change its status.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // This would be an API call in a real app
              toast({
                title: "Template updated",
                description: "Template has been updated successfully",
              });
              setTemplateToEdit(null);
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Template Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name" 
                    defaultValue={templateToEdit.name} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select name="category" defaultValue={templateToEdit.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-region">Region</Label>
                    <Select name="region" defaultValue={templateToEdit.region}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {regions.map(region => (
                            <SelectItem key={region.id} value={region.name}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={templateToEdit.description}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                  <Input
                    id="edit-tags"
                    name="tags"
                    defaultValue={templateToEdit.tags.join(", ")}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-content">Template Content</Label>
                  <Textarea
                    id="edit-content"
                    name="content"
                    defaultValue={templateToEdit.content}
                    className="font-mono h-[300px]"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select name="status" defaultValue={templateToEdit.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-version">Version</Label>
                    <Input
                      id="edit-version"
                      name="version"
                      defaultValue={templateToEdit.version}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-version-notes">Version Notes</Label>
                    <Input
                      id="edit-version-notes"
                      name="version_notes"
                      placeholder="Brief description of changes in this version"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="destructive" size="sm" className="mr-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Template
                </Button>
                <Button type="button" variant="outline" onClick={() => setTemplateToEdit(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}