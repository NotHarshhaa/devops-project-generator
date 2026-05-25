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
    <div id="top" className="min-h-screen bg-background">
      <PageBackground />
      <SiteHeader />
      <HeroSection />
      <WorkspaceSection activeTab={activeTab} onTabChange={setActiveTab} />
      <NewFeaturesSection onNavigate={handleNavigate} />
      <FeaturesSection />
      <SupportedOptionsSection />
      <GeneratedOutputSection />
      <AuthorSection />
      <CtaSection />
      <SiteFooter />
      <ScrollToTopButton visible={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
