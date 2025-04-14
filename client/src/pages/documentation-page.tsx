import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, FileDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-2">DARA Platform Documentation</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Comprehensive guide to the DARA Crypto Regulatory Compliance Platform
      </p>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documentation..."
            className="w-full pl-10 py-2 rounded-md border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2">
                <li>
                  <a href="#overview" className="text-primary hover:underline">
                    Platform Overview
                  </a>
                </li>
                <li>
                  <a href="#getting-started" className="text-primary hover:underline">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#components" className="text-primary hover:underline">
                    Components
                  </a>
                </li>
                <li>
                  <a href="#api-reference" className="text-primary hover:underline">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#database-schema" className="text-primary hover:underline">
                    Database Schema
                  </a>
                </li>
                <li>
                  <a href="#web3-integration" className="text-primary hover:underline">
                    Web3 Integration
                  </a>
                </li>
                <li>
                  <a href="#deployment" className="text-primary hover:underline">
                    Deployment Guide
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">API Versions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="justify-center">
                  Current: v1.0.0
                </Badge>
                <Badge variant="outline" className="justify-center text-muted-foreground">
                  Legacy: v0.9.0
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Documentation Content */}
        <div className="md:col-span-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="web3">Web3</TabsTrigger>
            </TabsList>

            {/* Platform Overview */}
            <TabsContent value="overview" className="space-y-8">
              <Card id="overview">
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>
                    Understanding the DARA Crypto Regulatory Compliance Platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Introduction</h3>
                    <p>
                      The DARA Platform is a comprehensive Web3 compliance solution that simplifies 
                      regulatory processes for cryptocurrency ecosystem participants. It provides 
                      intelligent geospatial regulatory tracking and advanced blockchain attestation 
                      services, allowing businesses to navigate the complex regulatory landscape 
                      across multiple jurisdictions.
                    </p>

                    <h3>Key Features</h3>
                    <ul>
                      <li>
                        <strong>Multi-Jurisdiction Support:</strong> Comprehensive regulatory data for 
                        multiple jurisdictions including USA, UAE, Estonia, and Singapore.
                      </li>
                      <li>
                        <strong>Role-Based Access Control:</strong> Secure user management with 
                        differentiated permissions for administrators, compliance officers, and regulators.
                      </li>
                      <li>
                        <strong>Web3 Wallet Authentication:</strong> Seamless integration with 
                        blockchain wallets for secure authentication and identity verification.
                      </li>
                      <li>
                        <strong>Blockchain Attestation:</strong> Integration with Ethereum Attestation 
                        Service (EAS) for immutable compliance records on the Sepolia testnet.
                      </li>
                      <li>
                        <strong>Entity Registration:</strong> Registration workflows for different 
                        crypto businesses including exchanges, stablecoin issuers, and NFT marketplaces.
                      </li>
                      <li>
                        <strong>Regulatory Reporting:</strong> Comprehensive compliance report 
                        management with scheduling and notification capabilities.
                      </li>
                      <li>
                        <strong>Policy Template Studio:</strong> Create, manage and implement compliance 
                        policy templates across the organization.
                      </li>
                    </ul>

                    <h3>System Architecture</h3>
                    <p>
                      DARA Platform is built on a modern tech stack featuring TypeScript, React, 
                      Express.js, and PostgreSQL. The application follows a client-server architecture 
                      with a RESTful API interface and blockchain integration for attestation services.
                    </p>

                    <div className="not-prose">
                      <div className="bg-muted/50 p-4 rounded-md my-4 border">
                        <h4 className="text-sm font-medium mb-2">Technology Stack</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <h5 className="text-xs font-medium">Frontend</h5>
                            <ul className="text-xs space-y-1">
                              <li>TypeScript React</li>
                              <li>TanStack Query</li>
                              <li>Tailwind CSS</li>
                              <li>Shadcn/UI Components</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-xs font-medium">Backend</h5>
                            <ul className="text-xs space-y-1">
                              <li>Express.js</li>
                              <li>PostgreSQL 16.8</li>
                              <li>Drizzle ORM</li>
                              <li>Passport.js</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="getting-started">
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Learn how to use the DARA Platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>User Roles</h3>
                    <p>
                      The platform supports multiple user roles, each with different permissions and
                      access levels:
                    </p>
                    <ul>
                      <li>
                        <strong>Administrators:</strong> Full access to all platform features, user
                        management, and configuration settings.
                      </li>
                      <li>
                        <strong>Compliance Officers:</strong> Access to reporting, entity registration,
                        and monitoring tools without administrative privileges.
                      </li>
                      <li>
                        <strong>Entity Representatives:</strong> Limited access to register their
                        organization, submit reports, and view jurisdiction-specific requirements.
                      </li>
                      <li>
                        <strong>Regulators:</strong> Special access to review submissions, request
                        additional information, and monitor compliance.
                      </li>
                    </ul>

                    <h3>Key Workflows</h3>
                    <ol>
                      <li>
                        <strong>User Registration and Authentication:</strong> Create an account or
                        connect with a Web3 wallet, then authenticate to access the platform.
                      </li>
                      <li>
                        <strong>Entity Registration:</strong> Register your cryptocurrency business
                        with all necessary details through the appropriate registration form.
                      </li>
                      <li>
                        <strong>Jurisdiction Subscription:</strong> Select relevant jurisdictions to
                        monitor for regulatory updates and requirements.
                      </li>
                      <li>
                        <strong>Compliance Reporting:</strong> Create, schedule, and submit compliance
                        reports for your registered entities.
                      </li>
                      <li>
                        <strong>Template Implementation:</strong> Utilize the Template Studio to create
                        and implement compliance policy templates.
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Components Documentation */}
            <TabsContent value="components" className="space-y-8">
              <Card id="components">
                <CardHeader>
                  <CardTitle>Platform Components</CardTitle>
                  <CardDescription>
                    Detailed documentation of the DARA Platform's core components
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="jurisdiction-module">
                      <AccordionTrigger>Jurisdiction Module</AccordionTrigger>
                      <AccordionContent className="prose max-w-none dark:prose-invert">
                        <p>
                          The Jurisdiction Module provides comprehensive regulatory information for
                          multiple countries, allowing users to access detailed requirements and
                          stay updated on regulatory changes.
                        </p>
                        
                        <h4>Key Features</h4>
                        <ul>
                          <li>Jurisdiction database with detailed regulatory information</li>
                          <li>Subscription system for tracking selected jurisdictions</li>
                          <li>Interactive compliance checklists for each jurisdiction</li>
                          <li>Regulatory body information and contact details</li>
                          <li>Key laws and regulations with implementation dates</li>
                        </ul>
                        
                        <h4>Components</h4>
                        <ul>
                          <li><code>JurisdictionCard</code> - Displays summary information for each jurisdiction</li>
                          <li><code>JurisdictionChecklist</code> - Interactive checklist for jurisdiction compliance</li>
                          <li><code>JurisdictionSubscriptionList</code> - Manages user jurisdiction subscriptions</li>
                        </ul>
                        
                        <h4>Supported Jurisdictions</h4>
                        <p>
                          Currently supports United States, United Arab Emirates, Estonia, Singapore
                          and Switzerland, with plans to expand to additional jurisdictions.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="compliance-reporting">
                      <AccordionTrigger>Compliance Reporting Module</AccordionTrigger>
                      <AccordionContent className="prose max-w-none dark:prose-invert">
                        <p>
                          The Compliance Reporting Module enables users to create, manage, and submit
                          regulatory reports across multiple jurisdictions with robust scheduling and
                          notification capabilities.
                        </p>
                        
                        <h4>Key Features</h4>
                        <ul>
                          <li>Comprehensive report type catalog organized by category</li>
                          <li>Report scheduling system with customizable frequencies</li>
                          <li>Status tracking for all compliance reports</li>
                          <li>Calendar view for upcoming reporting deadlines</li>
                          <li>Entity-specific report filtering</li>
                        </ul>
                        
                        <h4>Components</h4>
                        <ul>
                          <li><code>ComplianceReportingModule</code> - Core component for report management</li>
                          <li>Report creation dialog with template support</li>
                          <li>Report scheduler with reminder configurations</li>
                          <li>Report status badges and filtering controls</li>
                        </ul>
                        
                        <h4>Report Statuses</h4>
                        <p>
                          Reports can have various statuses including Draft, In Progress, Submitted,
                          Approved, Rejected, and Needs Review, each with appropriate visual indicators.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="template-studio">
                      <AccordionTrigger>Template Studio</AccordionTrigger>
                      <AccordionContent className="prose max-w-none dark:prose-invert">
                        <p>
                          The Template Studio provides tools for creating, managing and implementing
                          compliance policy templates across the organization.
                        </p>
                        
                        <h4>Key Features</h4>
                        <ul>
                          <li>Template creation with customizable sections</li>
                          <li>Template library for storing and categorizing templates</li>
                          <li>Implementation wizard for applying templates</li>
                          <li>Version control for policy templates</li>
                          <li>Exportable template format</li>
                        </ul>
                        
                        <h4>Components</h4>
                        <ul>
                          <li><code>GlobalTemplateStudio</code> - Main component for template management</li>
                          <li><code>TemplateImplementationWizard</code> - Guides users through implementation</li>
                          <li><code>CreatePolicyDialog</code> - Interface for creating new policy templates</li>
                          <li><code>PolicyDetails</code> - Displays comprehensive policy information</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="entity-registration">
                      <AccordionTrigger>Entity Registration Module</AccordionTrigger>
                      <AccordionContent className="prose max-w-none dark:prose-invert">
                        <p>
                          The Entity Registration Module allows different types of cryptocurrency
                          businesses to register with the platform and provide necessary compliance
                          information.
                        </p>
                        
                        <h4>Key Features</h4>
                        <ul>
                          <li>Multi-entity type support (exchanges, stablecoins, DeFi, NFT, etc.)</li>
                          <li>Comprehensive registration forms with validation</li>
                          <li>Registration status tracking</li>
                          <li>Document upload capabilities</li>
                          <li>Administrative review workflow</li>
                        </ul>
                        
                        <h4>Components</h4>
                        <ul>
                          <li><code>TokenRegistrationForm</code> - Registration form for token issuers</li>
                          <li><code>TokenRegistrationList</code> - Displays list of registered tokens</li>
                          <li><code>TokenRegistrationDetail</code> - Detailed view of token registration</li>
                          <li><code>StablecoinRegistrationForm</code> - Specific form for stablecoin issuers</li>
                        </ul>
                        
                        <h4>Supported Entity Types</h4>
                        <ul>
                          <li>Cryptocurrency Exchanges (CEX/DEX)</li>
                          <li>Stablecoin Issuers</li>
                          <li>DeFi Protocols</li>
                          <li>NFT Marketplaces</li>
                          <li>Crypto Funds</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="web3-integration">
                      <AccordionTrigger>Web3 Integration Module</AccordionTrigger>
                      <AccordionContent className="prose max-w-none dark:prose-invert">
                        <p>
                          The Web3 Integration Module connects the platform to blockchain networks
                          for wallet authentication and attestation services.
                        </p>
                        
                        <h4>Key Features</h4>
                        <ul>
                          <li>Web3 wallet authentication</li>
                          <li>Ethereum Attestation Service (EAS) integration</li>
                          <li>Sepolia testnet support for attestations</li>
                          <li>Blockchain-based verification system</li>
                        </ul>
                        
                        <h4>Components</h4>
                        <ul>
                          <li><code>Web3WalletConnector</code> - Interface for connecting blockchain wallets</li>
                          <li>Attestation creation and verification tools</li>
                          <li>Transaction signing and validation components</li>
                        </ul>
                        
                        <h4>Supported Wallets</h4>
                        <p>
                          Compatible with MetaMask, WalletConnect, and other Ethereum-compatible
                          wallet providers.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="regulatory-map">
                      <AccordionTrigger>Regulatory Map Component</AccordionTrigger>
                      <AccordionContent className="prose max-w-none dark:prose-invert">
                        <p>
                          The Regulatory Map provides a visual representation of global regulatory
                          frameworks and compliance requirements.
                        </p>
                        
                        <h4>Key Features</h4>
                        <ul>
                          <li>Interactive world map with jurisdiction data</li>
                          <li>Color-coded regulatory stance indicators</li>
                          <li>Clickable regions for detailed information</li>
                          <li>Filtering by regulatory category</li>
                        </ul>
                        
                        <h4>Components</h4>
                        <ul>
                          <li><code>RegulatoryMap</code> - Interactive geospatial visualization</li>
                          <li>Map controls and legend components</li>
                          <li>Jurisdiction information popups</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Documentation */}
            <TabsContent value="api" className="space-y-8">
              <Card id="api-reference">
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>
                    Complete documentation of the DARA Platform's REST API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Authentication API</h3>
                    <p>
                      Endpoints for user authentication, registration, and session management.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <code>/api/register</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/register")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Register a new user account
                          </p>
                          <div className="bg-muted/50 p-2 rounded-md mt-2">
                            <h4 className="text-xs font-bold mb-1">Request Body:</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {`{
  "username": "string",
  "password": "string",
  "email": "string",
  "name": "string",
  "role": "string" // Optional
}`}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <code>/api/login</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/login")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Authenticate and start a user session
                          </p>
                          <div className="bg-muted/50 p-2 rounded-md mt-2">
                            <h4 className="text-xs font-bold mb-1">Request Body:</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {`{
  "username": "string",
  "password": "string"
}`}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <code>/api/logout</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/logout")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            End the current user session
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/user</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/user")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get the current authenticated user's information
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-6">Jurisdiction API</h3>
                    <p>
                      Endpoints for accessing jurisdiction data and managing subscriptions.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/jurisdictions</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/jurisdictions")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get list of all available jurisdictions
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/jurisdictions/:id</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/jurisdictions/:id")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get detailed information for a specific jurisdiction
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/jurisdiction-subscriptions</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/jurisdiction-subscriptions")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get all jurisdiction subscriptions for the current user
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <code>/api/jurisdiction-subscriptions</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/jurisdiction-subscriptions")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Subscribe to a jurisdiction
                          </p>
                          <div className="bg-muted/50 p-2 rounded-md mt-2">
                            <h4 className="text-xs font-bold mb-1">Request Body:</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {`{
  "jurisdiction_id": "number",
  "alerts_enabled": "boolean"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-6">Compliance Reporting API</h3>
                    <p>
                      Endpoints for managing compliance reports and schedules.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/compliance/report-types</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/compliance/report-types")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get list of all available report types
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/compliance/reports</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/compliance/reports")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get all compliance reports for the current user
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <code>/api/compliance/reports</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/compliance/reports")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Create a new compliance report
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-600">PATCH</Badge>
                            <code>/api/compliance/reports/:id</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/compliance/reports/:id")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Update an existing compliance report
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-6">Token Registration API</h3>
                    <p>
                      Endpoints for managing token registrations.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/tokens</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/tokens")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get list of all registered tokens
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <code>/api/tokens</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/tokens")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Register a new token
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/tokens/:id</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/tokens/:id")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get detailed information for a specific token
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-6">Template Studio API</h3>
                    <p>
                      Endpoints for managing compliance templates.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/templates</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/templates")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get list of all compliance templates
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">POST</Badge>
                            <code>/api/templates</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/templates")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Create a new compliance template
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/templates/:id</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/templates/:id")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get detailed information for a specific template
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-6">News API</h3>
                    <p>
                      Endpoints for accessing regulatory news.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/news</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/news")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get latest regulatory news
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">GET</Badge>
                            <code>/api/news/:jurisdiction</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1"
                              onClick={() =>
                                navigator.clipboard.writeText("/api/news/:jurisdiction")
                              }
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm mt-1">
                            Get jurisdiction-specific regulatory news
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Schema */}
            <TabsContent value="schema" className="space-y-8">
              <Card id="database-schema">
                <CardHeader>
                  <CardTitle>Database Schema</CardTitle>
                  <CardDescription>
                    Detailed database schema documentation for the DARA Platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Core Tables</h3>
                    <p>
                      The primary database tables that form the foundation of the DARA Platform.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium">users</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores user account information and authentication details.
                          </p>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <table className="min-w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left p-2 font-medium">Column</th>
                                  <th className="text-left p-2 font-medium">Type</th>
                                  <th className="text-left p-2 font-medium">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                <tr>
                                  <td className="p-2 font-mono text-xs">id</td>
                                  <td className="p-2">serial</td>
                                  <td className="p-2">Primary key</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">username</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Unique username</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">password</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Hashed password</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">email</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">User's email address</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">name</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">User's full name</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">role</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">User role (admin, compliance_officer, etc.)</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">wallet_address</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Blockchain wallet address</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">created_at</td>
                                  <td className="p-2">timestamp</td>
                                  <td className="p-2">Account creation timestamp</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium">jurisdictions</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores information about regulatory jurisdictions.
                          </p>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <table className="min-w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left p-2 font-medium">Column</th>
                                  <th className="text-left p-2 font-medium">Type</th>
                                  <th className="text-left p-2 font-medium">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                <tr>
                                  <td className="p-2 font-mono text-xs">id</td>
                                  <td className="p-2">serial</td>
                                  <td className="p-2">Primary key</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">name</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Jurisdiction name</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">region</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Geographic region</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">iso_code</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">ISO country code</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">regulatory_approach</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Overall regulatory stance</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">regulatory_details</td>
                                  <td className="p-2">jsonb</td>
                                  <td className="p-2">Detailed regulatory information</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">last_updated</td>
                                  <td className="p-2">timestamp</td>
                                  <td className="p-2">Last update timestamp</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-6">Compliance Tables</h3>
                    <p>
                      Tables related to compliance reporting and monitoring.
                    </p>

                    <div className="not-prose">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium">compliance_report_types</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores information about different types of compliance reports.
                          </p>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <table className="min-w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left p-2 font-medium">Column</th>
                                  <th className="text-left p-2 font-medium">Type</th>
                                  <th className="text-left p-2 font-medium">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                <tr>
                                  <td className="p-2 font-mono text-xs">id</td>
                                  <td className="p-2">serial</td>
                                  <td className="p-2">Primary key</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">name</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Report type name</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">description</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Detailed description</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">category</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Report category</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">frequency</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Reporting frequency</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">applies_to</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Entity types this applies to</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">template_available</td>
                                  <td className="p-2">boolean</td>
                                  <td className="p-2">Whether a template is available</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">documentation_url</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Link to documentation</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-medium">compliance_reports</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stores actual compliance reports submitted by users.
                          </p>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <table className="min-w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="text-left p-2 font-medium">Column</th>
                                  <th className="text-left p-2 font-medium">Type</th>
                                  <th className="text-left p-2 font-medium">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                <tr>
                                  <td className="p-2 font-mono text-xs">id</td>
                                  <td className="p-2">serial</td>
                                  <td className="p-2">Primary key</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">user_id</td>
                                  <td className="p-2">integer</td>
                                  <td className="p-2">User who created the report</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">report_type_id</td>
                                  <td className="p-2">integer</td>
                                  <td className="p-2">Reference to report type</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">entity_type</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Type of entity this report is for</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">entity_id</td>
                                  <td className="p-2">integer</td>
                                  <td className="p-2">ID of the entity</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">jurisdiction_id</td>
                                  <td className="p-2">integer</td>
                                  <td className="p-2">Related jurisdiction</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">status</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Report status</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">due_date</td>
                                  <td className="p-2">timestamp</td>
                                  <td className="p-2">When report is due</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">submission_date</td>
                                  <td className="p-2">timestamp</td>
                                  <td className="p-2">When report was submitted</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">report_data</td>
                                  <td className="p-2">jsonb</td>
                                  <td className="p-2">Actual report content</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono text-xs">reviewer_notes</td>
                                  <td className="p-2">text</td>
                                  <td className="p-2">Notes from reviewer</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Web3 Integration */}
            <TabsContent value="web3" className="space-y-8">
              <Card id="web3-integration">
                <CardHeader>
                  <CardTitle>Web3 Integration</CardTitle>
                  <CardDescription>
                    Documentation for blockchain integration with DARA Platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Ethereum Attestation Service (EAS)</h3>
                    <p>
                      The DARA Platform integrates with the Ethereum Attestation Service (EAS)
                      to create immutable records of compliance attestations on the blockchain.
                    </p>

                    <div className="not-prose mb-6">
                      <div className="bg-muted/50 p-4 rounded-md border">
                        <h4 className="text-sm font-medium mb-2">EAS Configuration</h4>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                          {`// EAS Contract Configuration
const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia Testnet
const SCHEMA_UID = "0x5ac1bf0bd3d9579fb37231bdafcf4e51b34a1adfed8fa710e1c421fb0d3fe554";

// Sample Attestation
const attestation = {
  recipient: entityWalletAddress,  // Address of entity being attested
  expirationTime: 0,               // No expiration
  revocable: true,                 // Can be revoked if needed
  data: ethers.utils.defaultAbiCoder.encode(
    ["string", "string", "uint256", "string"], 
    [
      "DARA Compliance Verification",
      entityName,
      Date.now(),
      JSON.stringify(complianceData)
    ]
  )
};`}
                        </pre>
                        <div className="flex justify-end mt-2">
                          <a
                            href="https://docs.attest.sh/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center text-primary"
                          >
                            EAS Documentation
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <h3>Web3 Wallet Connection</h3>
                    <p>
                      Users can connect their Ethereum wallets for authentication and to sign
                      transactions for creating attestations. The platform supports MetaMask,
                      WalletConnect, and other Ethereum-compatible wallet providers.
                    </p>

                    <div className="not-prose mb-6">
                      <div className="bg-muted/50 p-4 rounded-md border">
                        <h4 className="text-sm font-medium mb-2">Wallet Connection Code</h4>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                          {`// Connect wallet using ethers.js
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      
      // Get provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = accounts[0];
      
      // Get the chain ID
      const { chainId } = await provider.getNetwork();
      
      // Check if we're on the Sepolia testnet (chainId 11155111)
      if (chainId !== 11155111) {
        try {
          // Request network switch to Sepolia
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }] // 11155111 in hex
          });
        } catch (switchError) {
          // If the network is not available, show an error
          throw new Error("Please switch to the Sepolia testnet to use this feature");
        }
      }
      
      return { provider, signer, address };
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("Please install MetaMask or another Ethereum wallet provider");
  }
};`}
                        </pre>
                      </div>
                    </div>

                    <h3>Creating Attestations</h3>
                    <p>
                      Attestations are created when entities complete compliance requirements
                      or submit reports. These attestations provide an immutable record of
                      compliance activities that can be verified by regulators or partners.
                    </p>

                    <div className="not-prose">
                      <div className="bg-muted/50 p-4 rounded-md border">
                        <h4 className="text-sm font-medium mb-2">Creating an Attestation</h4>
                        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                          {`// Create attestation function
