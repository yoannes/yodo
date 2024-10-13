import { YodoModal } from "@components";
import { MOBILE_BREAKPOINT, bgBrandFaint, borderColor, textContentEmphasis } from "@consts";
import { useI18n, useTasks } from "@hooks";
import { LayoutProps } from "@layouts";
import { DB, cx } from "@utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MobileHeader, SideMenu } from "./components";

const STORAGE_KEY = "sidebarWidth";
const STORAGE_CHEERS = "cheers";
const STORAGE_CHEERS_COUNT = "cheersCount";
const MIN_WIDTH = 200;

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useI18n();
  const tasks = useTasks();
  const [sidebarWidth, setSidebarWidth] = useState(DB(STORAGE_KEY) || MIN_WIDTH);
  const [showCheersModal, setShowCheersModal] = useState<string[] | null>(null);
  const resizerRef = useRef(0);

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  // TODO: Resize gifs, way too big
  const cheers = [
    ["/img/amazed.gif", t("I'm impressed")],
    ["/img/cheers.gif", t("Cheers!")],
    ["/img/clap.gif", t("Well done!")],
    ["/img/dance.gif", t("Let's dance!")],
    ["/img/fire.gif", t("You are on fire!")],
    ["/img/muscle.gif", t("You are strong!")],
  ];

  const data = useMemo(() => tasks.getReportData(), [tasks.state.list]);

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

  useEffect(() => {
    const count = DB(STORAGE_CHEERS_COUNT) || 0;
    const current = DB(STORAGE_CHEERS);

    if (count === 90 && !data.cheersCent) {
      if (!current) {
        const selectedCheer = cheers[Math.floor(Math.random() * cheers.length)];
        DB(STORAGE_CHEERS, selectedCheer);
        setShowCheersModal(selectedCheer);
      }
    } else {
      // reset storage
      DB(STORAGE_CHEERS, null);
    }

    DB(STORAGE_CHEERS_COUNT, data.cheersCent);
  }, [data]);

  const CheersModal = (
    <YodoModal
      isOpen={!!showCheersModal}
      hideFooter
      onClose={() => {
        DB(STORAGE_CHEERS, 1);
        setShowCheersModal(null);
      }}
    >
      {showCheersModal && (
        <div className="flex-center gap-12 flex-col">
          <div className={cx("flex flex-col items-center text-2xl-bold", textContentEmphasis)}>
            <div>{t("You’ve created 10 tasks!")}</div>
            <div>{showCheersModal[1]}</div>
          </div>
          <img src={showCheersModal[0]} className="w-[140px] h-[140px]" />
        </div>
      )}
    </YodoModal>
  );

  if (isMobile) {
    return (
      <div className={cx(root, "flex-col")}>
        <MobileHeader />
        <div className={body}>{children}</div>
        {CheersModal}
      </div>
    );
  }

  return (
    <div className={root}>
      <div style={{ width: sidebarWidth }}>
        <SideMenu />
      </div>
      <div className={cx(resize, borderLeft)} onMouseDown={startResizing} />
      <div className={body} style={{ width: `calc(100vw - ${sidebarWidth}px)` }}>
        {children}
      </div>

      {CheersModal}
    </div>
  );
};

const root = cx("flex", "h-screen", bgBrandFaint);
const resize = cx("w-[5px]", "cursor-col-resize");
const borderLeft = cx("border-l", borderColor);
const body = cx("flex-1", "overflow-y-auto", "flex", "justify-center");

DefaultLayout.displayName = "DefaultLayout";

export default DefaultLayout;
