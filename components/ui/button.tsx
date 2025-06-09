"use client";

import * as React from "react";
import { Button as HeroUIButton } from "@heroui/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "",
        secondary: "",
        ghost: "",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    // Handle icon-only buttons
    const isIconOnly = size === "icon";
    
    // Map size to HeroUI sizes
    const heroUISize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";

    if (asChild) {
      return (
        <Slot
          data-slot="button"
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    // Determine HeroUI props based on variant
    let heroUIProps: any = {
      size: heroUISize,
      isIconOnly,
      className: cn(
        buttonVariants({ variant, size }),
        variant === "link" && "min-w-0 p-0 h-auto",
        className
      ),
      ...props,
    };

    // Map shadcn variants to HeroUI variant/color combinations
    switch (variant) {
      case "default":
        heroUIProps.variant = "solid";
        heroUIProps.color = "primary";
        break;
      case "destructive":
        heroUIProps.variant = "solid";
        heroUIProps.color = "danger";
        break;
      case "outline":
        heroUIProps.variant = "bordered";
        heroUIProps.color = "default";
        break;
      case "secondary":
        heroUIProps.variant = "flat";
        heroUIProps.color = "secondary";
        break;
      case "ghost":
        heroUIProps.variant = "light";
        heroUIProps.color = "default";
        break;
      case "link":
        heroUIProps.variant = "light";
        heroUIProps.color = "primary";
        break;
    }

    return (
      <HeroUIButton ref={ref} {...heroUIProps}>
        {children}
      </HeroUIButton>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };