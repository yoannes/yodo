"use client";

import { IconType, YodoIcon } from "@components";
import { cx } from "@utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./TremorDropdown";

type Item = {
  value: string | number;
  label: string;
  children?: React.ReactNode;
  prefix?: IconType;
  danger?: boolean;
};

interface Props {
  open?: boolean;
  items?: Item[];
  html?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  onClick?: (value: string) => void;
  onVisibilityChange?: (value: boolean) => void;
  children: React.ReactNode;
}

const YodoDropdown: React.FC<Props> = ({
  open,
  items,
  children,
  html,
  fullWidth,
  className,
  onClick,
  onVisibilityChange,
}) => {
  const handleClose = (item: Item) => {
    onClick?.(String(item.value));
  };

  return (
    <DropdownMenu open={open} modal onOpenChange={onVisibilityChange}>
      <DropdownMenuTrigger className={cx(fullWidth ? "w-full" : "w-fit", className)}>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="z-[100] w-full">
        {html && <DropdownMenuItem>{html}</DropdownMenuItem>}
        {items?.map((item, i) => (
          <DropdownMenuItem
            key={i}
            className={cx(stItem, item.danger && "text-rose-700")}
            onClick={() => handleClose(item)}
          >
            {item.prefix && <YodoIcon className="mr-[10px]" size={16} type={item.prefix} />}
            {item.label}
            {item.children}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const stItem = cx(
  "flex",
  "items-center",
  "gap-2",
  "px-3",
  "py-[10px]",
  "cursor-pointer",
  "hover:bg-tremor-background-subtle",
  "dark:hover:bg-dark-tremor-background-subtle",
  "whitespace-nowrap",
);

YodoDropdown.displayName = "YodoDropdown";

export default YodoDropdown;
