"use client";

import { useState, useEffect } from "react";
import { GeneratedFile } from "@/lib/types";
import {
  validateGitHubToken,
  scaffoldGitHubRepo,
  buildGitHubCliScript,
  buildFullGitSetupScript,
  GitHubUser,
  ScaffoldProgress,
} from "@/lib/github/scaffold-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Github,
  Check,
  Copy,
  CheckCheck,
  ExternalLink,
  Lock,
  Globe,
  KeyRound,
  Terminal,
  AlertCircle,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

interface GitHubScaffoldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  files: GeneratedFile[];
}

const STORAGE_KEY_TOKEN = "devops_gen_github_pat";

export function GitHubScaffoldDialog({
  isOpen,
  onClose,
  projectName,
  files,
}: GitHubScaffoldDialogProps) {
  const [activeTab, setActiveTab] = useState<"browser" | "cli">("browser");
  const [pat, setPat] = useState("");
  const [savePat, setSavePat] = useState(true);
  const [repoName, setRepoName] = useState(projectName || "my-devops-platform");
  const [isPrivate, setIsPrivate] = useState(true);
  const [description, setDescription] = useState(
    "Production DevOps Stack generated with DevOps Project Generator"
  );
  
  const [validatedUser, setValidatedUser] = useState<GitHubUser | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [progress, setProgress] = useState<ScaffoldProgress>({
    stage: "idle",
    message: "",
    progressPercent: 0,
  });

  const [copiedCli, setCopiedCli] = useState(false);
  const [cliMode, setCliMode] = useState<"gh" | "git">("gh");

  // Load saved PAT
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (saved) {
        setPat(saved);
        validateToken(saved);
      }
    }
  }, []);

  useEffect(() => {
    if (projectName) {
      setRepoName(projectName);
    }
  }, [projectName]);

  const validateToken = async (tokenToTest: string) => {
    if (!tokenToTest.trim()) {
      setValidatedUser(null);
      setValidationError(null);
      return;
    }
    setIsValidating(true);
    setValidationError(null);

    const res = await validateGitHubToken(tokenToTest);
    setIsValidating(false);

    if (res.valid && res.user) {
      setValidatedUser(res.user);
      setValidationError(null);
    } else {
      setValidatedUser(null);
      setValidationError(res.error || "Invalid token");
    }
  };

  const handlePatChange = (val: string) => {
    setPat(val);
    if (val.trim().length > 10) {
      validateToken(val);
    } else {
      setValidatedUser(null);
      setValidationError(null);
    }
  };

  const handleStartPush = async () => {
    if (!pat.trim()) {
      setValidationError("Please enter your GitHub Personal Access Token.");
      return;
    }

    if (savePat && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_TOKEN, pat.trim());
    }

    await scaffoldGitHubRepo(
      pat,
      {
        repoName: repoName.trim() || projectName,
        description,
        isPrivate,
        files,
      },
      (p) => setProgress(p)
    );
  };

  const handleCopyCli = () => {
    const text = cliMode === "gh" ? buildGitHubCliScript(repoName, isPrivate) : buildFullGitSetupScript(repoName, isPrivate);
    navigator.clipboard.writeText(text);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl border-2 border-foreground bg-card text-card-foreground shadow-none my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-foreground px-5 py-4 bg-background">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-foreground bg-foreground text-background">
              <Github className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight">
                Direct GitHub Scaffolder
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                [ ZERO-FRICTION DEPLOYMENT ]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted border border-transparent hover:border-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 border-b border-foreground text-center font-mono text-xs uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("browser")}
            className={`py-3 px-4 border-r border-foreground transition-colors cursor-pointer ${
              activeTab === "browser"
                ? "bg-foreground text-background font-bold"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            1. Browser Direct Push (API)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cli")}
            className={`py-3 px-4 transition-colors cursor-pointer ${
              activeTab === "cli"
                ? "bg-foreground text-background font-bold"
                : "hover:bg-muted text-muted-foreground"
            }`}
          >
            2. Instant CLI Command (gh)
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === "browser" ? (
            <div className="space-y-5">
              {progress.stage === "completed" && progress.repoUrl ? (
                <div className="border-2 border-foreground p-6 bg-muted/20 text-center space-y-4 animate-fade-in">
                  <div className="inline-flex h-12 w-12 items-center justify-center border-2 border-foreground bg-foreground text-background">
                    <Check className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold">Repository Created Successfully!</h4>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                      All manifests and architecture configurations have been committed to main branch.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button asChild size="lg" className="gap-2">
                      <a href={progress.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        Open Repository on GitHub
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </Button>
                  </div>

                  <div className="text-left border border-foreground/40 p-4 mt-4 bg-background font-mono text-xs space-y-2">
                    <p className="font-bold uppercase tracking-wider text-foreground">
                      Recommended CI/CD Secrets to configure:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><code>DOCKER_REGISTRY_TOKEN</code> or GitHub Container Registry token</li>
                      <li><code>AWS_ACCESS_KEY_ID</code> & <code>AWS_SECRET_ACCESS_KEY</code></li>
                      <li><code>KUBECONFIG_DATA</code> (for remote cluster deployments)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {/* PAT Authentication */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="githubPat" className="font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <KeyRound className="h-3.5 w-3.5" />
                        GitHub Personal Access Token (PAT)
                      </Label>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=DevOps+Project+Generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono underline hover:text-foreground text-muted-foreground"
                      >
                        Generate Token (repo scope) →
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="githubPat"
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={pat}
                        onChange={(e) => handlePatChange(e.target.value)}
                        className="font-mono text-xs pr-10"
                        disabled={progress.stage === "committing_files"}
                      />
                      {isValidating && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-muted-foreground" />
                      )}
                    </div>

                    {validatedUser && (
                      <div className="flex items-center gap-2 text-xs font-mono text-foreground border border-foreground/30 p-2 bg-muted/30">
                        <span className="h-2 w-2 rounded-full bg-foreground" />
                        <span>Authenticated as: <strong>@{validatedUser.login}</strong> ({validatedUser.name || "GitHub User"})</span>
                      </div>
                    )}

                    {validationError && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-mono text-xs">{validationError}</AlertDescription>
                      </Alert>
                    )}

                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={savePat}
                        onChange={(e) => setSavePat(e.target.checked)}
                        className="rounded-none border-foreground h-3.5 w-3.5 accent-foreground"
                      />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Save token locally in browser storage for future projects
                      </span>
                    </label>
                  </div>

                  {/* Repository Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="repoName" className="font-mono text-xs uppercase tracking-wider">
                        Repository Name
                      </Label>
                      <Input
                        id="repoName"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        className="font-mono text-xs"
                        disabled={progress.stage === "committing_files"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-xs uppercase tracking-wider">Visibility</Label>
                      <div className="grid grid-cols-2 gap-2 h-9">
                        <button
                          type="button"
                          onClick={() => setIsPrivate(true)}
                          className={`flex items-center justify-center gap-1.5 border border-foreground text-xs font-mono uppercase cursor-pointer transition-colors ${
                            isPrivate ? "bg-foreground text-background font-bold" : "hover:bg-muted"
                          }`}
                        >
                          <Lock className="h-3.5 w-3.5" />
                          Private
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPrivate(false)}
                          className={`flex items-center justify-center gap-1.5 border border-foreground text-xs font-mono uppercase cursor-pointer transition-colors ${
                            !isPrivate ? "bg-foreground text-background font-bold" : "hover:bg-muted"
                          }`}
                        >
                          <Globe className="h-3.5 w-3.5" />
                          Public
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="font-mono text-xs uppercase tracking-wider">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="font-mono text-xs"
                      disabled={progress.stage === "committing_files"}
                    />
                  </div>

                  {/* Progress Indicator */}
                  {progress.stage !== "idle" && (
                    <div className="border border-foreground p-3 bg-muted/20 space-y-2">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          {progress.message}
                        </span>
                        <span className="font-bold">{progress.progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-border overflow-hidden">
                        <div
                          className="h-full bg-foreground transition-all duration-300"
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={progress.stage === "committing_files"}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStartPush}
                      disabled={!pat || isValidating || progress.stage === "committing_files"}
                      className="gap-2"
                    >
                      {progress.stage === "committing_files" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Pushing to GitHub...
                        </>
                      ) : (
                        <>
                          <Github className="h-4 w-4" />
                          Create & Push Repository
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* CLI Script Tab */
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="font-mono text-xs text-muted-foreground">
                  If you prefer working entirely in the terminal, run this command inside the unzipped folder to initialize Git, create the remote GitHub repo, and push with one step:
                </p>

                <div className="flex gap-2">
                  <Button
                    variant={cliMode === "gh" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCliMode("gh")}
                    className="font-mono text-xs"
                  >
                    GitHub CLI (gh)
                  </Button>
                  <Button
                    variant={cliMode === "git" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCliMode("git")}
                    className="font-mono text-xs"
                  >
                    Full Git Setup Script
                  </Button>
                </div>
              </div>

              <div className="border border-foreground bg-black text-white p-4 font-mono text-xs relative overflow-x-auto">
                <pre className="whitespace-pre">
                  {cliMode === "gh"
                    ? buildGitHubCliScript(repoName, isPrivate)
                    : buildFullGitSetupScript(repoName, isPrivate)}
                </pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-xs text-muted-foreground">
                  Requires <code>gh auth login</code> installed
                </span>
                <Button onClick={handleCopyCli} className="gap-2">
                  {copiedCli ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedCli ? "Copied to Clipboard!" : "Copy Command"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
