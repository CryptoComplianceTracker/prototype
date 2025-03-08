import { useRoute } from "wouter";
import { jurisdictions } from "@/lib/jurisdiction-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function JurisdictionPage() {
  const [, params] = useRoute<{ id: string }>("/jurisdiction/:id");
  const jurisdiction = jurisdictions.find(j => j.id === params?.id);

  if (!jurisdiction) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The requested jurisdiction was not found.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/compliance">Back to Map</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button asChild className="mb-6">
        <Link href="/compliance">← Back to Map</Link>
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">{jurisdiction.name}</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{jurisdiction.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regulatory Framework</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{jurisdiction.regulatoryFramework}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Regulations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {jurisdiction.keyRegulations.map((regulation, index) => (
                <li key={index}>{regulation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
