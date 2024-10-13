import { YodoCard, YodoProgress } from "@components";
import { MOBILE_BREAKPOINT, textContent, textContentEmphasis, textContentStrong } from "@consts";
import { useI18n, useTasks } from "@hooks";
import { cx } from "@utils";
import React, { useMemo } from "react";

interface Props {}

const ReportCards: React.FC<Props> = () => {
  const { t } = useI18n();
  const tasks = useTasks();

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  const data = useMemo(() => tasks.getReportData(), [tasks.state.list]);

  return (
    <div className={cx(root, isMobile && "flex-col")}>
      <YodoCard className="p-2 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className={cx("text-3xl-bold", "text-amber-500")}>{data.created}</div>
          <div>
            <div className={cx("text-medium", textContentEmphasis)}>{t("Tasks were created")}</div>
            <div className={cx("text", textContent)}>{t("Since you started using Yodo!")}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-grow flex-center flex-col gap-1">
            <div className={cx("text-xs", textContent)}>
              {t("%s/%s until next cheer", data.cheersCent / 10, 10)}
            </div>
            <YodoProgress variant="warning" value={data.cheersCent} max={100} />
          </div>
          <div className="text-[32px]">🤩</div>
        </div>
      </YodoCard>

      <YodoCard className="p-2">
        <div>
          <div className="flex items-center gap-4">
            <YodoProgress type="circle" className="w-[38px]" value={data.completedCent} max={100} />

            <div>
              <div className={cx("text-medium", textContentEmphasis)}>
                <span className="text-indigo-500 mr-1">{data.completedCent}%</span>
                {t("of your tasks are completed")}
              </div>
              <div className={cx("text", textContent)}>{t("Since you started using Yodo!")}</div>
            </div>
          </div>

          <div className={cx("text", textContentStrong)}>
            <span className="text-title text-indigo-500 mr-1">{data.completed}</span> /{" "}
            {data.created} {t("tasks")}
          </div>
        </div>
      </YodoCard>
    </div>
  );
};

const root = cx("flex", "gap-4");

ReportCards.displayName = "ReportCards";

export default ReportCards;
