"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectGenerator } from "@/components/project-generator";
import { AdvancedConfigBuilder } from "@/components/advanced-config-builder";
import { CostOptimizer } from "@/components/cost-optimizer";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { useConfig } from "@/lib/config-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Rocket,
  Github,
  Heart,
  ExternalLink,
  GitBranch,
  Layers,
  Container,
  Ship,
  Monitor,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  BarChart3,
  FileText,
  Server,
  Cloud,
  Box,
  Cpu,
  Zap,
  CheckCircle2,
  ArrowRight,
  Globe,
  Linkedin,
  Send,
  FolderTree,
  FileCode2,
  Settings2,
  Workflow,
  ChevronUp,
  Network,
  DollarSign,
} from "lucide-react";

export default function Home() {
  const { config } = useConfig();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState("generator");

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient background effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-blue-500/3 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-purple-500/3 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <a
            href="/"
            className="flex items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-80 min-w-0"
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold leading-none tracking-tight truncate">
                DevOps Project Generator
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                v1.6.0
              </span>
            </div>
          </a>

          <div className="flex items-center gap-2">
            <Button asChild variant="default" size="sm">
              <a
                href="https://github.com/NotHarshhaa/devops-project-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5"
              >
                <Github className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto max-w-5xl px-4 pt-8 sm:pt-12 pb-6 sm:pb-8 text-center">
        <Badge variant="secondary" className="mb-3 sm:mb-4 gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs">
          <Rocket className="h-3 w-3" />
          Production-Ready DevOps Scaffolding
        </Badge>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          Build your DevOps project
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            in seconds, not hours
          </span>
        </h1>

        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed px-2">
          Configure your CI/CD, infrastructure, deployment, observability, and
          security stack — then download a complete, production-ready project
          structure.
        </p>
      </section>

      {/* Main Generator with Tabs */}
      <main className="container mx-auto max-w-5xl px-3 sm:px-4 pb-10 sm:pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="inline-flex h-auto p-1.5 bg-muted/80 backdrop-blur-sm border border-border/60 rounded-xl shadow-lg shadow-black/5">
              <TabsTrigger 
                value="generator" 
                className="relative gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium bg-transparent hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground items-center justify-center rounded-lg transition-all duration-200 data-[state=active]:scale-[1.02]"
              >
                <Rocket className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Generator</span>
                <span className="sm:hidden">Gen</span>
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="relative gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium bg-transparent hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground items-center justify-center rounded-lg transition-all duration-200 data-[state=active]:scale-[1.02]"
              >
                <Network className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Config Builder</span>
                <span className="sm:hidden">Config</span>
              </TabsTrigger>
              <TabsTrigger 
                value="cost" 
                className="relative gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium bg-transparent hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground items-center justify-center rounded-lg transition-all duration-200 data-[state=active]:scale-[1.02]"
              >
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Cost Advisor</span>
                <span className="sm:hidden">Cost</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="relative gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-medium bg-transparent hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md data-[state=inactive]:text-muted-foreground items-center justify-center rounded-lg transition-all duration-200 data-[state=active]:scale-[1.02]"
              >
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Analytics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="rounded-xl sm:rounded-2xl border bg-card/50 backdrop-blur-sm p-4 sm:p-6 md:p-8 shadow-xl shadow-black/5">
            <TabsContent value="generator" className="mt-0">
              <ProjectGenerator />
            </TabsContent>

            <TabsContent value="config" className="mt-0">
              <AdvancedConfigBuilder config={config} />
            </TabsContent>

            <TabsContent value="cost" className="mt-0">
              <CostOptimizer config={config} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsDashboard />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* ── Features Section ── */}
      <section className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="secondary" className="mb-3 gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs">
            <Zap className="h-3 w-3" />
            Why Choose This Tool
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              ship faster
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Stop spending hours setting up boilerplate. Generate a complete, production-ready DevOps project in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Workflow,
              title: "CI/CD Pipelines",
              description: "Pre-configured GitHub Actions, GitLab CI, or Jenkins pipelines with test, lint, build, and deploy stages.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Layers,
              title: "Infrastructure as Code",
              description: "Terraform or CloudFormation templates with best practices — state management, modules, and multi-env support.",
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              icon: Container,
              title: "Container Ready",
              description: "Production Dockerfiles with multi-stage builds, health checks, non-root users, and Compose configs.",
              color: "text-cyan-500",
              bg: "bg-cyan-500/10",
            },
            {
              icon: Ship,
              title: "Kubernetes Manifests",
              description: "Deployments, Services, Namespaces with resource limits, probes, and namespace separation.",
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
            {
              icon: Activity,
              title: "Full Observability",
              description: "Logging configs, Prometheus metrics, and alerting rules — from basic logs to full monitoring stacks.",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              icon: ShieldCheck,
              title: "Security Built-In",
              description: "Security policies, Trivy scanning configs, network policies, and RBAC — from basic to strict posture.",
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
          ].map((feature) => (
            <Card key={feature.title} className="group border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-5 sm:p-6">
                <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                  <feature.icon className={`h-5 w-5 sm:h-5.5 sm:w-5.5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1.5">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Available Options Section ── */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <Badge variant="secondary" className="mb-3 gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs">
              <Settings2 className="h-3 w-3" />
              Supported Options
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Fully configurable{" "}
              <span className="bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">
                tech stack
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Mix and match from industry-standard tools. Every combination generates a working, best-practice project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* CI/CD */}
            <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <GitBranch className="h-4.5 w-4.5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">CI/CD Platform</h3>
                  <p className="text-[11px] text-muted-foreground">Continuous integration & delivery</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Github, label: "GitHub Actions", tag: "Popular" },
                  { icon: Server, label: "GitLab CI", tag: null },
                  { icon: Settings2, label: "Jenkins", tag: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.tag && (
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure */}
            <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                  <Layers className="h-4.5 w-4.5 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Infrastructure</h3>
                  <p className="text-[11px] text-muted-foreground">Infrastructure as Code tools</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Layers, label: "Terraform", tag: "Multi-cloud" },
                  { icon: Cloud, label: "CloudFormation", tag: "AWS" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.tag && (
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment */}
            <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Container className="h-4.5 w-4.5 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Deployment</h3>
                  <p className="text-[11px] text-muted-foreground">How your app gets deployed</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Container, label: "Docker", tag: "Recommended" },
                  { icon: Ship, label: "Kubernetes", tag: "Production" },
                  { icon: Monitor, label: "Virtual Machine", tag: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.tag && (
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Environments */}
            <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                  <Cpu className="h-4.5 w-4.5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Environments</h3>
                  <p className="text-[11px] text-muted-foreground">Deployment environment strategy</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Box, label: "Single Environment", tag: "Simple" },
                  { icon: GitBranch, label: "Dev / Stage / Prod", tag: "Best Practice" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.tag && (
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Observability */}
            <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                  <Activity className="h-4.5 w-4.5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Observability</h3>
                  <p className="text-[11px] text-muted-foreground">Monitoring & alerting setup</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: FileText, label: "Logs Only", tag: null },
                  { icon: BarChart3, label: "Logs + Metrics", tag: "Recommended" },
                  { icon: Activity, label: "Full (Logs + Metrics + Alerts)", tag: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.tag && (
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                  <Shield className="h-4.5 w-4.5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Security</h3>
                  <p className="text-[11px] text-muted-foreground">Security posture & policies</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Shield, label: "Basic", tag: null },
                  { icon: ShieldCheck, label: "Standard", tag: "Recommended" },
                  { icon: ShieldAlert, label: "Strict", tag: "Enterprise" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-3 py-2">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.tag && (
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Gets Generated Section ── */}
      <section className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <Badge variant="secondary" className="mb-3 gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs">
            <FolderTree className="h-3 w-3" />
            Generated Output
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            What you{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              get
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            A complete, well-organized project structure following industry best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Project Structure Preview */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/50 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground ml-2">project-structure</span>
            </div>
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <div className="text-foreground font-semibold">my-devops-project/</div>
              {[
                { indent: 1, icon: "📁", name: "app/", desc: "Application source code" },
                { indent: 1, icon: "📁", name: "ci/", desc: "CI/CD pipelines" },
                { indent: 1, icon: "📁", name: "infra/", desc: "Infrastructure as Code" },
                { indent: 1, icon: "📁", name: "deploy/", desc: "Dockerfiles & Compose" },
                { indent: 1, icon: "📁", name: "k8s/", desc: "Kubernetes manifests" },
                { indent: 1, icon: "📁", name: "monitoring/", desc: "Logs, metrics & alerts" },
                { indent: 1, icon: "📁", name: "security/", desc: "Policies & scanning" },
                { indent: 1, icon: "📁", name: "scripts/", desc: "Setup & deploy scripts" },
                { indent: 1, icon: "📄", name: "Makefile", desc: "Build automation" },
                { indent: 1, icon: "📄", name: "README.md", desc: "Project documentation" },
                { indent: 1, icon: "📄", name: ".gitignore", desc: "Git ignore rules" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2 py-0.5">
                  <span className="select-none">{"\u00A0".repeat(item.indent * 3)}{item.icon}</span>
                  <span className="text-foreground/80">{item.name}</span>
                  <span className="text-muted-foreground/60 text-[10px] sm:text-xs hidden sm:inline">— {item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                icon: FileCode2,
                title: "Production-Ready Code",
                description: "Every generated file follows best practices — health checks, non-root users, resource limits, proper logging.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: FolderTree,
                title: "Organized Structure",
                description: "Clean separation of concerns: app code, CI/CD, infra, deployment, monitoring, and security in dedicated directories.",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                icon: Settings2,
                title: "Fully Customizable",
                description: "Every option is configurable. Mix Docker with Terraform, GitHub Actions with Strict security — any combination works.",
                color: "text-green-500",
                bg: "bg-green-500/10",
              },
              {
                icon: Zap,
                title: "Instant Download",
                description: "Generate and download your entire project as a ZIP file. No sign-up, no API keys, no waiting.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border bg-card p-4 sm:p-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Author Section ── */}
      <section className="border-y bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <Badge variant="secondary" className="mb-3 gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs">
              <Heart className="h-3 w-3" />
              Meet the Creator
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Built by a{" "}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                passionate engineer
              </span>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-0">
                
                {/* Avatar & Info */}
                <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                    <div className="shrink-0">
                      <Image
                        src="https://github.com/notharshhaa.png"
                        alt="H A R S H H A A"
                        width={96}
                        height={96}
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-background shadow-lg object-cover"
                      />
                    </div>
                    <div className="pb-1">
                      <h3 className="text-lg sm:text-xl font-bold tracking-wide">H A R S H H A A</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        Development Platform &amp; Automation Enthusiast | Cloud, DevOps &amp; MLops Engineer | Platform Engineering
                      </p>
                    </div>
                  </div>

                  <Separator className="my-5 sm:my-6" />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    {[
                      { label: "Open Source", value: "50+", sub: "Projects" },
                      { label: "Community", value: "10K+", sub: "Members" },
                      { label: "Experience", value: "5+", sub: "Years" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center rounded-lg bg-muted/50 p-3 sm:p-4">
                        <div className="text-lg sm:text-2xl font-bold">{stat.value}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <Button asChild variant="default" size="sm" className="gap-1.5">
                      <a href="https://github.com/NotHarshhaa" target="_blank" rel="noopener noreferrer">
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                      <a href="https://www.linkedin.com/in/NotHarshhaa/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                      <a href="https://notharshhaa.site" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-3.5 w-3.5" />
                        Portfolio
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                      <a href="https://t.me/prodevopsguy" target="_blank" rel="noopener noreferrer">
                        <Send className="h-3.5 w-3.5" />
                        Telegram
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="container mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-primary/5 p-8 sm:p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Rocket className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Ready to scaffold your project?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-6">
            Go back up and configure your stack. Your complete DevOps project is just a few clicks away.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="gap-2 px-6">
              <a href="#top">
                <ArrowRight className="h-4 w-4" />
                Start Generating
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-6">
              <a href="https://github.com/NotHarshhaa/devops-project-generator" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>by</span>
              <a
                href="https://github.com/NotHarshhaa"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
              >
                Harshhaa
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground">
              <a
                href="https://github.com/NotHarshhaa/devops-project-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Source Code
              </a>
              <Separator orientation="vertical" className="h-3" />
              <a
                href="https://t.me/prodevopsguy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                Community
              </a>
              <Separator orientation="vertical" className="h-3" />
              <span>MIT License</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="sm"
          className="fixed bottom-8 right-8 h-10 w-10 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
