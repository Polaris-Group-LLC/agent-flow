"use client";

import * as React from "react";
import { Textarea as HeroUITextarea } from "@heroui/react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "bordered" | "underlined" | "flat" | "faded";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "bordered", ...props }, ref) => {
    // Extract props that need special handling
    const { disabled, required, readOnly, placeholder, rows, ...restProps } = props;
    
    // Map rows to minRows for HeroUI
    const minRows = rows || 3;
    
    // Build the props object
    const heroUIProps: any = {
      variant,
      isDisabled: disabled,
      isRequired: required,
      isReadOnly: readOnly,
      placeholder,
      minRows,
      classNames: {
        base: cn("max-w-full", className),
        input: cn(
          "resize-y min-h-[60px]",
          "text-sm placeholder:text-muted-foreground"
        ),
        inputWrapper: cn(
          "shadow-xs",
          "bg-transparent",
          "data-[hover=true]:bg-transparent",
          "group-data-[focus=true]:bg-transparent"
        ),
      },
      ref,
      ...restProps
    };
    
    return <HeroUITextarea {...heroUIProps} />;
  }
);

Textarea.displayName = "Textarea";

export { Textarea };