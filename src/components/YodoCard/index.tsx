import { hoverBgMuted } from "@consts";
import { cx } from "@utils";
import React from "react";
import { Card } from "./TremorCard";

interface Props {
  children: React.ReactNode;
  className?: string;
  hasHover?: boolean;
  onClick?: () => void;
}

const YodoCard: React.FC<Props> = ({ className, children, hasHover, onClick }) => {
  return (
    <Card className={cx("YodoCard", className, hasHover && hoverBgMuted)} onClick={onClick}>
      {children}
    </Card>
  );
};

YodoCard.displayName = "YodoCard";

export default YodoCard;
