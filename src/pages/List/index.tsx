import { YodoButton, YodoDivider, YodoIcon, YodoInput } from "@components";
import { bgBrandSubtle, textBrandEmphasis, textContent, textContentEmphasis } from "@consts";
import { useAuth, useI18n, useTasks } from "@hooks";
import { cx } from "@utils";
import { useMemo, useState } from "react";
import { ListItem } from "./components";

export default function Home() {
  const { t } = useI18n();
  const auth = useAuth();
  const tasks = useTasks();
  const [name, setName] = useState("");

  const list = useMemo(() => {
    return Object.values(tasks.state.list);
  }, [tasks.state.list]);

  const createTask = () => {
    if (!name) return;
    tasks.add(name);
  };

  return (
    <div className={root}>
      <div
        className={header}
        dangerouslySetInnerHTML={{
          __html: t("Hey %s, Let's check your schedule for today", auth.me?.firstName),
        }}
      />

      <div className="flex gap-2 mt-6">
        <div className="flex-grow">
          <YodoInput
            value={name}
            placeholder={t("What do we have for today?")}
            onChange={(v) => setName(v as string)}
          />
        </div>
        <YodoButton suffix="plus-circle" onClick={createTask}>
          {t("create")}
        </YodoButton>
      </div>

      <div className="flex justify-between mt-6">
        <div className="text-bold text-cyan-500">
          {t("todos")} <span className={badge}>0</span>
        </div>
        <div className="text-bold text-indigo-500">
          {t("completed")} <span className={badge}>0</span>
        </div>
      </div>

      <div>
        <YodoDivider />

        <div className="flex flex-col gap-3">
          {list.map((item) => (
            <ListItem key={item.id} task={item} />
          ))}
        </div>

        {!list.length && (
          <div className={cx("py-16", "px-6", emptyStateContainer)}>
            <YodoIcon type="file-text" className={textBrandEmphasis} size={56} />

            <div className="text-center">
              <div className={cx("text-bold", textContent)}>{t("You don't have any tasks")}</div>
              <div className={cx("text-title", textContent)}>
                {t("Create tasks and organize your to-do items")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = cx("p-8", "w-[1014px]");
const header = cx("text-2xl-bold", "text-center");
const badge = cx("rounded-full", "px-2", "py-[2px]", bgBrandSubtle, textContentEmphasis);
const emptyStateContainer = cx("flex-center", "flex-col", "gap-4");
