import { useEffect, useId, useState } from "react";

let mermaidPromise;

const getMermaid = () => {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        htmlLabels: false,
        theme: "dark",
      });
      return mermaid;
    });
  }

  return mermaidPromise;
};

const MermaidDiagram = ({ chart }) => {
  const diagramId = `mermaid-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [result, setResult] = useState({ chart: "", svg: "", error: false });

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(async () => {
      try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render(diagramId, chart);
        if (active) setResult({ chart, svg, error: false });
      } catch (error) {
        console.error("Mermaid diagram render failed:", error);
        if (active) setResult({ chart, svg: "", error: true });
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [chart, diagramId]);

  if (result.chart !== chart) return <p className="mermaid-status">Rendering diagram…</p>;
  if (result.error) {
    return <p className="mermaid-error" role="status">Unable to render this diagram. Please check its Mermaid syntax.</p>;
  }

  return <div className="mermaid-diagram" role="img" aria-label="Mermaid diagram" dangerouslySetInnerHTML={{ __html: result.svg }} />;
};

export default MermaidDiagram;
