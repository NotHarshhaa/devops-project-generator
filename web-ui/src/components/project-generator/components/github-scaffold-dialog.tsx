"use client";

import { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
  Loader2,
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
  const [prevProjectName, setPrevProjectName] = useState(projectName);

  // Synchronize repoName when projectName prop changes (React recommended pattern)
  if (projectName !== prevProjectName) {
    setPrevProjectName(projectName);
    setRepoName(projectName || "my-devops-platform");
  }

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

  const validateToken = useCallback(async (tokenToTest: string) => {
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
  }, []);

  // Load saved PAT asynchronously after mount to avoid synchronous setState cascades
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (saved) {
        const timer = setTimeout(() => {
          setPat(saved);
          validateToken(saved);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [validateToken]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border/80 bg-card text-card-foreground shadow-2xl my-8 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-5 bg-card/60 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-indigo-600 text-white shadow-xs">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Direct GitHub Scaffolder
              </h3>
              <p className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">
                Instant Repository Provisioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-4 pb-0 bg-muted/20">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-muted/60 text-center font-medium text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("browser")}
              className={`py-2 px-4 rounded-lg transition-all cursor-pointer ${
                activeTab === "browser"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1. Browser Direct Push (API)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cli")}
              className={`py-2 px-4 rounded-lg transition-all cursor-pointer ${
                activeTab === "cli"
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2. Instant CLI Command (gh)
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === "browser" ? (
            <div className="space-y-5">
              {progress.stage === "completed" && progress.repoUrl ? (
                <div className="rounded-xl border border-emerald-500/30 p-6 bg-emerald-500/10 text-center space-y-4 animate-fade-in">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                    <Check className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">Repository Created Successfully!</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      All manifests and architecture configurations have been committed to main branch.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button asChild size="lg" className="gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                      <a href={progress.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        Open Repository on GitHub
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </Button>
                  </div>

                  <div className="text-left rounded-lg border border-border/80 p-4 mt-4 bg-card/80 font-mono text-xs space-y-2">
                    <p className="font-bold uppercase tracking-wider text-foreground">
                      Recommended CI/CD Secrets to configure:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li><code>DOCKER_REGISTRY_TOKEN</code> or GitHub Container Registry token</li>
                      <li><code>AWS_ACCESS_KEY_ID</code> &amp; <code>AWS_SECRET_ACCESS_KEY</code></li>
                      <li><code>KUBECONFIG_DATA</code> (for remote cluster deployments)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {/* PAT Authentication */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="githubPat" className="font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                        <KeyRound className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        GitHub Personal Access Token (PAT)
                      </Label>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=DevOps+Project+Generator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline"
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
                        className="font-mono text-xs pr-10 rounded-lg"
                        disabled={progress.stage === "committing_files"}
                      />
                      {isValidating && (
                        <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-muted-foreground" />
                      )}
                    </div>

                    {validatedUser && (
                      <div className="flex items-center gap-2 text-xs font-mono text-foreground rounded-lg border border-border/80 p-2.5 bg-muted/40">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span>Authenticated as: <strong>@{validatedUser.login}</strong> ({validatedUser.name || "GitHub User"})</span>
                      </div>
                    )}

                    {validationError && (
                      <Alert variant="destructive" className="py-2 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="font-mono text-xs">{validationError}</AlertDescription>
                      </Alert>
                    )}

                    <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={savePat}
                        onChange={(e) => setSavePat(e.target.checked)}
                        className="rounded-md border-border h-4 w-4 text-cyan-600 accent-cyan-600"
                      />
                      <span className="text-[11px] text-muted-foreground">
                        Save token locally in browser storage for future projects
                      </span>
                    </label>
                  </div>

                  {/* Repository Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="repoName" className="font-mono text-xs uppercase tracking-wider text-foreground">
                        Repository Name
                      </Label>
                      <Input
                        id="repoName"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        className="font-mono text-xs rounded-lg"
                        disabled={progress.stage === "committing_files"}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-xs uppercase tracking-wider text-foreground">Visibility</Label>
                      <div className="grid grid-cols-2 gap-2 h-9">
                        <button
                          type="button"
                          onClick={() => setIsPrivate(true)}
                          className={`flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                            isPrivate
                              ? "bg-brand text-brand-foreground border-brand font-semibold shadow-xs"
                              : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <Lock className="h-3.5 w-3.5" />
                          Private
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPrivate(false)}
                          className={`flex items-center justify-center gap-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                            !isPrivate
                              ? "bg-brand text-brand-foreground border-brand font-semibold shadow-xs"
                              : "border-border hover:bg-muted text-muted-foreground"
                          }`}
                        >
                          <Globe className="h-3.5 w-3.5" />
                          Public
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="font-mono text-xs uppercase tracking-wider text-foreground">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="font-mono text-xs rounded-lg"
                      disabled={progress.stage === "committing_files"}
                    />
                  </div>

                  {/* Progress Indicator */}
                  {progress.stage !== "idle" && (
                    <div className="rounded-xl border border-border/80 p-4 bg-muted/30 space-y-2.5">
                      <div className="flex justify-between font-mono text-xs">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-500" />
                          {progress.message}
                        </span>
                        <span className="font-bold text-foreground">{progress.progressPercent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-cyan-500 to-indigo-500 transition-all duration-300 rounded-full"
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={progress.stage === "committing_files"} className="rounded-lg">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStartPush}
                      disabled={!pat || isValidating || progress.stage === "committing_files"}
                      className="gap-2 rounded-lg bg-brand hover:bg-brand/90 text-brand-foreground font-semibold"
                    >
                      {progress.stage === "committing_files" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Pushing to GitHub...
                        </>
                      ) : (
                        <>
                          <Github className="h-4 w-4" />
                          Create &amp; Push Repository
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
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you prefer working entirely in the terminal, run this command inside the unzipped folder to initialize Git, create the remote GitHub repo, and push with one step:
                </p>

                <div className="flex gap-2">
                  <Button
                    variant={cliMode === "gh" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCliMode("gh")}
                    className="font-mono text-xs rounded-lg"
                  >
                    GitHub CLI (gh)
                  </Button>
                  <Button
                    variant={cliMode === "git" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCliMode("git")}
                    className="font-mono text-xs rounded-lg"
                  >
                    Full Git Setup Script
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border/80 bg-zinc-950 text-emerald-400 p-4 font-mono text-xs relative overflow-x-auto shadow-inner">
                <pre className="whitespace-pre">
                  {cliMode === "gh"
                    ? buildGitHubCliScript(repoName, isPrivate)
                    : buildFullGitSetupScript(repoName, isPrivate)}
                </pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-xs text-muted-foreground">
                  Requires <code className="text-foreground">gh auth login</code> installed
                </span>
                <Button onClick={handleCopyCli} className="gap-2 rounded-lg bg-brand hover:bg-brand/90 text-brand-foreground font-semibold">
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
