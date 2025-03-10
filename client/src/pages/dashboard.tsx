import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskChart } from "@/components/risk-chart";
import { TransactionTable } from "@/components/transaction-table";
import { AlertCircle, ArrowUpRight, Wallet, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { verifyAttestation } from "@/lib/attestation-service";
import { useWeb3Wallet } from "@/hooks/use-web3-wallet";

const registrationTypes = [
  { id: 'exchange', name: 'Exchange Registration' },
  { id: 'stablecoin', name: 'Stablecoin Registration' },
  { id: 'defi', name: 'DeFi Protocol Registration' },
  { id: 'nft', name: 'NFT Marketplace Registration' },
  { id: 'fund', name: 'Crypto Fund Registration' }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { address } = useWeb3Wallet();

  // Fetch user's registrations
  const { data: registrations = [], isLoading: registrationsLoading } = useQuery({
    queryKey: ['/api/user/registrations'],
    enabled: !!user,
  });

  // Calculate completion percentage
  const completedRegistrations = registrations.length;
  const totalRegistrations = registrationTypes.length;
  const completionPercentage = (completedRegistrations / totalRegistrations) * 100;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">complete</div>
            </div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Status</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {address ? (
                <span className="text-green-500">Connected</span>
              ) : (
                <span className="text-yellow-500">Not Connected</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect wallet for attestations'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attestations</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              Active on-chain records
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Registration Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrationTypes.map((type) => {
                const isComplete = registrations.some(r => r.type === type.id);
                return (
                  <div key={type.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isComplete ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      )}
                      <span>{type.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isComplete ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable />
        </CardContent>
      </Card>
    </div>
  );
}