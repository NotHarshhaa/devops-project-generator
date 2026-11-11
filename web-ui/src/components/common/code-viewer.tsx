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
    <div className={`rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-xl overflow-hidden w-full max-w-full font-mono ${className}`}>
      {/* Code Header Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <FileCode className="h-4 w-4 text-cyan-400 shrink-0" strokeWidth={1.8} />
          <span className="font-semibold text-slate-200 truncate">
            {path}
          </span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono uppercase shrink-0 border-slate-700 text-slate-300">
            {language}
          </Badge>
          <span className="text-[10px] text-slate-500 hidden sm:inline shrink-0">
            ({lines.length} lines)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5 rounded-md"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                <span className="text-emerald-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Copy</span>
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5 rounded-md"
            title="Download this file"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* Code Body with Line Numbers */}
      <div
        className="overflow-auto bg-slate-950 p-0 text-xs sm:text-[13px] leading-relaxed"
        style={{ maxHeight }}
      >
        <div className="flex min-w-full w-fit">
          {/* Line Numbers Gutter */}
          <div className="select-none py-3 px-3 bg-slate-900/40 border-r border-slate-800/80 text-right font-mono text-slate-600 text-[11px] shrink-0 min-w-[3rem]">
            {lines.map((_, i) => (
              <div key={i} className="leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual Code Content */}
          <pre className="py-3 px-4 text-slate-200 whitespace-pre overflow-x-visible leading-6 flex-1 font-mono">
            {lines.map((line, i) => (
              <div key={i} className="hover:bg-slate-900/40 rounded-sm px-1 -mx-1">
                {formatCodeLine(line)}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Lightweight syntax styler
function formatCodeLine(line: string) {
  if (line.trim().startsWith("#") || line.trim().startsWith("//")) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (line.includes(": ") && !line.includes('"') && !line.includes("'")) {
    const colonIndex = line.indexOf(": ");
    const key = line.slice(0, colonIndex);
    const value = line.slice(colonIndex + 2);
    return (
      <>
        <span className="text-cyan-400 font-medium">{key}:</span>{" "}
        <span className="text-slate-100">{value}</span>
      </>
    );
  }
  return line || "\u00A0";
}
