"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody,
  useDisclosure,
  Kbd,
  Spinner,
  Chip,
  Avatar,
  ScrollShadow
} from "@heroui/react";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Sparkles, 
  Plus, 
  Zap, 
  Brain, 
  Workflow, 
  ChevronRight,
  Bot,
  FileText,
  GitBranch,
  BarChart,
  Repeat,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommandBarProps {
  onCreateWorkflow: (nodes: any[], edges: any[]) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentNodes?: any[];
  currentEdges?: any[];
}

interface Command {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: () => void;
  category?: string;
  keywords?: string[];
}

interface WorkflowPreview {
  nodes: any[];
  edges: any[];
  description: string;
}

const getContextualSuggestions = (nodes: any[], edges: any[], onCreateWorkflow: (nodes: any[], edges: any[]) => void): Command[] => {
  const suggestions: Command[] = [];
  
  // Analyze current workflow
  const hasInput = nodes.some(n => n.type === 'customInput' || n.type === 'input');
  const hasOutput = nodes.some(n => n.type === 'customOutput' || n.type === 'output');
  const hasLLM = nodes.some(n => n.type === 'llm');
  const hasAgent = nodes.some(n => n.type === 'agent');
  const hasComposio = nodes.some(n => n.type === 'composio');
  const nodeCount = nodes.length;
  
  // Calculate next position based on existing nodes
  const getNextPosition = () => {
    if (nodes.length === 0) return { x: 100, y: 100 };
    const maxX = Math.max(...nodes.map(n => n.position.x));
    return { x: maxX + 200, y: 100 };
  };
  
  // Suggest missing essential nodes
  if (!hasInput && nodeCount > 0) {
    suggestions.push({
      id: 'suggest-input',
      title: 'Add Input Node',
      description: 'Your workflow needs an input to receive data',
      icon: <FileText className="w-4 h-4" />,
      category: 'Suggested',
      keywords: ['input', 'start', 'data'],
      action: () => {
        const newNode = {
          id: `input-${Date.now()}`,
          type: 'customInput',
          position: { x: 50, y: 100 },
          data: { label: 'Input', query: '' }
        };
        onCreateWorkflow([newNode], []);
      }
    });
  }
  
  if (!hasOutput && nodeCount > 2) {
    const pos = getNextPosition();
    suggestions.push({
      id: 'suggest-output',
      title: 'Add Output Node',
      description: 'Complete your workflow with an output node',
      icon: <FileText className="w-4 h-4" />,
      category: 'Suggested',
      keywords: ['output', 'end', 'result'],
      action: () => {
        const newNode = {
          id: `output-${Date.now()}`,
          type: 'customOutput',
          position: pos,
          data: { label: 'Output' }
        };
        onCreateWorkflow([newNode], []);
      }
    });
  }
  
  // Suggest patterns based on current setup
  if (hasLLM && !hasAgent && nodeCount < 5) {
    suggestions.push({
      id: 'suggest-agent',
      title: 'Upgrade to Agent',
      description: 'Add an AI agent for tool access and reasoning',
      icon: <Bot className="w-4 h-4" />,
      category: 'Suggested',
      keywords: ['agent', 'tools', 'reasoning'],
      action: () => {
        const pos = getNextPosition();
        const newNode = {
          id: `agent-${Date.now()}`,
          type: 'agent',
          position: pos,
          data: { label: 'AI Agent', content: 'You are a helpful AI agent.' }
        };
        onCreateWorkflow([newNode], []);
      }
    });
  }
  
  if (nodeCount >= 3 && !hasComposio) {
    suggestions.push({
      id: 'suggest-tools',
      title: 'Add External Tools',
      description: 'Enhance with Composio tool integrations',
      icon: <Zap className="w-4 h-4" />,
      category: 'Suggested',
      keywords: ['tools', 'composio', 'integration'],
      action: () => {
        const pos = getNextPosition();
        const newNode = {
          id: `composio-${Date.now()}`,
          type: 'composio',
          position: pos,
          data: { label: 'Composio Tools', selectedActions: [] }
        };
        onCreateWorkflow([newNode], []);
      }
    });
  }
  
  if (nodeCount >= 4 && edges.length < nodeCount - 1) {
    suggestions.push({
      id: 'suggest-parallel',
      title: 'Try Parallel Processing',
      description: 'Process multiple tasks simultaneously',
      icon: <Workflow className="w-4 h-4" />,
      category: 'Suggested',
      keywords: ['parallel', 'concurrent', 'speed'],
      action: () => {
        // Create parallel pattern
        const baseX = 100;
        const baseY = 100;
        const nodes = [
          { id: `input-${Date.now()}`, type: 'customInput', position: { x: baseX, y: baseY + 100 }, data: { label: 'Input' } },
          { id: `llm1-${Date.now()}`, type: 'llm', position: { x: baseX + 200, y: baseY }, data: { label: 'Process 1' } },
          { id: `llm2-${Date.now()}`, type: 'llm', position: { x: baseX + 200, y: baseY + 200 }, data: { label: 'Process 2' } },
          { id: `output-${Date.now()}`, type: 'customOutput', position: { x: baseX + 400, y: baseY + 100 }, data: { label: 'Output' } }
        ];
        const edges = [
          { id: `e1-${Date.now()}`, source: nodes[0].id, target: nodes[1].id },
          { id: `e2-${Date.now()}`, source: nodes[0].id, target: nodes[2].id },
          { id: `e3-${Date.now()}`, source: nodes[1].id, target: nodes[3].id },
          { id: `e4-${Date.now()}`, source: nodes[2].id, target: nodes[3].id }
        ];
        onCreateWorkflow(nodes, edges);
      }
    });
  }
  
  return suggestions;
};

