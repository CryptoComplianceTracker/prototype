import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { connectWallet } from "@/lib/web3";
import { Wallet, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registrationTypes } from "@/lib/registration-types";
import { useWeb3Wallet } from "@/hooks/use-web3-wallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavBar() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const { address, connect, disconnect } = useWeb3Wallet();

  const handleConnect = async () => {
    try {
      const walletAddress = await connect();
      if (walletAddress) {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      if (address) {
        await disconnect();
      }
      logoutMutation.mutate();
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: error instanceof Error ? error.message : "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 lg:px-8 mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center gap-12 text-sm">
          <Button 
            variant="ghost"
            className="flex items-center space-x-2 p-0"
            onClick={() => window.location.href = '/'}
          >
            <span className="text-2xl font-bold tracking-tight hover:text-primary transition-colors">DARA</span>
          </Button>
          {user && (
            <>
              <Button 
                variant="ghost" 
                className="hover:text-primary transition-colors p-0"
                onClick={() => window.location.href = '/dashboard'}
              >
                Dashboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 flex items-center gap-1">
                    Register
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[300px]">
                  {/* Token Registration as first item */}
                  <DropdownMenuItem 
                    asChild 
                    onClick={() => window.location.href = '/tokens/register'}
                  >
                    <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                      <div className="font-medium group-hover:text-primary">Token Registration</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary/70">Register and classify tokenized assets</span>
                    </div>
                  </DropdownMenuItem>
                  
                  {/* Other registration types */}
                  {registrationTypes.filter(type => type.id !== 'token').map(type => (
                    <DropdownMenuItem 
                      key={type.id} 
                      asChild
                      onClick={() => window.location.href = type.formRoute}
                    >
                      <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                        <div className="font-medium group-hover:text-primary">{type.name}</div>
                        <span className="text-sm text-muted-foreground group-hover:text-primary/70">{type.description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 flex items-center gap-1">
                    Compliance
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[250px]">
                  <DropdownMenuItem 
                    asChild
                    onClick={() => window.location.href = '/compliance-dashboard'}
                  >
                    <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                      <div className="font-medium group-hover:text-primary">Compliance Dashboard</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary/70">Manage all compliance activities</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    asChild
                    onClick={() => window.location.href = '/compliance-reporting'}
                  >
                    <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                      <div className="font-medium group-hover:text-primary">Reporting</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary/70">Compliance report management</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    asChild
                    onClick={() => window.location.href = '/compliance-news'}
                  >
                    <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                      <div className="font-medium group-hover:text-primary">Crypto News</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary/70">Regulatory news updates</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    asChild
                    onClick={() => window.location.href = '/template-studio'}
                  >
                    <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                      <div className="font-medium group-hover:text-primary">Template Studio</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary/70">Policy template library</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-3 flex items-center gap-1">
                    Jurisdictions
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[250px]">
                  <DropdownMenuItem 
                    asChild
                    onClick={() => window.location.href = '/jurisdictions'}
                  >
                    <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                      <div className="font-medium group-hover:text-primary">Browse Jurisdictions</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary/70">View all available jurisdictions</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    asChild
                    onClick={() => window.location.href = '/my-jurisdictions'}
                  >
                    <div className="w-full group transition-all duration-200 ease-in-out hover:translate-x-1 cursor-pointer">
                      <div className="font-medium group-hover:text-primary">My Jurisdictions</div>
                      <span className="text-sm text-muted-foreground group-hover:text-primary/70">Manage your subscribed jurisdictions</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {user?.isAdmin && (
                <Button 
                  variant="ghost" 
                  className="hover:text-primary transition-colors text-primary/70 p-0"
                  onClick={() => window.location.href = '/admin'}
                >
                  Admin
                </Button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                onClick={address ? undefined : handleConnect}
                className="hidden sm:inline-flex"
              >
                <Wallet className="mr-2 h-4 w-4" />
                {address && address.length > 8 ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              onClick={() => window.location.href = '/auth'}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}