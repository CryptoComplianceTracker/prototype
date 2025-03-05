import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import type { ExchangeInfo } from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect non-admin users
  if (user && !user.isAdmin) {
    setLocation("/dashboard");
    return null;
  }

  const { data: exchangeRegistrations, isLoading } = useQuery<ExchangeInfo[]>({
    queryKey: ["/api/admin/exchanges"],
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations">Exchange Registrations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations">
          <div className="grid gap-6">
            {exchangeRegistrations?.map((registration) => (
              <Card key={registration.id} className="bg-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      {registration.exchangeName}
                    </CardTitle>
                    <Badge>{registration.exchangeType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">General Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Legal Entity: {registration.legalEntityName}</div>
                          <div>Registration #: {registration.registrationNumber}</div>
                          <div>Location: {registration.headquartersLocation}</div>
                          <div>Website: {registration.websiteUrl}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Compliance Contact</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Name: {registration.complianceContactName}</div>
                          <div>Email: {registration.complianceContactEmail}</div>
                          <div>Phone: {registration.complianceContactPhone}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Risk Management</h3>
                        <div className="flex gap-4">
                          {registration.washTradingDetection?.automatedBotDetection ? (
                            <div className="flex items-center text-green-500">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Bot Detection
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              No Bot Detection
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Custody Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Cold Storage: {registration.custodyArrangements?.coldStoragePercentage}%</div>
                          <div>Hot Wallet: {registration.custodyArrangements?.hotWalletPercentage}%</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>Coming soon...</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}