import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { connectWallet } from "@/lib/web3";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NavBar() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="font-bold">CryptoCompliance</span>
            </a>
          </Link>
          {user && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/exchange/register">Register Exchange</Link>
              <Link href="/transactions">Transactions</Link>
              <Link href="/compliance">Compliance</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                onClick={handleConnectWallet}
                className="hidden sm:inline-flex"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
              <Button
                variant="ghost"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}