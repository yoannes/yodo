import { YodoCard, YodoProgress } from "@components";
import { textContent, textContentEmphasis } from "@consts";
import { useI18n, useTasks } from "@hooks";
import { cx } from "@utils";
import React from "react";

interface Props {}

const ReportCards: React.FC<Props> = () => {
  const { t } = useI18n();
  const tasks = useTasks();

  const tasksCreated = Object.keys(tasks.state.list).length;

  return (
    <div className={root}>
      <YodoCard className="p-6 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className={cx("text-3xl-bold", "text-amber-500")}>{tasksCreated}</div>
          <div>
            <div className={cx("text-medium", textContentEmphasis)}>{t("Tasks were created")}</div>
            <div className={cx("text", textContent)}>{t("Since you started using Yodo!")}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-grow flex-center flex-col gap-1">
            <div className={cx("text-xs", textContent)}>{t("%s/%s until next cheer", 6, 10)}</div>
            <YodoProgress variant="warning" value={22} max={100} />
          </div>
          <div className="text-[32px]">🤩</div>
        </div>
      </YodoCard>

      <YodoCard className="p-6">
        <YodoProgress type="circle" className="w-[38px]" value={22} max={100} />
      </YodoCard>
    </div>
  );
};

const root = cx("flex", "gap-4");

ReportCards.displayName = "ReportCards";

export default ReportCards;
