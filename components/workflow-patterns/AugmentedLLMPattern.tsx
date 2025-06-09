import React from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BrainCircuit, ArrowRightCircle, Puzzle } from "lucide-react";

export default function AugmentedLLMPattern() {
  return (
    <Card className="flex flex-col gap-6 p-6 bg-background/60 border border-border text-foreground w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-foreground/10 p-3 mb-2">
            <Input className="w-40" placeholder="User Input" />
          </div>
          <span className="text-xs text-foreground/70">Input</span>
        </div>
        <ArrowRightCircle size={28} className="mx-2 text-foreground/60" />
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-foreground/10 p-3 mb-2 flex items-center gap-2">
            <BrainCircuit size={22} className="text-foreground" />
            <span className="text-sm">LLM</span>
            <Puzzle size={18} className="ml-1 text-foreground/70" />
          </div>
          <span className="text-xs text-foreground/70">LLM + Tools</span>
        </div>
        <ArrowRightCircle size={28} className="mx-2 text-foreground/60" />
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-foreground/10 p-3 mb-2">
            <Input className="w-40" placeholder="Output" disabled />
          </div>
          <span className="text-xs text-foreground/70">Output</span>
        </div>
      </div>
      <Button className="self-end bg-foreground/10 text-foreground border border-foreground/20 hover:bg-foreground/20">
        Run Example
      </Button>
    </Card>
  );
}