const QUICK_COMMANDS: Command[] = [
  {
    id: 'add-llm',
    title: 'Add LLM Node',
    description: 'Add an AI language model to your workflow',
    icon: <Brain className="w-4 h-4" />,
    category: 'Nodes',
    keywords: ['ai', 'gpt', 'claude', 'model']
  },
  {
    id: 'add-agent',
    title: 'Add Agent Node',
    description: 'Add an AI agent with tool access',
    icon: <Bot className="w-4 h-4" />,
    category: 'Nodes',
    keywords: ['agent', 'tools', 'composio']
  },
  {
    id: 'add-tool',
    title: 'Add Tool Node',
    description: 'Add external tool integration',
    icon: <Zap className="w-4 h-4" />,
    category: 'Nodes',
    keywords: ['tool', 'api', 'integration']
  },
  {
    id: 'pattern-routing',
    title: 'Routing Pattern',
    description: 'Create a conditional workflow router',
    icon: <GitBranch className="w-4 h-4" />,
    category: 'Patterns',
    keywords: ['route', 'conditional', 'branch']
  },
  {
    id: 'pattern-chain',
    title: 'Chain Pattern',
    description: 'Create a sequential processing chain',
    icon: <ArrowRight className="w-4 h-4" />,
    category: 'Patterns',
    keywords: ['chain', 'sequence', 'pipeline']
  },
  {
    id: 'pattern-parallel',
    title: 'Parallel Pattern',
    description: 'Process multiple tasks simultaneously',
    icon: <Workflow className="w-4 h-4" />,
    category: 'Patterns',
    keywords: ['parallel', 'concurrent', 'multi']
  }
];

