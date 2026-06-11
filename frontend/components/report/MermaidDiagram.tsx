"use client";

import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      render: (id: string, text: string) => Promise<{ svg: string }>;
    };
  }
}

const MERMAID_CDN = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
let mermaidLoadPromise: Promise<void> | null = null;

function loadMermaid() {
  if (typeof window === "undefined") return Promise.reject(new Error("window is not available"));
  if (window.mermaid) return Promise.resolve();

  mermaidLoadPromise ??= new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src=\"${MERMAID_CDN}\"]`);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Mermaid 스크립트를 불러오지 못했습니다.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = MERMAID_CDN;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Mermaid 스크립트를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return mermaidLoadPromise;
}

type MermaidDiagramProps = {
  code: string;
};

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const mounted = useRef(true);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mounted.current = true;

    loadMermaid()
      .then(async () => {
        if (!window.mermaid) throw new Error("Mermaid 객체가 초기화되지 않았습니다.");

        window.mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            background: "#ffffff",
            primaryColor: "#f8fafc",
            primaryTextColor: "#111827",
            primaryBorderColor: "#111827",
            lineColor: "#374151",
            secondaryColor: "#ffffff",
            tertiaryColor: "#f3f4f6",
            fontFamily: "Inter, system-ui, sans-serif"
          }
        });

        const result = await window.mermaid.render(`report-mermaid-${id}`, code);
        if (mounted.current) {
          setSvg(result.svg);
          setError(null);
        }
      })
      .catch((renderError: Error) => {
        if (mounted.current) {
          setError(renderError.message);
          setSvg(null);
        }
      });

    return () => {
      mounted.current = false;
    };
  }, [code, id]);

  if (svg) {
    return (
      <figure className="report-diagram" aria-label="Mermaid 다이어그램">
        <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />
      </figure>
    );
  }

  return (
    <figure className="report-diagram report-diagram-fallback" aria-label="Mermaid 다이어그램 대체 표시">
      <div className="mb-3 flex items-center justify-between border-b border-neutral-300 pb-2 text-sm font-semibold text-neutral-800">
        <span>Diagram</span>
        <span className="text-xs font-medium text-neutral-500">{error ? "Fallback" : "Rendering..."}</span>
      </div>
      {error ? <p className="mb-3 text-sm text-neutral-600">Mermaid 렌더링 실패: {error}</p> : null}
      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-neutral-800"><code>{code}</code></pre>
    </figure>
  );
}
