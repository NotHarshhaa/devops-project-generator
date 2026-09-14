"use client";

import { useState } from "react";
import { Copy, Check, Download, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CodeViewerProps {
  filename: string;
  path: string;
  content: string;
  language?: string;
  maxHeight?: string;
  className?: string;
}

export function CodeViewer({
  filename,
  path,
  content,
  language = "YAML",
  maxHeight = "500px",
  className = "",
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const lines = content.split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`border-2 border-foreground bg-background overflow-hidden w-full max-w-full ${className}`}>
      {/* Code Header Bar */}
      <div className="border-b-2 border-foreground bg-muted px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileCode className="h-4 w-4 text-foreground shrink-0" strokeWidth={1.5} />
          <span className="font-mono text-xs font-bold text-foreground truncate">
            {path}
          </span>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase shrink-0">
            {language}
          </Badge>
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline shrink-0">
            ({lines.length} lines)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 text-[10px] font-mono uppercase tracking-wider gap-1.5"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" strokeWidth={2} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" strokeWidth={1.5} />
                <span>Copy</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2.5 text-[10px] font-mono uppercase tracking-wider gap-1.5"
            title="Download this file"
          >
            <Download className="h-3 w-3" strokeWidth={1.5} />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div
        className="overflow-auto bg-background p-0 font-mono text-xs sm:text-[13px] leading-relaxed"
        style={{ maxHeight }}
      >
        <div className="flex min-w-full w-fit">
          {/* Line Numbers Gutter */}
          <div className="select-none py-3 px-3 bg-muted/40 border-r border-foreground/15 text-right font-mono text-muted-foreground/50 text-[11px] shrink-0 min-w-[3rem]">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual Code Content */}
          <pre className="py-3 px-4 text-foreground whitespace-pre overflow-x-visible leading-6 flex-1">
            {lines.map((line, i) => (
              <div key={i} className="hover:bg-muted/30">
                {formatCodeLine(line)}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Lightweight syntax styler for clean monochrome editorial presentation
function formatCodeLine(line: string) {
  if (line.trim().startsWith("#") || line.trim().startsWith("//")) {
    return <span className="text-muted-foreground italic">{line}</span>;
  }
  if (line.includes(": ") && !line.includes('"') && !line.includes("'")) {
    const parts = line.split(": ");
    return (
      <>
        <span className="font-bold">{parts[0]}:</span> {parts.slice(1).join(": ")}
      </>
    );
  }
  return line || "\u00A0";
}
