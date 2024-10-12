import React from "react";
import { Divider } from "./TremorDivider";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

const YodoDivider: React.FC<Props> = ({ children, className }) => {
  return <Divider className={className}>{children}</Divider>;
};

YodoDivider.displayName = "YodoDivider";

export default YodoDivider;
