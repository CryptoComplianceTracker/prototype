import type { ExchangeInfo, RiskAssessment, RiskScore, RiskFactor } from "@shared/schema";

// Weight factors for different risk categories
const RISK_WEIGHTS = {
  kyc: 0.25,
  security: 0.25,
  custody: 0.20,
  trading: 0.15,
  regulatory: 0.15,
};

export function calculateRiskScore(exchange: ExchangeInfo): RiskAssessment {
  const categories: RiskScore[] = [
    assessKYCRisk(exchange),
    assessSecurityRisk(exchange),
    assessCustodyRisk(exchange),
    assessTradingRisk(exchange),
    assessRegulatoryRisk(exchange),
  ];

  const overallScore = calculateWeightedScore(categories);
  const riskLevel = determineRiskLevel(overallScore);

  return {
    overallScore,
    riskLevel,
    categories,
    timestamp: new Date().toISOString(),
  };
}

function assessKYCRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Verify KYC metrics
  const kycMetrics = exchange.kycVerificationMetrics as any || {};
  const verifiedUsers = kycMetrics.verifiedUsers || 0;
  const nonVerifiedUsers = kycMetrics.nonVerifiedUsers || 1;
  const verifiedRatio = verifiedUsers / (verifiedUsers + nonVerifiedUsers);

  factors.push({
    name: "KYC Verification Rate",
    score: verifiedRatio * 40,
    maxScore: 40,
    description: `${(verifiedRatio * 100).toFixed(1)}% of users are KYC verified`,
    recommendation: verifiedRatio < 0.8 ? "Increase KYC verification rate to at least 80%" : undefined,
  });

  // Sanctions compliance
  const sanctions = exchange.sanctionsCompliance as any || {};
  const sanctionsScore = (sanctions.ofacCompliant ? 30 : 0) + 
                        (sanctions.fatfCompliant ? 30 : 0);
  factors.push({
    name: "Sanctions Compliance",
    score: sanctionsScore,
    maxScore: 60,
    description: `Compliant with ${sanctionsScore/30}/2 major sanctions frameworks`,
    recommendation: sanctionsScore < 60 ? "Achieve compliance with major sanctions frameworks" : undefined,
  });

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "KYC/AML Controls",
    score: Math.min(totalScore, maxCategoryScore),
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessSecurityRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Market manipulation detection
  const detection = exchange.washTradingDetection as any || {};
  const detectionScore = (detection.automatedBotDetection ? 25 : 0) +
                        (detection.spoofingDetection ? 25 : 0);
  factors.push({
    name: "Market Manipulation Detection",
    score: detectionScore,
    maxScore: 50,
    description: `${detectionScore/25}/2 manipulation detection systems active`,
    recommendation: detectionScore < 50 ? "Implement all recommended market manipulation detection systems" : undefined,
  });

  // Security measures
  const security = exchange.securityMeasures as any || {};
  const securityScore = (security.twoFactorAuth ? 25 : 0) +
                       (security.multiSigRequired ? 25 : 0);

  factors.push({
    name: "Security Measures",
    score: securityScore,
    maxScore: 50,
    description: `${securityScore/25}/2 security measures implemented`,
    recommendation: securityScore < 50 ? "Implement all recommended security measures" : undefined,
  });

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Security Measures",
    score: Math.min(totalScore, maxCategoryScore),
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessCustodyRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Asset storage distribution
  const custody = exchange.custodyArrangements as any || {};
  const coldStoragePercentage = custody.coldStoragePercentage || 0;
  const coldStorageScore = coldStoragePercentage >= 95 ? 50 :
                          coldStoragePercentage >= 90 ? 40 :
                          coldStoragePercentage >= 80 ? 30 : 20;

  factors.push({
    name: "Cold Storage Usage",
    score: coldStorageScore,
    maxScore: 50,
    description: `${coldStoragePercentage}% of assets in cold storage`,
    recommendation: coldStoragePercentage < 95 ? 
      "Increase cold storage allocation to at least 95% of assets" : undefined,
  });

  // Fund segregation
  const segregationScore = custody.userFundSegregation ? 50 : 0;
  factors.push({
    name: "Fund Segregation",
    score: segregationScore,
    maxScore: 50,
    description: custody.userFundSegregation ? 
      "User funds are properly segregated" : 
      "No fund segregation implemented",
    recommendation: !custody.userFundSegregation ? 
      "Implement complete segregation of user funds" : undefined,
  });

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Custody Arrangements",
    score: Math.min(totalScore, maxCategoryScore),
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessTradingRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Blockchain analytics and monitoring
  const analytics = exchange.blockchainAnalytics as any || {};
  const monitoringTools = Array.isArray(analytics.monitoringTools) ? 
    analytics.monitoringTools : [];

  const monitoringScore = monitoringTools.length >= 3 ? 50 :
                         monitoringTools.length >= 2 ? 35 :
                         monitoringTools.length >= 1 ? 20 : 0;

  factors.push({
    name: "Blockchain Monitoring",
    score: monitoringScore,
    maxScore: 50,
    description: `Using ${monitoringTools.length} monitoring tools`,
    recommendation: monitoringTools.length < 3 ?
      "Implement additional blockchain monitoring tools" : undefined,
  });

  // Risk management
  const riskMgmt = exchange.riskManagement as any || {};
  const riskScore = (riskMgmt.marketSurveillance ? 25 : 0) +
                   (riskMgmt.automatedControls ? 25 : 0);

  factors.push({
    name: "Risk Management",
    score: riskScore,
    maxScore: 50,
    description: `${riskScore/25}/2 risk management systems active`,
    recommendation: riskScore < 50 ?
      "Enhance risk management systems" : undefined,
  });

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Trading Controls",
    score: Math.min(totalScore, maxCategoryScore),
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessRegulatoryRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Regulatory licenses
  const licenseScore = exchange.regulatoryLicenses ? 50 : 0;
  factors.push({
    name: "Regulatory Licensing",
    score: licenseScore,
    maxScore: 50,
    description: exchange.regulatoryLicenses ?
      "Has required regulatory licenses" :
      "Missing regulatory licenses",
    recommendation: !exchange.regulatoryLicenses ?
      "Obtain necessary regulatory licenses" : undefined,
  });

  // Jurisdiction risk
  const jurisdictionScore = calculateJurisdictionScore(exchange.headquartersLocation || "");
  factors.push({
    name: "Jurisdiction Risk",
    score: jurisdictionScore,
    maxScore: 50,
    description: `Jurisdiction risk assessment: ${determineJurisdictionRisk(jurisdictionScore)}`,
    recommendation: jurisdictionScore < 30 ?
      "Consider establishing presence in well-regulated jurisdictions" : undefined,
  });

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Regulatory Compliance",
    score: Math.min(totalScore, maxCategoryScore),
    maxScore: maxCategoryScore,
    factors,
  };
}