export function CommandBar({ onCreateWorkflow, isOpen, onOpenChange, currentNodes = [], currentEdges = [] }: CommandBarProps) {
  const { isOpen: internalOpen, onOpen, onClose, onOpenChange: internalOnOpenChange } = useDisclosure();
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<WorkflowPreview | null>(null);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle controlled/uncontrolled state
  const modalOpen = isOpen !== undefined ? isOpen : internalOpen;
  const handleOpenChange = onOpenChange || internalOnOpenChange;

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (modalOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, onOpen, onClose]);

  // Get contextual suggestions
  const contextualSuggestions = getContextualSuggestions(currentNodes, currentEdges, onCreateWorkflow);
  
  // Add actions to quick commands
  const quickCommandsWithActions = QUICK_COMMANDS.map(cmd => ({
    ...cmd,
    action: () => {
      const timestamp = Date.now();
      switch(cmd.id) {
        case 'add-llm':
          onCreateWorkflow([{
            id: `llm-${timestamp}`,
            type: 'llm',
            position: { x: 250, y: 100 },
            data: { label: 'LLM Node' }
          }], []);
          break;
        case 'add-agent':
          onCreateWorkflow([{
            id: `agent-${timestamp}`,
            type: 'agent',
            position: { x: 250, y: 100 },
            data: { label: 'AI Agent', content: 'You are a helpful AI agent.' }
          }], []);
          break;
        case 'add-tool':
          onCreateWorkflow([{
            id: `composio-${timestamp}`,
            type: 'composio',
            position: { x: 250, y: 100 },
            data: { label: 'Tool Node', selectedActions: [] }
          }], []);
          break;
        case 'pattern-routing':
          const routingNodes = [
            { id: `input-${timestamp}`, type: 'customInput', position: { x: 100, y: 200 }, data: { label: 'Input' } },
            { id: `router-${timestamp}`, type: 'llm', position: { x: 300, y: 200 }, data: { label: 'Router' } },
            { id: `agent1-${timestamp}`, type: 'agent', position: { x: 500, y: 100 }, data: { label: 'Agent 1' } },
            { id: `agent2-${timestamp}`, type: 'agent', position: { x: 500, y: 300 }, data: { label: 'Agent 2' } },
            { id: `output-${timestamp}`, type: 'customOutput', position: { x: 700, y: 200 }, data: { label: 'Output' } }
          ];
          const routingEdges = [
            { id: `e1-${timestamp}`, source: routingNodes[0].id, target: routingNodes[1].id },
            { id: `e2-${timestamp}`, source: routingNodes[1].id, target: routingNodes[2].id },
            { id: `e3-${timestamp}`, source: routingNodes[1].id, target: routingNodes[3].id },
            { id: `e4-${timestamp}`, source: routingNodes[2].id, target: routingNodes[4].id },
            { id: `e5-${timestamp}`, source: routingNodes[3].id, target: routingNodes[4].id }
          ];
          onCreateWorkflow(routingNodes, routingEdges);
          break;
        case 'pattern-chain':
          const chainNodes = [
            { id: `input-${timestamp}`, type: 'customInput', position: { x: 100, y: 100 }, data: { label: 'Input' } },
            { id: `agent1-${timestamp}`, type: 'agent', position: { x: 300, y: 100 }, data: { label: 'Agent 1' } },
            { id: `agent2-${timestamp}`, type: 'agent', position: { x: 500, y: 100 }, data: { label: 'Agent 2' } },
            { id: `output-${timestamp}`, type: 'customOutput', position: { x: 700, y: 100 }, data: { label: 'Output' } }
          ];
          const chainEdges = [
            { id: `e1-${timestamp}`, source: chainNodes[0].id, target: chainNodes[1].id },
            { id: `e2-${timestamp}`, source: chainNodes[1].id, target: chainNodes[2].id },
            { id: `e3-${timestamp}`, source: chainNodes[2].id, target: chainNodes[3].id }
          ];
          onCreateWorkflow(chainNodes, chainEdges);
          break;
        case 'pattern-parallel':
          const parallelNodes = [
            { id: `input-${timestamp}`, type: 'customInput', position: { x: 100, y: 200 }, data: { label: 'Input' } },
            { id: `llm1-${timestamp}`, type: 'llm', position: { x: 300, y: 100 }, data: { label: 'LLM 1' } },
            { id: `llm2-${timestamp}`, type: 'llm', position: { x: 300, y: 300 }, data: { label: 'LLM 2' } },
            { id: `output-${timestamp}`, type: 'customOutput', position: { x: 500, y: 200 }, data: { label: 'Output' } }
          ];
          const parallelEdges = [
            { id: `e1-${timestamp}`, source: parallelNodes[0].id, target: parallelNodes[1].id },
            { id: `e2-${timestamp}`, source: parallelNodes[0].id, target: parallelNodes[2].id },
            { id: `e3-${timestamp}`, source: parallelNodes[1].id, target: parallelNodes[3].id },
            { id: `e4-${timestamp}`, source: parallelNodes[2].id, target: parallelNodes[3].id }
          ];
          onCreateWorkflow(parallelNodes, parallelEdges);
          break;
      }
    }
  }));
  
  const allCommands = [...contextualSuggestions, ...quickCommandsWithActions];
  
  // Filter commands based on query
  useEffect(() => {
    if (!query) {
      setFilteredCommands(allCommands);
      return;
    }

    const searchQuery = query.toLowerCase();
    const filtered = allCommands.filter(cmd => 
      cmd.title.toLowerCase().includes(searchQuery) ||
      cmd.description?.toLowerCase().includes(searchQuery) ||
      cmd.keywords?.some(k => k.includes(searchQuery))
    );
    
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [query, currentNodes, currentEdges]);

  // Handle natural language processing
  const processNaturalLanguage = async (input: string) => {
    setIsProcessing(true);
    
    try {
      // Call the existing chat-to-agent API
      const response = await fetch('/api/chat-to-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });

      if (!response.ok) throw new Error('Failed to process request');
      
      const data = await response.json();
      
      // Transform the response into our preview format
      const workflowPreview: WorkflowPreview = {
        nodes: data.nodes || [],
        edges: data.edges || [],
        description: data.description || `Workflow for: "${input}"`
      };
      
      setPreview(workflowPreview);
    } catch (error) {
      console.error('Error processing natural language:', error);
      // Fallback to a simple workflow
      setPreview({
        nodes: [
          { id: '1', type: 'input', position: { x: 100, y: 100 }, data: { label: 'Input' } },
          { id: '2', type: 'llm', position: { x: 300, y: 100 }, data: { label: 'Process with AI' } },
          { id: '3', type: 'output', position: { x: 500, y: 100 }, data: { label: 'Output' } }
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3' }
        ],
        description: 'AI-powered workflow'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle command selection
  const handleSelect = useCallback(async (index?: number) => {
    const commandIndex = index !== undefined ? index : selectedIndex;
    const command = filteredCommands[commandIndex];
    
    if (!command && query) {
      // Natural language input
      await processNaturalLanguage(query);
      return;
    }
    
    if (command?.action) {
      command.action();
      onClose();
    }
  }, [filteredCommands, selectedIndex, query, onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        handleSelect();
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [filteredCommands.length, handleSelect, onClose]);

  // Add workflow to canvas
  const handleAddWorkflow = () => {
    if (preview) {
      onCreateWorkflow(preview.nodes, preview.edges);
      setPreview(null);
      setQuery('');
      onClose();
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!modalOpen) {
      setQuery('');
      setPreview(null);
      setIsProcessing(false);
      setSelectedIndex(0);
    }
  }, [modalOpen]);

  return (
    <Modal 
      isOpen={modalOpen} 
      onOpenChange={handleOpenChange}
      size="2xl"
      placement="top"
      hideCloseButton
      classNames={{
        base: "top-[20%] !translate-y-0",
        backdrop: "bg-black/50",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Command Bar</h3>
              <p className="text-sm text-muted-foreground">
                Describe what you want to build or choose a command
              </p>
            </div>
            <Kbd className="ml-auto" keys={["command"]}>K</Kbd>
          </div>
        </ModalHeader>
        <ModalBody className="px-0 pb-4">
          <div className="px-4 pb-3">
            <div className="relative flex items-center">
              <div className="absolute left-3 pointer-events-none">
                {isProcessing ? (
                  <Spinner size="sm" />
                ) : (
                  <Search className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <Input
                ref={inputRef}
                placeholder="Create a workflow that..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10"
                autoFocus
              />
            </div>
          </div>

          {preview ? (
            <div className="px-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">Generated Workflow</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {preview.description}
                    </p>
                  </div>
                  <Chip color="success" variant="flat" size="sm">
                    Preview
                  </Chip>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold">{preview.nodes.length}</div>
                    <div className="text-xs text-muted-foreground">Nodes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold">{preview.edges.length}</div>
                    <div className="text-xs text-muted-foreground">Connections</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold">
                      {preview.nodes.filter(n => n.type === 'llm' || n.type === 'agent').length}
                    </div>
                    <div className="text-xs text-muted-foreground">AI Nodes</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddWorkflow}
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Canvas
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setPreview(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ScrollShadow className="max-h-[400px]">
              <div className="px-2">
                {filteredCommands.length === 0 && query && !isProcessing && (
                  <div className="px-4 py-8 text-center">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Press Enter to create a workflow from your description
                    </p>
                  </div>
                )}
                
                {filteredCommands.map((command, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = command.icon;
                  
                  return (
                    <button
                      key={command.id}
                      onClick={() => handleSelect(index)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                        isSelected ? "bg-primary/10" : "hover:bg-muted/50",
                        command.category === 'Suggested' && "border-l-2 border-warning"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-md",
                        isSelected ? "bg-primary/20" : "bg-muted"
                      )}>
                        {Icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{command.title}</div>
                        {command.description && (
                          <div className="text-xs text-muted-foreground">
                            {command.description}
                          </div>
                        )}
                      </div>
                      {command.category && (
                        <Chip 
                          size="sm" 
                          variant="flat"
                          color={command.category === 'Suggested' ? 'warning' : 'default'}
                        >
                          {command.category}
                        </Chip>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </ScrollShadow>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}