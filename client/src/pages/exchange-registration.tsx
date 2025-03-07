import { ExchangeRegistrationForm } from "@/components/exchange-registration-form";
import { RiskAnalysisDisplay } from "@/components/risk-analysis-display";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { RiskAssessment } from "@shared/schema";

export default function ExchangeRegistrationPage() {
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Exchange Registration</h1>
      <ExchangeRegistrationForm onRiskAssessment={setRiskAssessment} />

      {riskAssessment && (
        <Card className="mt-8">
          <RiskAnalysisDisplay assessment={riskAssessment} />
        </Card>
      )}
    </div>
  );
}