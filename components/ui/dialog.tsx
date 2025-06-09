"use client";

import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { cn } from "@/lib/utils";

// Create a context to manage modal state
const DialogContext = React.createContext<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}>({
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
  onOpenChange: () => {},
});

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Dialog({ open, onOpenChange, children, defaultOpen = false }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [open, onOpenChange]);
  
  const disclosure = {
    isOpen,
    onOpen: () => handleOpenChange(true),
    onClose: () => handleOpenChange(false),
    onOpenChange: handleOpenChange,
  };

  return (
    <DialogContext.Provider value={disclosure}>
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function DialogTrigger({ children, asChild, ...props }: DialogTriggerProps) {
  const { onOpen } = React.useContext(DialogContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        const childProps = (children as React.ReactElement<any>).props;
        childProps.onClick?.(e);
        onOpen();
      },
    });
  }

  return (
    <button onClick={onOpen} {...props}>
      {children}
    </button>
  );
}

// DialogPortal is not needed with HeroUI Modal as it handles portaling internally
function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  scrollBehavior?: "inside" | "outside";
  placement?: "auto" | "top" | "center" | "bottom";
  backdrop?: "opaque" | "blur" | "transparent";
}

function DialogContent({
  className,
  children,
  size = "md",
  scrollBehavior = "inside",
  placement = "center",
  backdrop = "opaque",
  ...props
}: DialogContentProps) {
  const { isOpen, onOpenChange } = React.useContext(DialogContext);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={size}
      scrollBehavior={scrollBehavior}
      placement={placement}
      backdrop={backdrop}
      classNames={{
        base: "max-h-[90vh]",
        wrapper: placement === "center" ? "items-center" : undefined,
        body: "py-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <div className={cn("relative", className)} {...props}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === DialogClose) {
                return React.cloneElement(child as React.ReactElement<any>, { onClose });
              }
              return child;
            })}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
  asChild?: boolean;
}

function DialogClose({ children, onClose, asChild, ...props }: DialogCloseProps) {
  const context = React.useContext(DialogContext);
  const handleClose = onClose || context.onClose;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        const childProps = (children as React.ReactElement<any>).props;
        childProps.onClick?.(e);
        handleClose();
      },
    });
  }

  return (
    <button onClick={handleClose} {...props}>
      {children}
    </button>
  );
}

// DialogOverlay is handled by HeroUI Modal internally
function DialogOverlay() {
  return null; // HeroUI handles overlay internally
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ModalHeader className={cn("pb-3", className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ModalFooter
      className={cn("pt-2", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

function DialogDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};