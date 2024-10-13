import { YodoDivider, YodoListItem } from "@components";
import { bgBrandSubtle, textContentEmphasis, textContentStrong } from "@consts";
import { useI18n, useTasks } from "@hooks";
import { Task } from "@types";
import { cx } from "@utils";
import dayjs from "dayjs";
import React, { useMemo } from "react";

interface Props {}

const CompletedTasks: React.FC<Props> = () => {
  const { t } = useI18n();
  const tasks = useTasks();

  const tasksList = useMemo(() => Object.values(tasks.state.list), [tasks.state.list]);
  const list = useMemo(() => {
    const res: Record<string, Task[]> = {};
    const tasksArray = tasksList.filter((t) => t.completedAt);

    for (const task of tasksArray) {
      const dayTimestamp = task.createdAt.startOf("day").unix();
      if (!res[dayTimestamp]) {
        res[dayTimestamp] = [];
      }
      res[dayTimestamp].push(task);
    }

    return res;
  }, [tasksList]);

  return (
    <div className={root}>
      <div className={completed}>
        {t("completedTasks")}
        <div className={badge}>{tasksList.length}</div>
      </div>

      <YodoDivider className="mt-2" />

      {Object.entries(list).map(([key, value]) => {
        const day = dayjs.unix(Number(key));

        return (
          <div key={key}>
            <div>{t("completedAt", day.format("L(ddd)"))}</div>
            <div className={listContainer}>
              {value.map((task) => (
                <YodoListItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const root = cx("");
const completed = cx("text-title", "flex", "items-center", "gap-2", textContentStrong);
const badge = cx(
  "px-2",
  "py-[2px]",
  "w-fit",
  "h-fit",
  "rounded-full",
  "text-xs-bold",
  bgBrandSubtle,
  textContentEmphasis,
);
const listContainer = cx("flex", "flex-col", "gap-3", "mt-4");

CompletedTasks.displayName = "CompletedTasks";

export default CompletedTasks;
