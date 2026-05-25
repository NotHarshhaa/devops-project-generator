"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProjectConfig } from "./types";
import { DEFAULT_PROJECT_CONFIG } from "./constants";

interface ConfigContextType {
  config: ProjectConfig;
  updateConfig: (config: ProjectConfig) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_PROJECT_CONFIG);

  const updateConfig = (newConfig: ProjectConfig) => {
    setConfig(newConfig);
  };

  const resetConfig = () => {
    setConfig(DEFAULT_PROJECT_CONFIG);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
