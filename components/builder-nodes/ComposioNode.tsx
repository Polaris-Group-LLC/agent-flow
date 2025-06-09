"use client";
import React, { memo, ChangeEvent, useState, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import ToolsWindow from "./ToolsWindow";

export interface ComposioNodeData {
  label?: string;
  composioApiKey?: string;
  toolActions?: string; // comma-separated actions, e.g., "gmail.send_email,github.create_issue"
  onNodeDataChange?: (
    id: string,
    data: Partial<Omit<ComposioNodeData, "onNodeDataChange">>
  ) => void;
}

interface ComposioNodeProps extends NodeProps<ComposioNodeData> {
  onOpenToolsWindow?: (apiKey?: string) => void;
  onCopyApiKeyToAllComposioNodes?: (apiKey: string) => void;
}

const toolkitOptions = [
  { slug: "gmail", name: "Gmail" },
  { slug: "github", name: "GitHub" },
  { slug: "slack", name: "Slack" },
  { slug: "notion", name: "Notion" },
  { slug: "google_drive", name: "Google Drive" },
  // Add more toolkits as needed
];

const ComposioNode: React.FC<
  ComposioNodeProps & { _forceRerender?: number }
> = ({
  id,
  data,
  isConnectable,
  onOpenToolsWindow,
  onCopyApiKeyToAllComposioNodes,
  _forceRerender,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localComposioApiKey, setLocalComposioApiKey] = useState(
    data.composioApiKey || ""
  );
  const selectedActionsList = (data.toolActions || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  useEffect(() => {
    setLocalComposioApiKey(data.composioApiKey || "");
  }, [data.composioApiKey]);

  const handleNodeConfigChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    if (name === "composioApiKey") {
      setLocalComposioApiKey(value);
    }
    if (data.onNodeDataChange) data.onNodeDataChange(id, { [name]: value });
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    fontSize: "0.75rem",
    color: "var(--foreground)",
    background: "hsl(var(--foreground) / 0.05)",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.375rem",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "hsl(var(--foreground) / 0.7)",
    marginBottom: "0.25rem",
  };

  return (
    <div
      style={{
        background: "hsl(var(--background) / 0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid hsl(var(--border))",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.2)",
        minWidth: "14rem",
        maxWidth: "36rem",
        width: "fit-content",
        color: "var(--foreground)",
      }}
    >
      <div
        style={{
          padding: "0.75rem",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <input
          type="text"
          name="label"
          value={data.label ?? "Composio Tool"}
          onChange={handleNodeConfigChange}
          onPaste={(e) => e.stopPropagation()}
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "var(--foreground)",
            background: "transparent",
            outline: "none",
            border: "none",
            width: "100%",
            padding: "0.25rem",
          }}
          className="focus:ring-1 focus:ring-foreground/50 rounded"
          placeholder="Node Label"
        />
      </div>
      <div
        style={{
          padding: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <div>
          {!data.composioApiKey && (
            <div className="mb-3 flex items-center gap-2 bg-gradient-to-r from-red-500 via-red-600 to-pink-500 text-white rounded-lg px-4 py-2 shadow-lg border border-red-300/40 animate-fade-in">
              <svg
                className="w-5 h-5 text-white/90"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              <span className="font-medium text-sm">
                You must provide a{" "}
                <span className="underline">Composio API key</span> to use
                tools.
              </span>
            </div>
          )}
          <label htmlFor={`composioApiKey-${id}`} style={labelStyle}>
            Composio API Key
          </label>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <input
              id={`composioApiKey-${id}`}
              type="password"
              name="composioApiKey"
              value={localComposioApiKey}
              onChange={handleNodeConfigChange}
              onPaste={(e) => {
                e.stopPropagation();
              }}
              style={inputStyle}
              className="focus:ring-1 focus:ring-foreground/50"
              placeholder="your api key"
            />
            {data.composioApiKey && onCopyApiKeyToAllComposioNodes && (
              <button
                type="button"
                title="Copy API Key to all Composio Nodes"
                style={{
                  background: "hsl(var(--foreground) / 0.1)",
                  border: "1.5px solid hsl(var(--border))",
                  borderRadius: "0.4rem",
                  padding: "0 0.6rem",
                  marginLeft: "0.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                  backdropFilter: "blur(8px)",
                  color: "var(--foreground)",
                  fontSize: "0.95em",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  height: "2.25rem",
                  minHeight: "2.25rem",
                }}
                onClick={() =>
                  onCopyApiKeyToAllComposioNodes(data.composioApiKey!)
                }
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="7" y="7" width="10" height="10" rx="2" />
                  <rect x="3" y="3" width="10" height="10" rx="2" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <label style={labelStyle}>Available Actions</label>
          </div>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              ...inputStyle,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="hover:bg-foreground/10 focus:bg-foreground/10 transition-colors duration-150"
          >
            <span style={{ color: "hsl(var(--foreground) / 0.6)" }}>
              Select an action...
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {showDropdown && (
            <div
              className="absolute left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-20 max-h-48 overflow-y-auto"
              style={{ fontSize: "0.85em" }}
            >
              <div
                className="px-3 py-2 cursor-pointer hover:bg-foreground/10 text-foreground font-medium border-b border-border"
                onClick={() => {
                  if (
                    data.composioApiKey !== localComposioApiKey &&
                    data.onNodeDataChange
                  ) {
                    data.onNodeDataChange(id, {
                      composioApiKey: localComposioApiKey,
                    });
                  }
                  if (onOpenToolsWindow) onOpenToolsWindow(localComposioApiKey);
                  setShowDropdown(false);
                }}
              >
                + Add Tool
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedActionsList.map((actionKey) => (
              <div
                key={actionKey}
                className="bg-foreground/10 text-foreground rounded-full px-3 py-1 text-xs flex items-center gap-1.5"
              >
                <button
                  type="button"
                  className="text-foreground hover:text-foreground/80 leading-none mr-1.5"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1em",
                    padding: "0",
                  }}
                  onClick={() => {
                    const updated = selectedActionsList.filter(
                      (a) => a !== actionKey
                    );
                    if (data.onNodeDataChange)
                      data.onNodeDataChange(id, {
                        toolActions: updated.join(","),
                      });
                  }}
                  aria-label={`Remove ${actionKey}`}
                >
                  ×
                </button>
                {actionKey}
              </div>
            ))}
          </div>
        </div>
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
      <Handle
        type="source"
        position={Position.Right}
        id="output"
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

export default memo(ComposioNode);
