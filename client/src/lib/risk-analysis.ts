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

  // Verify KYC user ratio
  const kycMetrics = exchange.kycVerificationMetrics;
  if (kycMetrics) {
    const verifiedRatio = kycMetrics.verifiedUsers / (kycMetrics.verifiedUsers + kycMetrics.nonVerifiedUsers);
    factors.push({
      name: "KYC Verification Rate",
      score: verifiedRatio * 30,
      maxScore: 30,
      description: `${(verifiedRatio * 100).toFixed(1)}% of users are KYC verified`,
      recommendation: verifiedRatio < 0.8 ? "Increase KYC verification rate to at least 80%" : undefined,
    });
  }

  // High-risk jurisdiction exposure
  if (kycMetrics?.highRiskJurisdictionPercentage !== undefined) {
    const riskScore = Math.max(0, 40 - kycMetrics.highRiskJurisdictionPercentage * 2);
    factors.push({
      name: "High-Risk Jurisdiction Exposure",
      score: riskScore,
      maxScore: 40,
      description: `${kycMetrics.highRiskJurisdictionPercentage}% users from high-risk jurisdictions`,
      recommendation: kycMetrics.highRiskJurisdictionPercentage > 15 ? 
        "Implement enhanced due diligence for high-risk jurisdictions" : undefined,
    });
  }

  // Sanctions compliance
  if (exchange.sanctionsCompliance) {
    const sanctions = exchange.sanctionsCompliance;
    const sanctionsScore = (sanctions.ofacCompliant ? 10 : 0) + 
                          (sanctions.fatfCompliant ? 10 : 0) + 
                          (sanctions.euCompliant ? 10 : 0);
    factors.push({
      name: "Sanctions Compliance",
      score: sanctionsScore,
      maxScore: 30,
      description: `Compliant with ${sanctionsScore/10}/3 major sanctions frameworks`,
      recommendation: sanctionsScore < 30 ? "Achieve compliance with all major sanctions frameworks" : undefined,
    });
  }

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "KYC/AML Controls",
    score: totalScore,
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessSecurityRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Market manipulation detection
  if (exchange.washTradingDetection) {
    const detection = exchange.washTradingDetection;
    const detectionScore = (detection.automatedBotDetection ? 20 : 0) +
                          (detection.spoofingDetection ? 20 : 0);
    factors.push({
      name: "Market Manipulation Detection",
      score: detectionScore,
      maxScore: 40,
      description: `${detectionScore/20}/2 manipulation detection systems active`,
      recommendation: detectionScore < 40 ? "Implement all recommended market manipulation detection systems" : undefined,
    });
  }

  // Insurance coverage
  if (exchange.insuranceCoverage) {
    const coverage = exchange.insuranceCoverage;
    const hasInsurance = coverage.hasInsurance ? 30 : 0;
    factors.push({
      name: "Insurance Coverage",
      score: hasInsurance,
      maxScore: 30,
      description: coverage.hasInsurance ? 
        `Insurance coverage up to ${coverage.coverageLimit?.toLocaleString()} USD` : 
        "No insurance coverage",
      recommendation: !coverage.hasInsurance ? "Obtain comprehensive insurance coverage" : undefined,
    });
  }

  // Security audits and penetration testing
  if (exchange.insuranceCoverage?.lastPenetrationTest) {
    const lastTest = new Date(exchange.insuranceCoverage.lastPenetrationTest);
    const monthsSinceTest = (new Date().getTime() - lastTest.getTime()) / (30 * 24 * 60 * 60 * 1000);
    const testScore = monthsSinceTest <= 6 ? 30 : monthsSinceTest <= 12 ? 15 : 0;
    
    factors.push({
      name: "Security Testing",
      score: testScore,
      maxScore: 30,
      description: `Last penetration test: ${monthsSinceTest.toFixed(1)} months ago`,
      recommendation: monthsSinceTest > 6 ? "Conduct regular penetration testing every 6 months" : undefined,
    });
  }

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Security Measures",
    score: totalScore,
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessCustodyRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Asset storage distribution
  if (exchange.custodyArrangements) {
    const custody = exchange.custodyArrangements;
    const coldStorageScore = custody.coldStoragePercentage >= 95 ? 40 :
                            custody.coldStoragePercentage >= 90 ? 30 :
                            custody.coldStoragePercentage >= 80 ? 20 : 10;
    
    factors.push({
      name: "Cold Storage Usage",
      score: coldStorageScore,
      maxScore: 40,
      description: `${custody.coldStoragePercentage}% of assets in cold storage`,
      recommendation: custody.coldStoragePercentage < 95 ? 
        "Increase cold storage allocation to at least 95% of assets" : undefined,
    });

    // Fund segregation
    const segregationScore = custody.userFundSegregation ? 30 : 0;
    factors.push({
      name: "Fund Segregation",
      score: segregationScore,
      maxScore: 30,
      description: custody.userFundSegregation ? 
        "User funds are properly segregated" : 
        "No fund segregation implemented",
      recommendation: !custody.userFundSegregation ? 
        "Implement complete segregation of user funds" : undefined,
    });
  }

  // Multi-signature requirements
  const multiSigScore = exchange.securityMeasures?.multiSigRequired ? 30 : 0;
  factors.push({
    name: "Multi-Signature Security",
    score: multiSigScore,
    maxScore: 30,
    description: exchange.securityMeasures?.multiSigRequired ?
      "Multi-signature requirements in place" :
      "No multi-signature system",
    recommendation: !exchange.securityMeasures?.multiSigRequired ?
      "Implement multi-signature requirements for withdrawals" : undefined,
  });

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Custody Arrangements",
    score: totalScore,
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessTradingRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // HFT and algorithmic trading controls
  if (exchange.hftActivityMetrics) {
    const hft = exchange.hftActivityMetrics;
    const hftScore = hft.hftBotsAllowed ? 
      (hft.hftVolumePercentage <= 30 ? 40 :
       hft.hftVolumePercentage <= 50 ? 30 : 20) : 40;
    
    factors.push({
      name: "HFT Activity Control",
      score: hftScore,
      maxScore: 40,
      description: hft.hftBotsAllowed ?
        `HFT volume: ${hft.hftVolumePercentage}% of total` :
        "No HFT activity allowed",
      recommendation: hft.hftVolumePercentage > 30 ?
        "Reduce HFT trading volume to below 30% of total volume" : undefined,
    });
  }

  // Leverage and margin trading
  if (exchange.leverageAndMargin) {
    const leverage = exchange.leverageAndMargin;
    const leverageScore = leverage.maxLeverage <= 5 ? 30 :
                         leverage.maxLeverage <= 10 ? 20 :
                         leverage.maxLeverage <= 20 ? 10 : 0;
    
    factors.push({
      name: "Leverage Limits",
      score: leverageScore,
      maxScore: 30,
      description: `Maximum leverage: ${leverage.maxLeverage}x`,
      recommendation: leverage.maxLeverage > 5 ?
        "Reduce maximum leverage to 5x or lower" : undefined,
    });
  }

  // Market monitoring
  if (exchange.blockchainAnalytics) {
    const analytics = exchange.blockchainAnalytics;
    const monitoringScore = (analytics.realTimeAnalytics ? 15 : 0) +
                           (analytics.proofOfReserves ? 15 : 0);
    
    factors.push({
      name: "Market Monitoring",
      score: monitoringScore,
      maxScore: 30,
      description: `${monitoringScore/15}/2 monitoring systems active`,
      recommendation: monitoringScore < 30 ?
        "Implement comprehensive market monitoring systems" : undefined,
    });
  }

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Trading Controls",
    score: totalScore,
    maxScore: maxCategoryScore,
    factors,
  };
}

