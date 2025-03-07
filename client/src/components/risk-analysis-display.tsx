import { RiskAssessment, RiskScore, RiskFactor } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RiskAnalysisDisplayProps {
  assessment: RiskAssessment;
}

export function RiskAnalysisDisplay({ assessment }: RiskAnalysisDisplayProps) {
  const getRiskColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getRiskIcon = (riskLevel: RiskAssessment['riskLevel']) => {
    switch (riskLevel) {
      case "Low":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Medium":
        return <Info className="h-5 w-5 text-yellow-500" />;
      case "High":
      case "Critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Risk Assessment</span>
            <div className="flex items-center gap-2">
              {getRiskIcon(assessment.riskLevel)}
              <span className={`text-${assessment.riskLevel.toLowerCase()}-500`}>
                {assessment.riskLevel} Risk
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-sm font-medium">{assessment.overallScore.toFixed(1)}%</span>
              </div>
              <Progress 
                value={assessment.overallScore} 
                className={getRiskColor(assessment.overallScore, 100)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {assessment.categories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Category Score</span>
                    <span className="text-sm font-medium">
                      {((category.score / category.maxScore) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(category.score / category.maxScore) * 100}
                    className={getRiskColor(category.score, category.maxScore)}
                  />
                </div>

                <Collapsible>
                  <CollapsibleTrigger className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    View Details
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    {category.factors.map((factor, fIndex) => (
                      <div key={fIndex} className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium">{factor.name}</span>
                          <span className="text-sm">
                            {((factor.score / factor.maxScore) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={(factor.score / factor.maxScore) * 100}
                          className={getRiskColor(factor.score, factor.maxScore)}
                        />
                        <p className="text-sm text-muted-foreground">
                          {factor.description}
                        </p>
                        {factor.recommendation && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertTitle>Recommendation</AlertTitle>
                            <AlertDescription>
                              {factor.recommendation}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-sm text-muted-foreground text-right">
        Last updated: {new Date(assessment.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
