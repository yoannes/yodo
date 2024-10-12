import { IconType, YodoIcon } from "@components";
import { cx } from "@utils";
import React from "react";
import { Button } from "./TremorButton";

interface Props {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost" | "destructive" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  prefix?: IconType;
  block?: boolean;
  className?: string;
  busy?: boolean;
  onClick?: () => void;
}

const YodoButton: React.FC<Props> = ({
  size = "xs",
  prefix,
  variant = "primary",
  children,
  block,
  className,
  busy,
  onClick,
}) => {
  const Icon = () => {
    if (prefix) return <YodoIcon type={prefix} size={20} />;
    if (busy) return <YodoIcon type="loader" size={20} spin />;
    return <></>;
  };

  let lightPadding = "";
  if (variant === "light") {
    if (size === "xs") {
      lightPadding = "px-[10px] py-[6px]";
    } else if (size === "md") {
      lightPadding = "px-[16px] py-[8px]";
    } else if (size === "lg") {
      lightPadding = "px-[16px] py-[10px]";
    }
  }

  const classes = cx(
    variant === "primary" && "!bg-cyan-500 hover:!bg-cyan-600 border-none",
    variant === "light" && "!text-cyan-500 hover:!text-cyan-600",
    block && "w-full",
    lightPadding,
    className,
  );

  return (
    <Button variant={variant} className={classes} onClick={onClick}>
      {Icon()}
      {children}
    </Button>
  );
};

YodoButton.displayName = "YodoButton";

export default YodoButton;