function calculateWeightedScore(categories: RiskScore[]): number {
  return categories.reduce((total, category) => {
    const weight = RISK_WEIGHTS[category.category.toLowerCase().split('/')[0] as keyof typeof RISK_WEIGHTS];
    return total + (category.score / category.maxScore) * weight * 100;
  }, 0);
}

function determineRiskLevel(score: number): RiskAssessment['riskLevel'] {
  if (score >= 80) return "Low";
  if (score >= 60) return "Medium";
  return "High";
}

function calculateJurisdictionScore(jurisdiction: string): number {
  const lowRiskJurisdictions = [
    "united states", "singapore", "japan", "united kingdom", "switzerland",
    "european union", "australia", "canada"
  ];
  const mediumRiskJurisdictions = [
    "hong kong", "south korea", "uae", "brazil", "malaysia"
  ];

  const lowerJurisdiction = jurisdiction.toLowerCase();
  if (lowRiskJurisdictions.some(j => lowerJurisdiction.includes(j))) return 50;
  if (mediumRiskJurisdictions.some(j => lowerJurisdiction.includes(j))) return 30;
  return 10;
}

function determineJurisdictionRisk(score: number): string {
  if (score >= 40) return "Low Risk";
  if (score >= 20) return "Medium Risk";
  return "High Risk";
}