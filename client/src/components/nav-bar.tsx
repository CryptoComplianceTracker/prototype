import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { connectWallet } from "@/lib/web3";
import { Wallet, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              <span className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">DARA</span>
            </a>
          </Link>
          {user && (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-4 flex items-center gap-2">
                    Register
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px]">
                  <DropdownMenuItem asChild>
                    <Link href="/exchange/register">
                      <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1">
                        <div className="font-medium group-hover:text-primary">Crypto Exchange Registration</div>
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70">CEX & DEX platforms</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/stablecoin/register">
                      <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1">
                        <div className="font-medium group-hover:text-primary">Stablecoin Issuer Disclosure</div>
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70">For stablecoin providers</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/defi/register">
                      <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1">
                        <div className="font-medium group-hover:text-primary">DeFi Protocol Registration</div>
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70">Decentralized finance protocols</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/nft/register">
                      <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1">
                        <div className="font-medium group-hover:text-primary">NFT Marketplace Registration</div>
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70">Digital collectibles platforms</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/fund/register">
                      <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1">
                        <div className="font-medium group-hover:text-primary">Crypto Fund Registration</div>
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70">Institutional investors & funds</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/kyc/register">
                      <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1">
                        <div className="font-medium group-hover:text-primary">AML/KYC Reporting</div>
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70">Compliance reporting forms</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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