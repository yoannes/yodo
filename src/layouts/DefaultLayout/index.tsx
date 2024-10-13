import { MOBILE_BREAKPOINT, bgBrandFaint, borderColor } from "@consts";
import { LayoutProps } from "@layouts";
import { DB, cx } from "@utils";
import React, { useRef, useState } from "react";
import { MobileHeader, SideMenu } from "./components";

const STORAGE_KEY = "sidebarWidth";
const MIN_WIDTH = 200;

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(DB(STORAGE_KEY) || MIN_WIDTH);
  const resizerRef = useRef(0);

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  const startResizing = (e: React.MouseEvent) => {
    resizerRef.current = e.clientX;
    document.addEventListener("mousemove", resizeSidebar);
    document.addEventListener("mouseup", stopResizing);
  };

  const resizeSidebar = (e: MouseEvent) => {
    const dx = e.clientX - resizerRef.current!;
    setSidebarWidth((prevWidth) => {
      const res = Math.max(prevWidth + dx, MIN_WIDTH);
      DB(STORAGE_KEY, res);
      return res;
    });
    resizerRef.current = e.clientX;
  };

  const stopResizing = () => {
    document.removeEventListener("mousemove", resizeSidebar);
    document.removeEventListener("mouseup", stopResizing);
  };

  if (isMobile) {
    return (
      <div className={cx(root, "flex-col")}>
        <MobileHeader />
        <div className="flex-1 flex justify-center">{children}</div>
      </div>
    );
  }

  return (
    <div className={root}>
      <div style={{ width: sidebarWidth }}>
        <SideMenu />
      </div>
      <div className={cx(resize, borderLeft)} onMouseDown={startResizing} />
      <div
        className="flex-1 flex justify-center"
        style={{ width: `calc(100vw - ${sidebarWidth}px)` }}
      >
        {children}
      </div>
    </div>
  );
};

const root = cx("flex", "h-screen", bgBrandFaint);
const resize = cx("w-[5px]", "cursor-col-resize");
const borderLeft = cx("border-l", borderColor);

DefaultLayout.displayName = "DefaultLayout";

export default DefaultLayout;