function assessRegulatoryRisk(exchange: ExchangeInfo): RiskScore {
  const factors: RiskFactor[] = [];
  let totalScore = 0;
  const maxCategoryScore = 100;

  // Regulatory licenses
  if (exchange.regulatoryLicenses) {
    const licenseScore = exchange.regulatoryLicenses ? 40 : 0;
    factors.push({
      name: "Regulatory Licensing",
      score: licenseScore,
      maxScore: 40,
      description: exchange.regulatoryLicenses ?
        "Has required regulatory licenses" :
        "Missing regulatory licenses",
      recommendation: !exchange.regulatoryLicenses ?
        "Obtain necessary regulatory licenses" : undefined,
    });
  }

  // Blockchain compliance tools
  if (exchange.blockchainAnalytics) {
    const analytics = exchange.blockchainAnalytics;
    const toolScore = analytics.monitoringTools.length >= 3 ? 30 :
                     analytics.monitoringTools.length >= 2 ? 20 :
                     analytics.monitoringTools.length >= 1 ? 10 : 0;
    
    factors.push({
      name: "Compliance Tools",
      score: toolScore,
      maxScore: 30,
      description: `Using ${analytics.monitoringTools.length} compliance tools`,
      recommendation: analytics.monitoringTools.length < 3 ?
        "Implement additional blockchain compliance tools" : undefined,
    });
  }

  // Jurisdiction risk
  const jurisdictionScore = calculateJurisdictionScore(exchange.headquartersLocation);
  factors.push({
    name: "Jurisdiction Risk",
    score: jurisdictionScore,
    maxScore: 30,
    description: `Jurisdiction risk assessment: ${determineJurisdictionRisk(jurisdictionScore)}`,
    recommendation: jurisdictionScore < 20 ?
      "Consider establishing presence in well-regulated jurisdictions" : undefined,
  });

  totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
  return {
    category: "Regulatory Compliance",
    score: totalScore,
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
  if (score >= 40) return "High";
  return "Critical";
}

// Helper function to calculate jurisdiction risk score
function calculateJurisdictionScore(jurisdiction: string): number {
  const lowRiskJurisdictions = [
    "united states", "singapore", "japan", "united kingdom", "switzerland",
    "european union", "australia", "canada"
  ];
  const mediumRiskJurisdictions = [
    "hong kong", "south korea", "uae", "brazil", "malaysia"
  ];
  
  const lowerJurisdiction = jurisdiction.toLowerCase();
  if (lowRiskJurisdictions.some(j => lowerJurisdiction.includes(j))) return 30;
  if (mediumRiskJurisdictions.some(j => lowerJurisdiction.includes(j))) return 20;
  return 10;
}

function determineJurisdictionRisk(score: number): string {
  if (score >= 30) return "Low Risk";
  if (score >= 20) return "Medium Risk";
  return "High Risk";
}
