"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProjectConfig } from "./types";

const defaultConfig: ProjectConfig = {
  projectName: "",
  pipeline: "nodejs-typescript",
  ci: "github-actions",
  infra: "aws-vpc-eks",
  deploy: "blue-green",
  envs: "dev,stage,prod",
  observability: "prometheus-grafana",
  security: "nist-csf",
};

interface ConfigContextType {
  config: ProjectConfig;
  updateConfig: (config: ProjectConfig) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ProjectConfig>(defaultConfig);

  const updateConfig = (newConfig: ProjectConfig) => {
    setConfig(newConfig);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
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
