import { ExchangeInfo } from "@shared/schema";

export function exportToCSV(exchanges: ExchangeInfo[], filename: string = 'exchange-registrations.csv') {
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
