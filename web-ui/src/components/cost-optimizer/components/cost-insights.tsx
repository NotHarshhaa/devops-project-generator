import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Activity, Globe, AlertCircle } from "lucide-react";

interface CostInsightsProps {
  totalMonthlyCost: number;
}

export function CostInsights({ totalMonthlyCost }: CostInsightsProps) {
  return (
    <>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Team Size Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div>1-2 engineers: ${totalMonthlyCost.toFixed(0)}/mo</div>
              <div>3-5 engineers: ${(totalMonthlyCost * 1.2).toFixed(0)}/mo</div>
              <div>6-10 engineers: ${(totalMonthlyCost * 1.5).toFixed(0)}/mo</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              Usage Multipliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div>Low usage (25%): ${(totalMonthlyCost * 0.7).toFixed(0)}/mo</div>
              <div>Average usage (50%): ${totalMonthlyCost.toFixed(0)}/mo</div>
              <div>High usage (100%): ${(totalMonthlyCost * 1.8).toFixed(0)}/mo</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-500" />
              Regional Variations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <div>US East: ${totalMonthlyCost.toFixed(0)}/mo</div>
              <div>US West: ${(totalMonthlyCost * 1.05).toFixed(0)}/mo</div>
              <div>Europe: ${(totalMonthlyCost * 1.15).toFixed(0)}/mo</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Disclaimer:</strong> These are estimates based on 2024 pricing data for typical
          usage patterns. Actual costs vary based on region, usage patterns, negotiated discounts,
          and specific configurations. Always consult official pricing calculators and consider
          conducting a thorough cost analysis before making decisions.
        </AlertDescription>
      </Alert>
    </>
  );
}
