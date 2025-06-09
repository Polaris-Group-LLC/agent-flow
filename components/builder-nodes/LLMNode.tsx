"use client";
import React, { memo, ChangeEvent } from "react";
import { Handle, Position, NodeProps } from "reactflow";

export interface LLMNodeData {
  label?: string;
  systemPrompt?: string;
  apiKey?: string;
  modelProvider?: "openai" | "anthropic" | "google";
  modelName?: string;
  onNodeDataChange?: (
    id: string,
    data: Partial<Omit<LLMNodeData, "onNodeDataChange">>
  ) => void;
  width?: number;
}

const modelOptions = {
  openai: ["gpt-4o", "gpt-4.1", "o3-mini"],
  anthropic: [
    "claude-3-5-sonnet-20240620",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  google: [
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash-latest",
    "gemini-1.0-pro",
  ],
};

interface LLMNodeProps extends NodeProps<LLMNodeData> {
  onCopyApiKeyToAllLLMs?: (apiKey: string) => void;
}

const LLMNode: React.FC<LLMNodeProps> = ({
  id,
  data,
  isConnectable,
  onCopyApiKeyToAllLLMs,
}) => {
  const {
    label = "LLM Node",
    systemPrompt = "",
    apiKey = "",
    modelProvider = "openai",
    modelName = modelOptions.openai[0],
    width = 160,
  } = data;

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    let newData: Partial<LLMNodeData> = { [name]: value };

    if (name === "modelProvider") {
      const newProvider = value as keyof typeof modelOptions;
      if (modelOptions[newProvider] && modelOptions[newProvider].length > 0) {
        newData.modelName = modelOptions[newProvider][0];
      } else {
        newData.modelName = undefined;
      }
    }

    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, newData);
    }
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
        width: width,
        maxWidth: 180,
        color: "var(--foreground)",
        fontSize: "0.85rem",
      }}
    >
      <div
        style={{
          padding: "0.5rem",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        <input
          type="text"
          name="label"
          value={label}
          onChange={handleInputChange}
          onPaste={(e) => e.stopPropagation()}
          style={{
            fontSize: "0.85rem",
            fontWeight: "500",
            color: "var(--foreground)",
            background: "transparent",
            outline: "none",
            border: "none",
            width: "100%",
            padding: "0.15rem",
          }}
          className="focus:ring-1 focus:ring-foreground/50 rounded"
          placeholder="Node Label"
        />
      </div>
      <div
        style={{
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div>
          <label htmlFor={`modelProvider-${id}`} style={labelStyle}>
            Model Provider
          </label>
          <select
            id={`modelProvider-${id}`}
            name="modelProvider"
            value={modelProvider || "openai"}
            onChange={handleInputChange}
            style={inputStyle}
            className="focus:ring-1 focus:ring-foreground/50 cursor-pointer"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="google">Google</option>
          </select>
        </div>
        <div>
          <label htmlFor={`modelName-${id}`} style={labelStyle}>
            Model Name
          </label>
          <select
            id={`modelName-${id}`}
            name="modelName"
            value={modelName || modelOptions[modelProvider || "openai"][0]}
            onChange={handleInputChange}
            style={inputStyle}
            className="focus:ring-1 focus:ring-foreground/50 cursor-pointer"
            disabled={!modelOptions[modelProvider || "openai"]?.length}
          >
            {(modelOptions[modelProvider || "openai"] || []).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
            {!modelOptions[modelProvider || "openai"]?.length && (
              <option value="" disabled>
                No models available for this provider
              </option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor={`systemPrompt-${id}`} style={labelStyle}>
            System Prompt
          </label>
          <textarea
            id={`systemPrompt-${id}`}
            name="systemPrompt"
            value={systemPrompt ?? ""}
            onChange={handleInputChange}
            onPaste={(e) => e.stopPropagation()}
            rows={2}
            style={inputStyle}
            className="focus:ring-1 focus:ring-foreground/50"
            placeholder="e.g., You are a helpful assistant."
          />
        </div>
        <div>
          <label htmlFor={`apiKey-${id}`} style={labelStyle}>
            API Key
          </label>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
          >
            <input
              id={`apiKey-${id}`}
              type="password"
              name="apiKey"
              value={apiKey || ""}
              onChange={handleInputChange}
              onPaste={(e) => e.stopPropagation()}
              style={inputStyle}
              className="focus:ring-1 focus:ring-foreground/50"
              placeholder="Enter API Key..."
            />
            {apiKey && onCopyApiKeyToAllLLMs && (
              <button
                type="button"
                title="Copy API Key to all LLM Nodes"
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
                onClick={() => onCopyApiKeyToAllLLMs(apiKey)}
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

export default memo(LLMNode);
