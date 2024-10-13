import { YodoIcon, YodoInput, YodoModal } from "@components";
import { SECOND } from "@consts";
import { useI18n, useNavigator, useTasks } from "@hooks";
import { debounce } from "@utils";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {}

const CreateTask: React.FC<Props> = () => {
  const nav = useNavigator();
  const { t } = useI18n();
  const tasks = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [saved, setSaved] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const isEdit = nav.currentRoute?.name === "editItem";
  const isOpen = nav.currentRoute?.name === "newItem" || isEdit;

  const currentTask = useMemo(() => {
    if (!nav.currentRoute.params?.id) return null;
    return tasks.state.list[nav.currentRoute.params.id];
  }, [tasks.state.list, nav.currentRoute.params?.id]);

  const createTask = async () => {
    if (currentTask && !title) return;

    setBusy(true);
    await tasks.add(title, description);
    setBusy(false);

    setTitle("");
    setDescription("");

    nav.back();
  };

  const saveTask = async (newTitle: string, newDescription: string) => {
    if (!currentTask) return;
    setTyping(true);

    debounce(async () => {
      await tasks.edit(currentTask.id, { title: newTitle, description: newDescription });
      setTyping(false);
      setSaved(true);
      setTimeout(() => setSaved(false), SECOND);
    }, SECOND);
  };

  useEffect(() => {
    if (isOpen) {
      if (currentTask && (currentTask.title !== title || currentTask.description !== description)) {
        setTitle(currentTask.title || "");
        setDescription(currentTask.description || "");
      }
    }
  }, [isOpen, currentTask]);

  return (
    <YodoModal
      isOpen={isOpen}
      title={t(isEdit ? "editTask" : "createTask")}
      okLabel="createTask"
      busy={busy}
      hideFooter={isEdit}
      hideCancel
      onClose={() => nav.back()}
      onOk={createTask}
    >
      <div className="flex flex-col gap-4 mt-4">
        <YodoInput
          ref={titleRef}
          value={title}
          label={t("taskTitle")}
          placeholder={t("Try to take over the world")}
          onChange={(v) => {
            const value = v as string;
            setTitle(value);
            saveTask(value, description);
          }}
        />
        <YodoInput
          value={description}
          label={t("taskDescription")}
          placeholder={t("Some how we will take over the world")}
          type="textarea"
          onChange={(v) => {
            const value = v as string;
            setDescription(value);
            saveTask(title, value);
          }}
        />

        <div className="h-8 flex items-center gap-2">
          {typing && (
            <>
              <YodoIcon type="loader" spin /> {t("saving")}
            </>
          )}
          {saved && (
            <>
              <YodoIcon type="check-circle" className="text-green-500" />
              <span dangerouslySetInnerHTML={{ __html: t("taskUpdated") }} />
            </>
          )}
        </div>
      </div>
    </YodoModal>
  );
};

CreateTask.displayName = "CreateTask";

export default CreateTask;
