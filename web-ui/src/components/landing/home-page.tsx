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
    <div id="top" className="min-h-screen bg-background text-foreground w-full max-w-full overflow-x-hidden relative selection:bg-cyan-500/20 selection:text-cyan-700 dark:selection:text-cyan-300">
      <PageBackground />
      <SiteHeader />
      
      {/* Hero Section */}
      <HeroSection />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />
      </div>

      {/* Main Workspace Section */}
      <WorkspaceSection activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />
      </div>

      {/* New Capabilities & Interactive Cards */}
      <NewFeaturesSection onNavigate={handleNavigate} />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />
      </div>

      {/* Principles & Features Grid */}
      <FeaturesSection />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />
      </div>

      {/* Modular Architecture Matrix */}
      <SupportedOptionsSection />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />
      </div>

      {/* Generated Artifacts & Terminal Hierarchy */}
      <GeneratedOutputSection />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full" />
      </div>

      {/* Author Section */}
      <AuthorSection />
      
      {/* Monolithic CTA */}
      <CtaSection />
      
      {/* Footer */}
      <SiteFooter />
      
      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
