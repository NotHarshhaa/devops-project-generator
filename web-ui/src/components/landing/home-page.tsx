"use client";

import { useCallback, useState } from "react";
import type { WorkspaceTab } from "./data/landing-content";
import { PageBackground } from "./components/page-background";
import { SiteHeader } from "./components/site-header";
import { HeroSection } from "./components/hero-section";
import { WorkspaceSection } from "./components/workspace-section";
import { NewFeaturesSection } from "./components/new-features-section";
import { FeaturesSection } from "./components/features-section";
import { SupportedOptionsSection } from "./components/supported-options-section";
import { GeneratedOutputSection } from "./components/generated-output-section";
import { AuthorSection } from "./components/author-section";
import { CtaSection } from "./components/cta-section";
import { SiteFooter } from "./components/site-footer";
import { ScrollToTopButton } from "./components/scroll-to-top-button";
import { useScrollToTop } from "./hooks/use-scroll-to-top";
import { navigateToWorkspace } from "./utils/navigate-to-workspace";

export function HomePage() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("generator");
  const { showScrollTop, scrollToTop } = useScrollToTop();

  const handleNavigate = useCallback((tab: WorkspaceTab) => {
    navigateToWorkspace(tab, setActiveTab);
  }, []);

  return (
    <div id="top" className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
      <PageBackground />
      <SiteHeader />
      
      {/* Editorial Hero Section */}
      <HeroSection />
      
      {/* Heavy 4px Section Rule */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-1 bg-foreground w-full" />
      </div>

      {/* Main Workspace Section */}
      <WorkspaceSection activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Heavy 4px Section Rule */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-1 bg-foreground w-full" />
      </div>

      {/* New Capabilities & Inverted Stats */}
      <NewFeaturesSection onNavigate={handleNavigate} />
      
      {/* Heavy 4px Section Rule */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-1 bg-foreground w-full" />
      </div>

      {/* Principles & Features Grid */}
      <FeaturesSection />
      
      {/* Heavy 4px Section Rule */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-1 bg-foreground w-full" />
      </div>

      {/* Modular Architecture Matrix */}
      <SupportedOptionsSection />
      
      {/* Heavy 4px Section Rule */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-1 bg-foreground w-full" />
      </div>

      {/* Generated Artifacts & Terminal Hierarchy */}
      <GeneratedOutputSection />
      
      {/* Heavy 4px Section Rule */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-1 bg-foreground w-full" />
      </div>

      {/* Authorial Philosophy & Pull Quotes */}
      <AuthorSection />
      
      {/* Heavy 4px Section Rule */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-1 bg-foreground w-full" />
      </div>

      {/* Inverted Monolithic CTA */}
      <CtaSection />
      
      {/* Colophon Footer */}
      <SiteFooter />
      
      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
