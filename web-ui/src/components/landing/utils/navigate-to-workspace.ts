import type { WorkspaceTab } from "../data/landing-content";

export function navigateToWorkspace(tab: WorkspaceTab, setActiveTab: (tab: WorkspaceTab) => void) {
  setActiveTab(tab);
  document.getElementById("generator-section")?.scrollIntoView({ behavior: "smooth" });
}
