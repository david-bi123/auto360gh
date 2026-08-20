import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "dark" | "outline" | "ghost" | "secondary" | "success" | "danger" | "whatsapp";
type Size = "xs" | "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-race-500 text-white hover:bg-race-600 shadow-[0_1px_2px_rgb(231_68_43/0.3)] focus-visible:ring-race-400",
  dark: "bg-carbon-900 text-white hover:bg-carbon-800 shadow-sm",
  outline: "border border-carbon-300 bg-white text-carbon-800 hover:bg-carbon-50 hover:border-carbon-400",
  ghost: "text-carbon-700 hover:bg-carbon-100 hover:text-carbon-900",
  secondary: "bg-carbon-100 text-carbon-900 hover:bg-carbon-200",
  success: "bg-mint-500 text-white hover:bg-emerald-600",
  danger: "bg-red-600 text-white hover:bg-red-700",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1fb959]",
};

const sizes: Record<Size, string> = {
  xs: "h-8 px-3 text-xs rounded-lg gap-1.5",
  sm: "h-9 px-3.5 text-sm rounded-lg gap-2",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
  icon: "h-10 w-10 rounded-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";