export const createAttestation = async (
  signer,
  entityAddress,
  entityName,
  complianceData
) => {
  try {
    // Initialize EAS SDK
    const eas = new EAS(EAS_CONTRACT_ADDRESS);
    eas.connect(signer);
    
    // Prepare attestation data
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["string", "string", "uint256", "string"],
      [
        "DARA Compliance Verification",
        entityName,
        Date.now(),
        JSON.stringify(complianceData)
      ]
    );
    
    // Create the attestation
    const tx = await eas.attest({
      schema: SCHEMA_UID,
      data: {
        recipient: entityAddress,
        expirationTime: 0,
        revocable: true,
        data: encodedData
      }
    });
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // Return the attestation UID
    return receipt.uid;
  } catch (error) {
    console.error("Error creating attestation:", error);
    throw error;
  }
};`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="deployment">
                <CardHeader>
                  <CardTitle>Deployment Guide</CardTitle>
                  <CardDescription>
                    Instructions for deploying the DARA Platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>Deployment Options</h3>
                    <p>
                      The DARA Platform can be deployed in various environments, with Replit
                      being the primary development and demonstration platform.
                    </p>

                    <h4>Replit Deployment</h4>
                    <p>
                      To deploy the application on Replit, use the built-in Deployment feature
                      or the custom deployment scripts provided.
                    </p>

                    <div className="not-prose mb-6">
                      <div className="bg-muted/50 p-4 rounded-md border">
                        <h4 className="text-sm font-medium mb-2">Deployment Scripts</h4>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <code className="text-xs bg-muted p-1 rounded mr-2">deploy.js</code>
                            <span>Standard deployment script that builds the client and server</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-xs bg-muted p-1 rounded mr-2">deploy-client.js</code>
                            <span>Deploys only the client application</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-xs bg-muted p-1 rounded mr-2">replit-deploy.js</code>
                            <span>Specialized script for Replit deployment</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-xs bg-muted p-1 rounded mr-2">production-server.js</code>
                            <span>Production server setup with optimizations</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <h4>Environment Variables</h4>
                    <p>
                      The following environment variables are required for the application to function properly:
                    </p>

                    <div className="not-prose">
                      <div className="bg-muted/50 p-4 rounded-md border">
                        <h4 className="text-sm font-medium mb-2">Required Environment Variables</h4>
                        <table className="min-w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-2 font-medium">Variable</th>
                              <th className="text-left p-2 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr>
                              <td className="p-2 font-mono text-xs">DATABASE_URL</td>
                              <td className="p-2">PostgreSQL connection string</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-mono text-xs">SESSION_SECRET</td>
                              <td className="p-2">Secret for session encryption</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-mono text-xs">VITE_NEWS_API_KEY</td>
                              <td className="p-2">API key for news service</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}