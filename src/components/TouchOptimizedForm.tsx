import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TouchOptimizedFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const TouchOptimizedForm: React.FC<TouchOptimizedFormProps> = ({
  children,
  onSubmit,
  className
}) => {
  return (
    <form 
      onSubmit={onSubmit} 
      className={cn("space-y-6 touch-manipulation", className)}
    >
      {children}
    </form>
  );
};

interface TouchOptimizedInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  required?: boolean;
}

export const TouchOptimizedInput: React.FC<TouchOptimizedInputProps> = ({
  label,
  required,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        {...props}
        className={cn("h-12 text-base touch-manipulation", className)}
      />
    </div>
  );
};

interface TouchOptimizedTextareaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  required?: boolean;
}

export const TouchOptimizedTextarea: React.FC<TouchOptimizedTextareaProps> = ({
  label,
  required,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        {...props}
        className={cn("min-h-[120px] text-base touch-manipulation", className)}
      />
    </div>
  );
};

interface TouchOptimizedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export const TouchOptimizedButton: React.FC<TouchOptimizedButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      className={cn("h-12 px-6 text-base min-w-[44px] touch-manipulation", className)}
    >
      {children}
    </Button>
  );
};