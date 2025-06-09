"use client";

import * as React from "react";
import { 
  Card as HeroUICard, 
  CardHeader as HeroUICardHeader,
  CardBody as HeroUICardBody,
  CardFooter as HeroUICardFooter
} from "@heroui/react";
import { cn } from "@/lib/utils";

interface CardProps extends React.ComponentProps<"div"> {
  isPressable?: boolean;
  isBlurred?: boolean;
  shadow?: "none" | "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg";
  onPress?: () => void;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, isPressable, isBlurred, shadow = "sm", radius = "lg", onPress, ...props }) => {
    // HeroUI Card doesn't accept ref directly, we'll use the props approach
    const cardProps: any = {
      className: cn(
        "bg-card text-card-foreground",
        className
      ),
      isPressable,
      isBlurred,
      shadow,
      radius,
      onPress,
      ...props
    };
    
    return (
      <HeroUICard {...cardProps}>
        {children}
      </HeroUICard>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }) => {
    return (
      <HeroUICardHeader
        className={cn("pb-3", className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("text-large font-semibold leading-none tracking-tight", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("text-sm text-muted-foreground", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }) => {
    return (
      <HeroUICardBody
        className={cn("py-2", className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }) => {
    return (
      <HeroUICardFooter
        className={cn("pt-2", className)}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

// CardAction doesn't have a direct HeroUI equivalent, so we'll keep it as a custom component
const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "absolute top-3 right-3",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CardAction.displayName = "CardAction";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};