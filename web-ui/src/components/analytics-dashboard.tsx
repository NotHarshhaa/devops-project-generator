"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Globe,
  GitBranch,
  Layers,
  Package,
  Activity,
  Shield,
  Award,
  Clock,
  Download,
} from "lucide-react";

interface AnalyticsData {
  totalProjects: number;
  popularCombinations: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  technologyStats: {
    ci: Record<string, number>;
    infra: Record<string, number>;
    deploy: Record<string, number>;
    observability: Record<string, number>;
  };
  trends: Array<{
    technology: string;
    growth: number;
    category: string;
  }>;
}

export function AnalyticsDashboard() {
  const analyticsData = useMemo<AnalyticsData>(() => {
    return {
      totalProjects: 12847,
      popularCombinations: [
        { name: "AWS EKS + GitHub Actions + Helm", count: 3421, percentage: 26.6 },
        { name: "Azure AKS + GitLab CI + ArgoCD", count: 2156, percentage: 16.8 },
        { name: "GCP GKE + GitHub Actions + Kustomize", count: 1893, percentage: 14.7 },
        { name: "Multi-Cloud + Jenkins + Blue-Green", count: 1547, percentage: 12.0 },
        { name: "ECS Fargate + GitHub Actions + Rolling", count: 1234, percentage: 9.6 },
      ],
      technologyStats: {
        ci: {
          "github-actions": 6847,
          "gitlab-ci": 3421,
          "jenkins": 1893,
          "azure-pipelines": 547,
          "circleci": 139,
        },
        infra: {
          "aws-vpc-eks": 5234,
          "azure-vnet-aks": 3156,
          "gcp-vpc-gke": 2341,
          "terraform-multi-cloud": 1234,
          "ecs-fargate": 882,
        },
        deploy: {
          "helm-charts": 4521,
          "gitops-argocd": 3234,
          "blue-green": 2156,
          "kustomize": 1893,
          "canary": 1043,
        },
        observability: {
          "prometheus-grafana": 6234,
          "datadog": 2341,
          "elk-stack": 1893,
          "cloudwatch": 1547,
          "jaeger-prometheus": 832,
        },
      },
      trends: [
        { technology: "GitOps with ArgoCD", growth: 156, category: "deployment" },
        { technology: "Multi-Cloud Terraform", growth: 89, category: "infrastructure" },
        { technology: "GitHub Actions", growth: 67, category: "ci-cd" },
        { technology: "Prometheus + Grafana", growth: 54, category: "observability" },
        { technology: "Zero Trust Security", growth: 43, category: "security" },
      ],
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ci-cd": return GitBranch;
      case "infrastructure": return Layers;
      case "deployment": return Package;
      case "observability": return Activity;
      case "security": return Shield;
      default: return Zap;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ci-cd": return "text-blue-500";
      case "infrastructure": return "text-purple-500";
      case "deployment": return "text-cyan-500";
      case "observability": return "text-amber-500";
      case "security": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Project Analytics Dashboard
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Insights and trends from generated DevOps projects
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Download className="h-3 w-3" />
              Total Projects
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              {analyticsData.totalProjects.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="h-3 w-3" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              Active Users
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold">8.4K</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-green-500">
              <TrendingUp className="h-3 w-3" />
              <span>+8% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Globe className="h-3 w-3" />
              Countries
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold">142</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>Worldwide</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Avg. Time Saved
            </CardDescription>
            <CardTitle className="text-2xl sm:text-3xl font-bold">4.2h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>Per project</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Combinations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            Most Popular Stack Combinations
          </CardTitle>
          <CardDescription className="text-xs">
            Top 5 technology combinations used by the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.popularCombinations.map((combo, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{combo.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {combo.count.toLocaleString()} projects
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-semibold">
                    {combo.percentage}%
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                    style={{ width: `${combo.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technology Statistics */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* CI/CD Platforms */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-blue-500" />
              CI/CD Platforms
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of CI/CD choices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.ci)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.ci).reduce((a, b) => a + b, 0);
                  const percentage = (count / total) * 100;
                  
                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-500" />
              Infrastructure Platforms
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of infrastructure choices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.infra)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.infra).reduce((a, b) => a + b, 0);
                  const percentage = (count / total) * 100;
                  
                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Deployment Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-cyan-500" />
              Deployment Strategies
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of deployment choices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.deploy)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.deploy).reduce((a, b) => a + b, 0);
                  const percentage = (count / total) * 100;
                  
                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Observability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              Observability Stacks
            </CardTitle>
            <CardDescription className="text-xs">
              Distribution of observability choices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analyticsData.technologyStats.observability)
                .sort(([, a], [, b]) => b - a)
                .map(([tech, count]) => {
                  const total = Object.values(analyticsData.technologyStats.observability).reduce((a, b) => a + b, 0);
                  const percentage = (count / total) * 100;
                  
                  return (
                    <div key={tech} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium capitalize">{tech.replace(/-/g, " ")}</span>
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Technologies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Trending Technologies
          </CardTitle>
          <CardDescription className="text-xs">
            Fastest growing technologies this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.trends.map((trend, idx) => {
              const Icon = getCategoryIcon(trend.category);
              const colorClass = getCategoryColor(trend.category);
              
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${trend.category === 'ci-cd' ? 'blue' : trend.category === 'infrastructure' ? 'purple' : trend.category === 'deployment' ? 'cyan' : trend.category === 'observability' ? 'amber' : 'red'}-500/10`}>
                      <Icon className={`h-5 w-5 ${colorClass}`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{trend.technology}</div>
                      <div className="text-xs text-muted-foreground capitalize">{trend.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-500 border-0 font-semibold">
                      +{trend.growth}%
                    </Badge>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
