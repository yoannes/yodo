import React from "react";
import { ProgressBar } from "./TremorProgress";
import { ProgressCircle } from "./TremorProgressCircle";

interface Props {
  type?: "bar" | "circle";
  value?: number;
  max?: number;
  showAnimation?: boolean;
  label?: string;
  className?: string;
  variant?: "default" | "neutral" | "warning" | "error" | "success";
}

const YodoProgress: React.FC<Props> = ({
  type = "bar",
  value,
  max,
  showAnimation,
  label,
  className,
  variant,
}) => {
  if (type === "circle") {
    return (
      <ProgressCircle
        value={value}
        className={className}
        max={max}
        showAnimation={showAnimation}
        variant={variant}
      />
    );
  }

  return (
    <ProgressBar
      value={value}
      className={className}
      max={max}
      showAnimation={showAnimation}
      label={label}
      variant={variant}
    />
  );
};

YodoProgress.displayName = "YodoProgress";

export default YodoProgress;
