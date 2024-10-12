import { YodoButton, YodoDivider, YodoIcon, YodoInput } from "@components";
import {
  SECOND,
  bgBrandSubtle,
  textBrandEmphasis,
  textContent,
  textContentEmphasis,
} from "@consts";
import autoAnimate, { getTransitionSizes } from "@formkit/auto-animate";
import { useAuth, useI18n, useTasks } from "@hooks";
import { DB, cx, debounce, logger } from "@utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { ListItem } from "./components";

const countKey = "count";

export default function Home() {
  const { t } = useI18n();
  const auth = useAuth();
  const tasks = useTasks();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(DB(countKey) || { open: 0, completed: 0 });
  const listRef = useRef<HTMLDivElement>(null);

  // Get list of non-completed tasks
  const list = useMemo(() => {
    return Object.values(tasks.state.list)
      .filter((item) => !item.completedAt)
      .sort((a, b) => (a.createdAt.isBefore(b.createdAt) ? 1 : -1));
  }, [tasks.state.list]);

  const createTask = async () => {
    if (!name) return;

    setBusy(true);
    await tasks.add(name);
    setBusy(false);

    setName("");
  };

  useEffect(() => {
    if (listRef.current) {
      // Bouncy animation
      autoAnimate(listRef.current, (el, action, oldCoords, newCoords) => {
        let keyframes;
        if (action === "add") {
          keyframes = [
            { transform: "scale(0)", opacity: 0 },
            { transform: "scale(1.03)", opacity: 1, offset: 0.75 },
            { transform: "scale(1)", opacity: 1 },
          ];
        }
        if (action === "remove") {
          keyframes = [
            { transform: "scale(1)", opacity: 1 },
            { transform: "scale(1.15)", opacity: 1, offset: 0.33 },
            { transform: "scale(0.75)", opacity: 0.1, offset: 0.5 },
            { transform: "scale(0.5)", opacity: 0 },
          ];
        }
        if (action === "remain") {
          const deltaX = (oldCoords?.left || 0) - (newCoords?.left || 0);
          const deltaY = (oldCoords?.top || 0) - (newCoords?.top || 0);
          const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(
            el,
            oldCoords!,
            newCoords!,
          );
          const start: Keyframe = {
            transform: `translate(${deltaX}px, ${deltaY}px)`,
          };
          const mid: Keyframe = {
            transform: `translate(${deltaX * -0.15}px, ${deltaY * -0.15}px)`,
            offset: 0.75,
          };
          const end: Keyframe = { transform: `translate(0, 0)` };
          if (widthFrom !== widthTo) {
            start.width = `${widthFrom}px`;
            mid.width = `${widthFrom >= widthTo ? widthTo / 1.05 : widthTo * 1.05}px`;
            end.width = `${widthTo}px`;
          }
          if (heightFrom !== heightTo) {
            start.height = `${heightFrom}px`;
            mid.height = `${heightFrom >= heightTo ? heightTo / 1.05 : heightTo * 1.05}px`;
            end.height = `${heightTo}px`;
          }
          keyframes = [start, mid, end];
        }
        return new KeyframeEffect(el, keyframes as Keyframe[], {
          duration: 600,
          easing: "ease-out",
        });
      });
    }
  }, [listRef]);

  // Update count every time the list changes
  useEffect(() => {
    debounce(() => {
      tasks.getCount().then((res) => {
        logger("update count", res);
        setCount(res as { open: number; completed: number });
        DB(countKey, res);
      });
    }, SECOND);
  }, [list.length]);

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
        <YodoButton suffix="plus-circle" busy={busy} onClick={createTask}>
          {t("create")}
        </YodoButton>
      </div>

      <div className="flex justify-between mt-6">
        <div className="text-bold text-cyan-500">
          {t("todos")} <span className={badge}>{count.open}</span>
        </div>
        <div className="text-bold text-indigo-500">
          {t("completed")} <span className={badge}>{count.completed}</span>
        </div>
      </div>

      <div>
        <YodoDivider />

        <div ref={listRef} className="flex flex-col gap-3">
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
