// Shared configuration for registration types and routes
export const registrationTypes = [
  { 
    id: 'exchange',
    name: 'Exchange Registration',
    formRoute: '/exchange-registration',
    description: 'Register and manage cryptocurrency exchange compliance'
  },
  { 
    id: 'stablecoin',
    name: 'Stablecoin Registration',
    formRoute: '/stablecoin-registration',
    description: 'Register stablecoin issuance and management'
  },
  { 
    id: 'defi',
    name: 'DeFi Protocol Registration',
    formRoute: '/defi-registration',
    description: 'Register decentralized finance protocols'
  },
  { 
    id: 'nft',
    name: 'NFT Marketplace Registration',
    formRoute: '/nft-registration',
    description: 'Register NFT marketplace operations'
  },
  { 
    id: 'fund',
    name: 'Crypto Fund Registration',
    formRoute: '/fund-registration',
    description: 'Register cryptocurrency investment funds'
  },
  { 
    id: 'token',
    name: 'Token Registration',
    formRoute: '/tokens/register',
    description: 'Register and classify tokenized assets'
  }
];

export const getViewRoute = (type: string, id: number) => `/${type}-view/${id}`;
