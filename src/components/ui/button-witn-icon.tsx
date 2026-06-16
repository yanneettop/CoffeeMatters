import { Button } from "@/components/ui/button";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "solid" | "outline" | "outline-light";

interface ButtonWithIconProps {
  children?: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  target?: string;
  rel?: string;
  icon?: LucideIcon;
  ariaLabel?: string;
}

const variantStyles: Record<ButtonVariant, { button: string; icon: string }> = {
  primary: {
    button: "border-0 bg-[linear-gradient(135deg,#c25b3a_0%,#d4724f_50%,#c25b3a_100%)] text-white hover:bg-[linear-gradient(135deg,#c25b3a_0%,#d4724f_50%,#c25b3a_100%)] shadow-[0_4px_24px_rgba(194,91,58,0.3)] hover:shadow-[0_8px_40px_rgba(194,91,58,0.5)]",
    icon: "bg-white/20 text-white",
  },
  // Solid filled brand button — high-contrast primary CTA
  solid: {
    button: "border-0 bg-[#D85A30] text-white hover:bg-[#bf4a24] shadow-[0_4px_24px_rgba(216,90,48,0.35)] hover:shadow-[0_8px_40px_rgba(216,90,48,0.55)]",
    icon: "bg-white/20 text-white",
  },
  outline: {
    button: "border border-[#c25b3a] bg-transparent text-[#c25b3a] hover:bg-[#c25b3a] hover:text-white shadow-none hover:shadow-[0_4px_24px_rgba(194,91,58,0.3)]",
    icon: "bg-[#c25b3a]/10 text-[#c25b3a] group-hover:bg-white/20 group-hover:text-white",
  },
  "outline-light": {
    button: "border-2 border-white/70 bg-white/5 text-white hover:bg-white/15 hover:border-white shadow-none hover:shadow-[0_8px_32px_rgba(255,255,255,0.12)] backdrop-blur-sm",
    icon: "bg-white/20 text-white group-hover:bg-white/30",
  },
};

const ButtonWithIcon = ({
  children = "Let's Collaborate",
  href,
  className = "",
  onClick,
  variant = "primary",
  target,
  rel,
  icon: Icon = ArrowUpRight,
  ariaLabel,
}: ButtonWithIconProps) => {
  const styles = variantStyles[variant];

  // Internal route links (start with "/") use the router for client-side nav;
  // external links and hashes fall back to a plain anchor.
  const isInternal = !!href && href.startsWith("/") && target !== "_blank";

  const inner = (
    <>
      <span className="relative z-10 transition-all duration-500 tracking-[0.18em] uppercase font-body" style={{ fontSize: '11px' }}>
        {children}
      </span>
      <div className={`absolute right-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 ${styles.icon}`}>
        <Icon size={16} />
      </div>
    </>
  );

  return (
    <Button
      className={`relative text-sm font-medium rounded-full min-h-[44px] h-12 p-1 ps-6 pe-14 group transition-[background-color,border-color,color,box-shadow,padding-left,padding-right] duration-300 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer ${styles.button} ${className}`}
      onClick={onClick}
      asChild={!!href}
      aria-label={ariaLabel}
    >
      {href ? (
        isInternal ? (
          <Link to={href}>{inner}</Link>
        ) : (
          <a href={href} target={target} rel={rel}>{inner}</a>
        )
      ) : (
        <>{inner}</>
      )}
    </Button>
  );
};

export default ButtonWithIcon;
