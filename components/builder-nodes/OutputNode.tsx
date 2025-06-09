"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { LogOut, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface OutputNodeData {
  label?: string;
  agentOutput?: string;
  width?: number;
}

const OutputNode: React.FC<NodeProps<OutputNodeData>> = ({
  data,
  isConnectable,
}) => {
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.style.height = "auto";
      outputRef.current.style.height = outputRef.current.scrollHeight + "px";
    }
  }, [data.agentOutput]);

  const handleCopy = () => {
    if (data.agentOutput) {
      navigator.clipboard.writeText(data.agentOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleOutputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOutputMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        background: "hsl(var(--background) / 0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid hsl(var(--border))",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.2)",
        width: data.width || 700,
        maxWidth: 700,
        color: "var(--foreground)",
        fontSize: "0.85rem",
      }}
    >
      <div
        className="drag"
        style={{
          padding: "0.5rem",
          borderBottom: "1px solid hsl(var(--border))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "move",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <LogOut size={16} style={{ color: "var(--foreground)" }} />
          <span style={{ fontWeight: 500 }}>{data.label ?? "Output Node"}</span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: "0.25rem",
            borderRadius: "0.25rem",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          title="Copy output"
        >
          <Copy size={15} style={{ color: "var(--foreground)" }} />
        </button>
      </div>
      <div
        onClick={handleOutputClick}
        onMouseDown={handleOutputMouseDown}
        className="nodrag nowheel"
        style={{
          padding: "0.75rem",
          minHeight: 40,
          maxHeight: 300,
          overflowY: "auto",
          background: "hsl(var(--foreground) / 0.05)",
          userSelect: "text",
          cursor: "text",
        }}
        ref={outputRef}
      >
        {data.agentOutput ? (
          <div
            className="nodrag nowheel"
            style={{
              color: "var(--foreground)",
              fontSize: "0.75rem",
              lineHeight: 1.5,
              fontFamily: "monospace",
            }}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p style={{ margin: "0.5em 0" }}>{children}</p>
                ),
                code: ({ children }) => (
                  <code
                    style={{
                      color: "var(--foreground)",
                      background: "hsl(var(--foreground) / 0.1)",
                      padding: "0.2em 0.4em",
                      borderRadius: "0.2em",
                    }}
                  >
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre
                    style={{
                      background: "hsl(var(--foreground) / 0.1)",
                      padding: "0.75em",
                      borderRadius: "0.4em",
                      margin: "0.75em 0",
                    }}
                  >
                    {children}
                  </pre>
                ),
                ul: ({ children }) => (
                  <ul style={{ paddingLeft: "1.5em", margin: "0.5em 0" }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ paddingLeft: "1.5em", margin: "0.5em 0" }}>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li style={{ margin: "0.25em 0" }}>{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    style={{
                      color: "var(--foreground)",
                      textDecoration: "underline",
                    }}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {data.agentOutput}
            </ReactMarkdown>
          </div>
        ) : (
          <span
            style={{
              color: "hsl(var(--foreground) / 0.6)",
              fontStyle: "italic",
            }}
          >
            No output yet.
          </span>
        )}
        {copied && (
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "0.75rem",
              color: "#4ade80",
            }}
          >
            Copied!
          </span>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        isConnectable={isConnectable}
        style={{
          background: "var(--foreground)",
          width: "0.75rem",
          height: "0.75rem",
        }}
      />
    </div>
  );
};

export default memo(OutputNode);
