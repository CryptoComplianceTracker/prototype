import { 
  ExchangeInfo, 
  StablecoinInfo, 
  DefiProtocolInfo,
  NftMarketplaceInfo,
  CryptoFundInfo 
} from "@shared/schema";

type EntityType = 
  | ExchangeInfo 
  | StablecoinInfo 
  | DefiProtocolInfo 
  | NftMarketplaceInfo 
  | CryptoFundInfo;

export function exportToCSV(entities: EntityType[], filename: string = 'registrations.csv') {
  // Determine entity type and choose appropriate export function
  if (entities.length === 0) return;
  
  const firstEntity = entities[0];
  
  if ('exchangeName' in firstEntity) {
    exportExchangesToCSV(entities as ExchangeInfo[], filename);
  } else if ('stablecoinName' in firstEntity) {
    exportStablecoinToCSV(entities as StablecoinInfo[], filename);
  } else if ('protocolName' in firstEntity) {
    exportDefiProtocolToCSV(entities as DefiProtocolInfo[], filename);
  } else if ('marketplaceName' in firstEntity) {
    exportNftMarketplaceToCSV(entities as NftMarketplaceInfo[], filename);
  } else if ('fundName' in firstEntity) {
    exportCryptoFundToCSV(entities as CryptoFundInfo[], filename);
  }
}

function exportExchangesToCSV(exchanges: ExchangeInfo[], filename: string) {
  // Define CSV headers
  const headers = [
    'Exchange Name',
    'Type',
    'Legal Entity',
    'Registration Number',
    'Location',
    'Website',
    'Year Established',
    'KYC Verified Users',
    'Cold Storage %',
    'Risk Level'
  ].join(',');

  // Transform data to CSV rows
  const rows = exchanges.map(exchange => {
    const kycMetrics = exchange.kycVerificationMetrics as any || {};
    const custody = exchange.custodyArrangements as any || {};
    
    return [
      exchange.exchangeName,
      exchange.exchangeType,
      exchange.legalEntityName,
      exchange.registrationNumber,
      exchange.headquartersLocation,
      exchange.websiteUrl,
      exchange.yearEstablished,
      kycMetrics.verifiedUsers || 0,
      custody.coldStoragePercentage || 0,
      calculateRiskLevel(exchange)
    ].map(field => `"${field}"`).join(',');
  });

  // Generate and download CSV
  downloadCSV(headers, rows, filename);
}

function exportStablecoinToCSV(stablecoins: StablecoinInfo[], filename: string) {
  // Define CSV headers
  const headers = [
    'Stablecoin Name',
    'Token Symbol',
    'Issuer',
    'Registration Number',
    'Jurisdiction',
    'Backing Type',
    'Total Supply',
    'Pegged To'
  ].join(',');

  // Transform data to CSV rows
  const rows = stablecoins.map(stablecoin => {
    return [
      stablecoin.stablecoinName,
      stablecoin.tokenSymbol,
      stablecoin.issuerName,
      stablecoin.registrationNumber,
      stablecoin.jurisdiction,
      stablecoin.backingAssetType,
      stablecoin.totalSupply || 'N/A',
      stablecoin.peggedTo || 'USD'
    ].map(field => `"${field}"`).join(',');
  });

  // Generate and download CSV
  downloadCSV(headers, rows, filename);
}

function exportDefiProtocolToCSV(protocols: DefiProtocolInfo[], filename: string) {
  // Define CSV headers
  const headers = [
    'Protocol Name',
    'Protocol Type',
    'Website'
  ].join(',');

  // Transform data to CSV rows
  const rows = protocols.map(protocol => {
    return [
      protocol.protocolName,
      protocol.protocolType,
      protocol.websiteUrl
    ].map(field => `"${field}"`).join(',');
  });

  // Generate and download CSV
  downloadCSV(headers, rows, filename);
}

function exportNftMarketplaceToCSV(marketplaces: NftMarketplaceInfo[], filename: string) {
  // Define CSV headers
  const headers = [
    'Marketplace Name',
    'Business Entity',
    'Website'
  ].join(',');

  // Transform data to CSV rows
  const rows = marketplaces.map(marketplace => {
    return [
      marketplace.marketplaceName,
      marketplace.businessEntity,
      marketplace.websiteUrl
    ].map(field => `"${field}"`).join(',');
  });

  // Generate and download CSV
  downloadCSV(headers, rows, filename);
}

function exportCryptoFundToCSV(funds: CryptoFundInfo[], filename: string) {
  // Define CSV headers
  const headers = [
    'Fund Name',
    'Fund Type',
    'Registration Number',
    'Jurisdiction',
    'Website'
  ].join(',');

  // Transform data to CSV rows
  const rows = funds.map(fund => {
    return [
      fund.fundName,
      fund.fundType,
      fund.registrationNumber,
      fund.jurisdiction,
      fund.websiteUrl
    ].map(field => `"${field}"`).join(',');
  });

  // Generate and download CSV
  downloadCSV(headers, rows, filename);
}

function downloadCSV(headers: string, rows: string[], filename: string) {
  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function calculateRiskLevel(exchange: ExchangeInfo): string {
  // Simple risk calculation based on key metrics
  const kycMetrics = exchange.kycVerificationMetrics as any || {};
  const custody = exchange.custodyArrangements as any || {};
  
  const verifiedUsers = kycMetrics.verifiedUsers || 0;
  const totalUsers = verifiedUsers + (kycMetrics.nonVerifiedUsers || 0);
  const kycRatio = totalUsers > 0 ? verifiedUsers / totalUsers : 0;
  
  const coldStorage = custody.coldStoragePercentage || 0;
  
  if (kycRatio >= 0.8 && coldStorage >= 90) return 'Low';
  if (kycRatio >= 0.6 && coldStorage >= 80) return 'Medium';
  return 'High';
}
