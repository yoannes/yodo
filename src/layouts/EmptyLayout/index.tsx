import React from "react";
import { LayoutProps } from "../types";

const EmptyLayout: React.FC<LayoutProps> = ({ children }) => {
  return <>{children}</>;
};

EmptyLayout.displayName = "EmptyLayout";

export default EmptyLayout;
