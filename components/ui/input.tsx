"use client";

import * as React from "react";
import { Input as HeroUIInput } from "@heroui/react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "bordered" | "underlined" | "flat" | "faded";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "bordered", ...props }, ref) => {
    // Extract props that need special handling
    const { disabled, required, readOnly, placeholder, ...restProps } = props;
    
    // Build the props object conditionally
    const heroUIProps: any = {
      type,
      variant,
      isDisabled: disabled,
      isRequired: required,
      isReadOnly: readOnly,
      placeholder,
      classNames: {
        base: cn("max-w-full", className),
        mainWrapper: "h-full",
        input: cn(
          "text-sm placeholder:text-muted-foreground",
          "data-[hover=true]:bg-transparent"
        ),
        inputWrapper: cn(
          "h-9 min-h-unit-9",
          "shadow-xs",
          "bg-transparent",
          "data-[hover=true]:bg-transparent",
          "group-data-[focus=true]:bg-transparent",
          "!cursor-text"
        ),
      },
      ...restProps
    };
    
    return <HeroUIInput ref={ref} {...heroUIProps} />;
  }
);

Input.displayName = "Input";

export { Input };