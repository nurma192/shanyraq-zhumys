"use client";

import * as React from "react";
import { OTPInput, SlotProps } from "input-otp";
import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex items-center gap-2", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  SlotProps & React.ComponentPropsWithoutRef<"div">
>(({ char, hasFakeCaret, isActive, className, ...props }, ref) => {
  // Extract the placeholderChar prop to avoid passing it to the DOM
  const { placeholderChar, ...restProps } = props as any;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-14 w-12 items-center justify-center rounded-md border border-input text-xl transition-all",
        isActive && "ring-2 ring-[#800000] border-[#800000] bg-[#800000]/5",
        className
      )}
      {...restProps}
    >
      {char ? (
        <div>{char}</div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {isActive && (
            <div className="animate-caret-blink h-6 w-px bg-[#800000] duration-1000" />
          )}
        </div>
      )}
      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink h-6 w-px bg-[#800000] duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot className="h-4 w-4 text-muted-foreground" />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
