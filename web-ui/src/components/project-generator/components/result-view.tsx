"use client";

import { ProjectConfig, GenerationResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Check,
  Download,
  RotateCcw,
  FileCode2,
  FolderOpen,
  Package,
  Zap,
  Terminal,
  Copy,
  CheckCheck,
  Clock,
  Info,
} from "lucide-react";
import { FileTree } from "../file-tree";
import { buildCliCommand } from "../utils";

interface ResultViewProps {
  config: ProjectConfig;
  result: GenerationResult;
  generationTime: number;
  copied: boolean;
  onDownload: () => void;
  onReset: () => void;
  onCopyCommand: () => void;
}

export function ResultView({
  config,
  result,
  generationTime,
  copied,
  onDownload,
  onReset,
  onCopyCommand,
}: ResultViewProps) {
  const cliCommand = buildCliCommand(config);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">Project Generated Successfully!</h2>
        <p className="text-sm sm:text-base text-muted-foreground px-2">
          <span className="font-semibold text-foreground">{result.projectName}</span> is ready with{" "}
          <span className="font-semibold text-foreground">{result.summary.totalFiles} files</span> across{" "}
          <span className="font-semibold text-foreground">{result.summary.totalDirs} directories</span>
        </p>
        {generationTime > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Generated in {generationTime.toFixed(1)}s</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <FileCode2 className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-blue-500" />
            <div className="text-xl sm:text-2xl font-bold text-blue-500">{result.summary.totalFiles}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Files</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 text-center">
            <FolderOpen className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-amber-500" />
            <div className="text-xl sm:text-2xl font-bold text-amber-500">{result.summary.totalDirs}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Directories</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-4 text-center">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-green-500" />
            <div className="text-xl sm:text-2xl font-bold text-green-500">{result.summary.components.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Components</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 sm:mb-1.5 text-purple-500" />
            <div className="text-xl sm:text-2xl font-bold text-purple-500">
              {config.envs === "single" ? 1 : config.envs.split(",").length}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Environments</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
          Generated Components
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {result.summary.components.map((component) => (
            <Badge key={component} variant="outline" className="gap-1.5 py-1 px-3">
              <Check className="h-3 w-3 text-green-500" />
              {component}
            </Badge>
          ))}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground">
              <Terminal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Equivalent CLI command</span>
            </div>
            <Button variant="ghost" size="xs" onClick={onCopyCommand} className="gap-1.5">
              {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <code className="block text-[10px] sm:text-xs font-mono bg-background rounded-md p-2 sm:p-3 overflow-x-auto text-foreground/80 break-all sm:break-normal">
            {cliCommand}
          </code>
        </CardContent>
      </Card>

      <FileTree files={result.files} projectName={result.projectName} />

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Next Steps:</strong> Extract the downloaded ZIP file, navigate to the project directory, and run{" "}
          <code className="bg-muted px-1 rounded">make setup</code> to initialize your DevOps project. All configurations
          are production-ready and can be customized for your specific needs.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button onClick={onDownload} size="lg" className="gap-2 px-6">
          <Download className="h-4 w-4" />
          Download as ZIP
        </Button>
        <Button onClick={onReset} variant="outline" size="lg" className="gap-2 px-6">
          <RotateCcw className="h-4 w-4" />
          Generate Another
        </Button>
      </div>
    </div>
  );
}
