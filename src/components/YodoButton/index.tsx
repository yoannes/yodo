import { IconType, YodoIcon } from "@components";
import { cx } from "@utils";
import React from "react";
import { Button } from "./TremorButton";

interface Props {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost" | "destructive" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  prefix?: IconType;
  suffix?: IconType;
  block?: boolean;
  className?: string;
  busy?: boolean;
  onClick?: () => void;
}

const YodoButton: React.FC<Props> = ({
  size = "xs",
  prefix,
  suffix,
  variant = "primary",
  children,
  block,
  className,
  busy,
  onClick,
}) => {
  const Icon = () => {
    if (prefix) return <YodoIcon type={prefix} className="mr-[6px]" size={20} />;
    if (busy) return <YodoIcon type="loader" className="mr-[6px]" size={20} spin />;
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
    block && "w-full",
    lightPadding,
    className,
  );

  return (
    <Button variant={variant} className={classes} onClick={onClick}>
      {Icon()}
      {children}
      {suffix && <YodoIcon type={suffix} className="ml-[6px]" size={20} />}
    </Button>
  );
};

YodoButton.displayName = "YodoButton";

export default YodoButton;
