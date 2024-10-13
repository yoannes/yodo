import { YodoButton, YodoDivider, YodoInput } from "@components";
import { bgBrandSubtle, textContent, textContentEmphasis } from "@consts";
import { useAuth, useI18n, useTasks } from "@hooks";
import { bouncyAnimation, cx } from "@utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { ListItem } from "./components";

export default function Home() {
  const { t, lang } = useI18n();
  const auth = useAuth();
  const tasks = useTasks();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [congratsPhrase, setCongratsPhrase] = useState(-1);
  const [listLength, setListLength] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const congratsPhrases = useMemo(
    () => [
      [t("Congrats"), t("You completed all your tasks. Proud of you!")],
      [t("Well done"), t("Keep it up!")],
      [t("Great job"), t("You're doing great!")],
      [t("Awesome"), t("You're on fire!")],
      [t("Fantastic"), t("You're unstoppable!")],
    ],
    [lang],
  );

  // Get list of non-completed tasks
  const list = useMemo(() => {
    return Object.values(tasks.state.list)
      .filter((item) => !item.completedAt)
      .sort((a, b) => (a.createdAt.isBefore(b.createdAt) ? 1 : -1));
  }, [tasks.state.list]);

  const count = useMemo(() => {
    return {
      open: list.length,
      completed: Object.values(tasks.state.list).filter((item) => item.completedAt).length,
    };
  }, [tasks.state.list]);

  const createTask = async () => {
    if (!name) return;

    setBusy(true);
    await tasks.add(name);
    setBusy(false);

    setName("");
  };

  useEffect(() => {
    if (!list.length && listLength === -1) return;
    setListLength(list.length);

    if (!list.length) {
      setCongratsPhrase(Math.floor(Math.random() * congratsPhrases.length));
    }
  }, [list.length]);

  useEffect(() => {
    if (listRef.current) {
      bouncyAnimation(listRef.current);
    }
  }, [listRef]);

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
            {congratsPhrase > -1 ? (
              <>
                <span className="text-[48px]">🎉</span>

                <div className="text-center">
                  <div className={cx("text-bold", textContent)}>
                    {congratsPhrases[congratsPhrase][0]}
                  </div>
                  <div className={cx("text-title", textContent)}>
                    {congratsPhrases[congratsPhrase][1]}
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className="text-[48px]">🧐</span>

                <div className="text-center">
                  <div className={cx("text-bold", textContent)}>
                    {t("You don't have any tasks")}
                  </div>
                  <div className={cx("text-title", textContent)}>
                    {t("Create tasks and organize your to-do items")}
                  </div>
                </div>
              </>
            )}
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
