import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ConnectWallet } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export function NavBar() {
  const { user, logoutMutation } = useAuth();
  
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
              <Link href="/transactions">Transactions</Link>
              <Link href="/compliance">Compliance</Link>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
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
