import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';
import { useToast } from '@/hooks/use-toast';

export function useWeb3Wallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use this feature",
        variant: "destructive"
      });
      return null;
    }

    try {
      setConnecting(true);
      const provider = new BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(async () => {
    try {
      // Clear the stored address
      setAddress(null);

      // Some wallets (like MetaMask) don't have a native disconnect method
      // We just clear our local state
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  return { address, connecting, connect, disconnect };
}