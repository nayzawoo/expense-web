import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

type InputProps = Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string, eventDetails: unknown) => void;
};

function Input({
  className,
  type,
  onChange,
  onValueChange,
  ...props
}: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      onValueChange={(value, eventDetails) => {
        onValueChange?.(value, eventDetails);
        const nativeEvent = (
          eventDetails as { event?: Event } | undefined
        )?.event;
        if (onChange && nativeEvent?.target instanceof HTMLInputElement) {
          onChange(
            nativeEvent as unknown as React.ChangeEvent<HTMLInputElement>,
          );
        }
      }}
      {...props}
    />
  );
}

export { Input };
