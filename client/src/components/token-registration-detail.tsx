import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { TokenRegistration, TokenRegistrationDocument, TokenRegistrationVerification, TokenRiskAssessment, TokenJurisdictionApproval } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, ChevronLeftIcon, FileTextIcon, Loader2, InfoIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, UploadIcon, LinkIcon, GlobeIcon, ShieldAlertIcon, UserIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RISK_LEVELS, DOCUMENT_TYPES, VERIFICATION_STATUS_OPTIONS } from "@/lib/token-types";

export default function TokenRegistrationDetail() {
  const { id } = useParams<{ id: string }>();
  const tokenId = parseInt(id);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  
  // File upload state
  const [fileName, setFileName] = useState("");
  const [fileUploadError, setFileUploadError] = useState("");
  
  // For admin actions
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [riskAssessmentDialogOpen, setRiskAssessmentDialogOpen] = useState(false);
  const [jurisdictionApprovalDialogOpen, setJurisdictionApprovalDialogOpen] = useState(false);
  
  // Form data for admin actions
  const [verificationData, setVerificationData] = useState({
    verificationType: "LEGAL",
    verificationStatus: "PENDING",
    verificationDetails: "",
    expiryDate: null as Date | null
  });
  
  const [riskAssessmentData, setRiskAssessmentData] = useState({
    riskCategory: "REGULATORY",
    riskLevel: "Medium",
    riskDetails: "",
    mitigationMeasures: ""
  });
  
  const [jurisdictionApprovalData, setJurisdictionApprovalData] = useState({
    jurisdictionId: 0,
    approvalStatus: "PENDING",
    approvalDetails: "",
    restrictionDetails: "",
    expiryDate: null as Date | null
  });

  // Fetch token data
  const { data: token, isLoading, error } = useQuery<TokenRegistration>({
    queryKey: [`/api/tokens/${tokenId}`],
    enabled: !!tokenId && !!user
  });

  // Fetch documents
  const { data: documents = [] } = useQuery<TokenRegistrationDocument[]>({
    queryKey: [`/api/tokens/${tokenId}/documents`],
    enabled: !!tokenId && !!user
  });

  // Fetch verifications
  const { data: verifications = [] } = useQuery<TokenRegistrationVerification[]>({
    queryKey: [`/api/tokens/${tokenId}/verifications`],
    enabled: !!tokenId && !!user
  });

  // Fetch risk assessments
  const { data: riskAssessments = [] } = useQuery<TokenRiskAssessment[]>({
    queryKey: [`/api/tokens/${tokenId}/risk-assessments`],
    enabled: !!tokenId && !!user
  });

  // Fetch jurisdiction approvals
  const { data: jurisdictionApprovals = [] } = useQuery<TokenJurisdictionApproval[]>({
    queryKey: [`/api/tokens/${tokenId}/jurisdiction-approvals`],
    enabled: !!tokenId && !!user
  });

  // Mutations
  const addDocumentMutation = useMutation({
    mutationFn: async (documentData: Partial<TokenRegistrationDocument>) => {
      const response = await apiRequest("POST", `/api/tokens/${tokenId}/documents`, documentData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Added",
        description: "The document has been successfully added to the token registration",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tokens/${tokenId}/documents`] });
      setFileName("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error Adding Document",
        description: error.message || "There was an error adding the document",
        variant: "destructive",
      });
    },
  });

  const addVerificationMutation = useMutation({
    mutationFn: async (verificationData: any) => {
      const response = await apiRequest("POST", `/api/tokens/${tokenId}/verifications`, verificationData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification Added",
        description: "The verification has been successfully added to the token registration",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tokens/${tokenId}/verifications`] });
      setVerificationDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error Adding Verification",
        description: error.message || "There was an error adding the verification",
        variant: "destructive",
      });
    },
  });

  const addRiskAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      const response = await apiRequest("POST", `/api/tokens/${tokenId}/risk-assessments`, assessmentData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Risk Assessment Added",
        description: "The risk assessment has been successfully added to the token registration",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tokens/${tokenId}/risk-assessments`] });
      setRiskAssessmentDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error Adding Risk Assessment",
        description: error.message || "There was an error adding the risk assessment",
        variant: "destructive",
      });
    },
  });

  const addJurisdictionApprovalMutation = useMutation({
    mutationFn: async (approvalData: any) => {
      const response = await apiRequest("POST", `/api/tokens/${tokenId}/jurisdiction-approvals`, approvalData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Jurisdiction Approval Added",
        description: "The jurisdiction approval has been successfully added to the token registration",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/tokens/${tokenId}/jurisdiction-approvals`] });
      setJurisdictionApprovalDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error Adding Jurisdiction Approval",
        description: error.message || "There was an error adding the jurisdiction approval",
        variant: "destructive",
      });
    },
  });

  // Handle document upload
  const handleDocumentSubmit = (documentType: string, documentTitle: string, documentUrl: string) => {
    const documentData = {
      documentType,
      documentTitle,
      documentUrl,
      documentDate: new Date().toISOString()
    };
    addDocumentMutation.mutateAsync(documentData);
  };

  // Handle verification submission
  const handleVerificationSubmit = () => {
    addVerificationMutation.mutateAsync(verificationData);
  };

  // Handle risk assessment submission
  const handleRiskAssessmentSubmit = () => {
    addRiskAssessmentMutation.mutateAsync(riskAssessmentData);
  };

  // Handle jurisdiction approval submission
  const handleJurisdictionApprovalSubmit = () => {
    addJurisdictionApprovalMutation.mutateAsync(jurisdictionApprovalData);
  };

  const goBack = () => {
    navigate("/tokens");
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "High":
        return "bg-orange-500";
      case "Critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "REJECTED":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "PENDING":
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  // Renders

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading token details...</span>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="w-full text-center py-10">
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error 
              ? error.message 
              : "Failed to load token details. The token may not exist or you may not have permission to view it."}
          </AlertDescription>
        </Alert>
        <Button onClick={goBack} className="mt-4">
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Back to Token List
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={goBack} className="mr-2">
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{token.tokenName} ({token.tokenSymbol})</h1>
            <p className="text-muted-foreground">
              {token.tokenCategory.replace(/_/g, ' ')} • {token.tokenType}
            </p>
          </div>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Badge variant={token.registrationStatus === "approved" ? "success" : 
                          token.registrationStatus === "rejected" ? "destructive" :
                          token.registrationStatus === "pending" ? "warning" : "outline"}>
            {token.registrationStatus.charAt(0).toUpperCase() + token.registrationStatus.slice(1)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">
            <FileTextIcon className="h-4 w-4 mr-2" />
            Documents
            <Badge variant="secondary" className="ml-2">{documents.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="verifications">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Verifications
            <Badge variant="secondary" className="ml-2">{verifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="risk">
            <ShieldAlertIcon className="h-4 w-4 mr-2" />
            Risk Assessment
            <Badge variant="secondary" className="ml-2">{riskAssessments.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="jurisdictions">
            <GlobeIcon className="h-4 w-4 mr-2" />
            Jurisdictions
            <Badge variant="secondary" className="ml-2">{jurisdictionApprovals.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Token Information</CardTitle>
                <CardDescription>Basic details about the token</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-muted-foreground mt-2">{token.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Issuer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label>Issuer Name</Label>
                      <p>{token.issuerName}</p>
                    </div>
                    <div>
                      <Label>Legal Entity</Label>
                      <p>{token.issuerLegalEntity}</p>
                    </div>
                    <div>
                      <Label>Website</Label>
                      <p className="break-all">
                        <a 
                          href={token.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          {token.websiteUrl} <LinkIcon className="h-3 w-3 ml-1" />
                        </a>
                      </p>
                    </div>
                    {token.whitepaperUrl && (
                      <div>
                        <Label>Whitepaper</Label>
                        <p className="break-all">
                          <a 
                            href={token.whitepaperUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            View Whitepaper <LinkIcon className="h-3 w-3 ml-1" />
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Technical Details</h3>
                  <div className="space-y-4 mt-2">
                    <div>
                      <Label>Blockchain Networks</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {token.blockchainNetworks?.map((network, index) => (
                          <Badge key={index} variant="outline">
                            {network.name} (Chain ID: {network.chainId})
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Contract Addresses</Label>
                      <div className="space-y-2 mt-1">
                        {token.contractAddresses?.map((contract, index) => (
                          <div key={index} className="font-mono text-sm bg-muted p-2 rounded">
                            <span className="text-muted-foreground mr-2">{contract.network}:</span>
                            {contract.address}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {token.tokenStandard && (
                      <div>
                        <Label>Token Standard</Label>
                        <p>{token.tokenStandard}</p>
                      </div>
                    )}
                    
                    {token.totalSupply && (
                      <div>
                        <Label>Total Supply</Label>
                        <p>{token.totalSupply}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Info */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Information</CardTitle>
                <CardDescription>Regulatory and compliance details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Regulatory Status</Label>
                  <p>{token.regulatoryStatus || "Not specified"}</p>
                </div>
                
                <div>
                  <Label>KYC Requirements</Label>
                  <p className="text-sm text-muted-foreground">
                    {token.kycRequirements || "Not specified"}
                  </p>
                </div>
                
                <div>
                  <Label>Transfer Restrictions</Label>
                  <p className="text-sm text-muted-foreground">
                    {token.transferRestrictions || "None specified"}
                  </p>
                </div>
                
                <div>
                  <Label>Whitelist Status</Label>
                  <Badge variant={token.whitelistStatus ? "default" : "outline"}>
                    {token.whitelistStatus ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                {token.amlPolicyUrl && (
                  <div>
                    <Label>AML Policy</Label>
                    <p className="break-all">
                      <a 
                        href={token.amlPolicyUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        View AML Policy <LinkIcon className="h-3 w-3 ml-1" />
                      </a>
                    </p>
                  </div>
                )}
                
                {token.lastAuditDate && (
                  <div>
                    <Label>Last Security Audit</Label>
                    <p>{format(new Date(token.lastAuditDate), 'PPP')}</p>
                  </div>
                )}
                
                <div>
                  <Label>Registration Date</Label>
                  <p>{format(new Date(token.createdAt), 'PPP')}</p>
                </div>
                
                {token.updatedAt && token.updatedAt !== token.createdAt && (
                  <div>
                    <Label>Last Updated</Label>
                    <p>{format(new Date(token.updatedAt), 'PPP')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {token.complianceContacts && token.complianceContacts.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Compliance Contacts</CardTitle>
                <CardDescription>
                  Designated points of contact for compliance-related matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {token.complianceContacts.map((contact, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          <UserIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.role}</p>
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="text-primary text-sm hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="space-y-6">
            {isAdmin || (token.userId === user?.id) && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Document</CardTitle>
                  <CardDescription>Upload documentation related to this token</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documentType">Document Type</Label>
                      <Select onValueChange={(value) => setFileName(prev => ({...prev, type: value}))}>
                        <SelectTrigger id="documentType">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_TYPES.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="documentTitle">Document Title</Label>
                      <Input 
                        id="documentTitle"
                        placeholder="Enter document title"
                        onChange={(e) => setFileName(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="documentUrl">Document URL</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="documentUrl"
                          placeholder="https://example.com/document"
                          onChange={(e) => setFileName(e.target.value)}
                        />
                        <Button 
                          type="button"
                          onClick={() => {
                            // In a real implementation, we would handle the file upload flow
                            // For this example, we'll just use the URL
                            const documentTitle = document.getElementById('documentTitle') as HTMLInputElement;
                            const documentUrl = document.getElementById('documentUrl') as HTMLInputElement;
                            const select = document.getElementById('documentType') as HTMLSelectElement;
                            
                            handleDocumentSubmit(
                              (select as any).value, 
                              documentTitle.value,
                              documentUrl.value
                            );
                          }}
                        >
                          Add Document
                        </Button>
                      </div>
                      {fileUploadError && (
                        <p className="text-destructive text-sm mt-1">{fileUploadError}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4">Document List</h2>
              {documents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No documents have been added yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <Card key={doc.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 rounded-md bg-primary/10">
                              <FileTextIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{doc.documentTitle}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doc.documentType} • {format(new Date(doc.documentDate), 'PPP')}
                              </p>
                              <a 
                                href={doc.documentUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary text-sm hover:underline flex items-center mt-1"
                              >
                                View Document <LinkIcon className="h-3 w-3 ml-1" />
                              </a>
                            </div>
                          </div>
                          
                          <div className="mt-2 md:mt-0">
                            <Badge variant="outline">{doc.documentType}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Verifications Tab */}
        <TabsContent value="verifications">
          <div className="space-y-6">
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Verification</CardTitle>
                  <CardDescription>Record verification status for this token</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="verificationType">Verification Type</Label>
                      <Select 
                        onValueChange={(value) => 
                          setVerificationData({...verificationData, verificationType: value})
                        }
                        value={verificationData.verificationType}
                      >
                        <SelectTrigger id="verificationType">
                          <SelectValue placeholder="Select verification type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LEGAL">Legal</SelectItem>
                          <SelectItem value="TECHNICAL">Technical</SelectItem>
                          <SelectItem value="FINANCIAL">Financial</SelectItem>
                          <SelectItem value="IDENTITY">Identity</SelectItem>
                          <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="verificationStatus">Status</Label>
                      <Select 
                        onValueChange={(value) => 
                          setVerificationData({...verificationData, verificationStatus: value})
                        }
                        value={verificationData.verificationStatus}
                      >
                        <SelectTrigger id="verificationStatus">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {VERIFICATION_STATUS_OPTIONS.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="verificationDetails">Details</Label>
                      <Textarea 
                        id="verificationDetails"
                        placeholder="Enter verification details"
                        onChange={(e) => 
                          setVerificationData({...verificationData, verificationDetails: e.target.value})
                        }
                        value={verificationData.verificationDetails}
                      />
                    </div>
                    <div>
                      <Label>Expiry Date (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !verificationData.expiryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {verificationData.expiryDate ? (
                              format(verificationData.expiryDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={verificationData.expiryDate || undefined}
                            onSelect={(date) => 
                              setVerificationData({...verificationData, expiryDate: date})
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-end md:justify-end">
                      <Button 
                        onClick={handleVerificationSubmit}
                        disabled={!verificationData.verificationDetails}
                      >
                        Submit Verification
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4">Verification History</h2>
              {verifications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No verifications have been recorded yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {verifications.map((verification) => (
                    <Card key={verification.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 rounded-md bg-primary/10">
                              {getVerificationStatusIcon(verification.verificationStatus)}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{verification.verificationType} Verification</h3>
                                <Badge 
                                  variant={
                                    verification.verificationStatus === "APPROVED" ? "success" :
                                    verification.verificationStatus === "REJECTED" ? "destructive" : 
                                    "warning"
                                  }
                                  className="ml-2"
                                >
                                  {verification.verificationStatus}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(verification.verificationDate), 'PPP')}
                                {verification.expiryDate && 
                                  ` • Expires: ${format(new Date(verification.expiryDate), 'PPP')}`
                                }
                              </p>
                              <p className="mt-2">{verification.verificationDetails}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Risk Assessment Tab */}
        <TabsContent value="risk">
          <div className="space-y-6">
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Risk Assessment</CardTitle>
                  <CardDescription>Document risk factors for this token</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="riskCategory">Risk Category</Label>
                      <Select 
                        onValueChange={(value) => 
                          setRiskAssessmentData({...riskAssessmentData, riskCategory: value})
                        }
                        value={riskAssessmentData.riskCategory}
                      >
                        <SelectTrigger id="riskCategory">
                          <SelectValue placeholder="Select risk category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REGULATORY">Regulatory</SelectItem>
                          <SelectItem value="TECHNICAL">Technical</SelectItem>
                          <SelectItem value="MARKET">Market</SelectItem>
                          <SelectItem value="OPERATIONAL">Operational</SelectItem>
                          <SelectItem value="LIQUIDITY">Liquidity</SelectItem>
                          <SelectItem value="GOVERNANCE">Governance</SelectItem>
                          <SelectItem value="SECURITY">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Select 
                        onValueChange={(value) => 
                          setRiskAssessmentData({...riskAssessmentData, riskLevel: value})
                        }
                        value={riskAssessmentData.riskLevel}
                      >
                        <SelectTrigger id="riskLevel">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_LEVELS.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="riskDetails">Risk Details</Label>
                      <Textarea 
                        id="riskDetails"
                        placeholder="Describe the risk factors"
                        onChange={(e) => 
                          setRiskAssessmentData({...riskAssessmentData, riskDetails: e.target.value})
                        }
                        value={riskAssessmentData.riskDetails}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="mitigationMeasures">Mitigation Measures</Label>
                      <Textarea 
                        id="mitigationMeasures"
                        placeholder="Describe how these risks can be mitigated"
                        onChange={(e) => 
                          setRiskAssessmentData({...riskAssessmentData, mitigationMeasures: e.target.value})
                        }
                        value={riskAssessmentData.mitigationMeasures}
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button 
                        onClick={handleRiskAssessmentSubmit}
                        disabled={!riskAssessmentData.riskDetails}
                      >
                        Submit Risk Assessment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4">Risk Assessment History</h2>
              {riskAssessments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No risk assessments have been conducted yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {riskAssessments.map((assessment) => (
                    <Card key={assessment.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-md ${getRiskLevelColor(assessment.riskLevel)}`}>
                              <ShieldAlertIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{assessment.riskCategory} Risk</h3>
                                <Badge 
                                  variant={
                                    assessment.riskLevel === "Low" ? "outline" :
                                    assessment.riskLevel === "Medium" ? "secondary" :
                                    assessment.riskLevel === "High" ? "default" : "destructive"
                                  }
                                  className="ml-2"
                                >
                                  {assessment.riskLevel}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Assessed on {format(new Date(assessment.assessmentDate), 'PPP')}
                              </p>
                              <div className="mt-2 space-y-2">
                                <div>
                                  <h4 className="text-sm font-medium">Risk Details:</h4>
                                  <p className="text-sm">{assessment.riskDetails}</p>
                                </div>
                                {assessment.mitigationMeasures && (
                                  <div>
                                    <h4 className="text-sm font-medium">Mitigation Measures:</h4>
                                    <p className="text-sm">{assessment.mitigationMeasures}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Jurisdictions Tab */}
        <TabsContent value="jurisdictions">
          <div className="space-y-6">
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Jurisdiction Approval</CardTitle>
                  <CardDescription>
                    Record jurisdiction-specific approval status for this token
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jurisdictionId">Jurisdiction</Label>
                      <Select 
                        onValueChange={(value) => 
                          setJurisdictionApprovalData({
                            ...jurisdictionApprovalData, 
                            jurisdictionId: parseInt(value)
                          })
                        }
                      >
                        <SelectTrigger id="jurisdictionId">
                          <SelectValue placeholder="Select jurisdiction" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* In a real implementation, we would fetch the list of jurisdictions */}
                          <SelectItem value="1">United States</SelectItem>
                          <SelectItem value="2">European Union</SelectItem>
                          <SelectItem value="3">United Kingdom</SelectItem>
                          <SelectItem value="4">Singapore</SelectItem>
                          <SelectItem value="5">Japan</SelectItem>
                          <SelectItem value="6">Switzerland</SelectItem>
                          <SelectItem value="7">United Arab Emirates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="approvalStatus">Approval Status</Label>
                      <Select 
                        onValueChange={(value) => 
                          setJurisdictionApprovalData({
                            ...jurisdictionApprovalData, 
                            approvalStatus: value
                          })
                        }
                        value={jurisdictionApprovalData.approvalStatus}
                      >
                        <SelectTrigger id="approvalStatus">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="RESTRICTED">Restricted</SelectItem>
                          <SelectItem value="EXEMPTED">Exempted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="approvalDetails">Approval Details</Label>
                      <Textarea 
                        id="approvalDetails"
                        placeholder="Enter approval details"
                        onChange={(e) => 
                          setJurisdictionApprovalData({
                            ...jurisdictionApprovalData, 
                            approvalDetails: e.target.value
                          })
                        }
                        value={jurisdictionApprovalData.approvalDetails}
                      />
                    </div>
                    {jurisdictionApprovalData.approvalStatus === "RESTRICTED" && (
                      <div className="md:col-span-2">
                        <Label htmlFor="restrictionDetails">Restriction Details</Label>
                        <Textarea 
                          id="restrictionDetails"
                          placeholder="Enter details about restrictions"
                          onChange={(e) => 
                            setJurisdictionApprovalData({
                              ...jurisdictionApprovalData, 
                              restrictionDetails: e.target.value
                            })
                          }
                          value={jurisdictionApprovalData.restrictionDetails}
                        />
                      </div>
                    )}
                    <div>
                      <Label>Expiry Date (Optional)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !jurisdictionApprovalData.expiryDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {jurisdictionApprovalData.expiryDate ? (
                              format(jurisdictionApprovalData.expiryDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={jurisdictionApprovalData.expiryDate || undefined}
                            onSelect={(date) => 
                              setJurisdictionApprovalData({
                                ...jurisdictionApprovalData, 
                                expiryDate: date
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-end md:justify-end">
                      <Button 
                        onClick={handleJurisdictionApprovalSubmit}
                        disabled={
                          !jurisdictionApprovalData.jurisdictionId || 
                          !jurisdictionApprovalData.approvalDetails
                        }
                      >
                        Submit Approval
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4">Jurisdiction Approvals</h2>
              {jurisdictionApprovals.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No jurisdiction approvals have been recorded yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {jurisdictionApprovals.map((approval) => (
                    <Card key={approval.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 rounded-md bg-primary/10">
                              <GlobeIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">Jurisdiction ID: {approval.jurisdictionId}</h3>
                                <Badge 
                                  variant={
                                    approval.approvalStatus === "APPROVED" ? "success" :
                                    approval.approvalStatus === "REJECTED" ? "destructive" :
                                    approval.approvalStatus === "RESTRICTED" ? "warning" :
                                    approval.approvalStatus === "EXEMPTED" ? "outline" : "secondary"
                                  }
                                  className="ml-2"
                                >
                                  {approval.approvalStatus}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Approved on: {format(new Date(approval.approvalDate), 'PPP')}
                                {approval.expiryDate && 
                                  ` • Expires: ${format(new Date(approval.expiryDate), 'PPP')}`
                                }
                              </p>
                              <div className="mt-2 space-y-2">
                                <div>
                                  <h4 className="text-sm font-medium">Approval Details:</h4>
                                  <p className="text-sm">{approval.approvalDetails}</p>
                                </div>
                                {approval.restrictionDetails && (
                                  <div>
                                    <h4 className="text-sm font-medium">Restriction Details:</h4>
                                    <p className="text-sm">{approval.restrictionDetails}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}