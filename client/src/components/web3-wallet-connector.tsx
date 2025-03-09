import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ethers } from 'ethers';

interface Web3WalletConnectorProps {
  onConnect: (address: string) => void;
}

export function Web3WalletConnector({ onConnect }: Web3WalletConnectorProps) {
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            onConnect(accounts[0]);
          }
        })
        .catch(console.error);
    }
  }, [onConnect]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    try {
      setConnecting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      onConnect(address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {address ? (
        <div className="text-sm text-muted-foreground">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={connecting}
          size="sm"
          variant="outline"
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}
