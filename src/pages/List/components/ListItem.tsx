import { YodoIcon, YodoInput } from "@components";
import { SECOND, bgColor, borderColor } from "@consts";
import { Toast, useI18n, useTasks, useToast } from "@hooks";
import { Task } from "@types";
import { cx } from "@utils";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  task: Task;
}

const ListItem: React.FC<Props> = ({ task }) => {
  const { t } = useI18n();
  const tasks = useTasks();
  const { toast } = useToast();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const editHandler = () => {
    setTitle(task.title);
    setEdit(true);
  };
  const saveHandler = async () => {
    if (!title || title === task.title) return;

    const originalTitle = task.title;
    const res = await tasks.edit(task.id, title);
    const options: Toast = {
      title: t("task"),
      timeout: SECOND * 5,
    };

    if (res) {
      const _toast = toast({
        ...options,
        variant: "success",
        description: t("taskUpdated", title),
        action: {
          altText: t("revertChanges"),
          label: t("undo"),
          async onClick() {
            await tasks.edit(task.id, originalTitle);
            _toast.dismiss();
          },
        },
      });

      setEdit(false);
    } else {
      toast({
        ...options,
        variant: "error",
        description: t("errorUpdating"),
      });
    }
  };

  const delHandler = async () => {
    const options: Toast = {
      title: t("task"),
      timeout: SECOND * 5,
    };

    const res = await tasks.del(task.id);
    if (res) {
      const _toast = toast({
        ...options,
        description: t("taskDeleted", task.title),
        variant: "success",
        action: {
          altText: t("revertChanges"),
          label: t("undo"),
          async onClick() {
            await tasks.unDel(task.id);
            _toast.dismiss();
          },
        },
      });
    } else {
      toast({
        ...options,
        description: t("errorDeleting"),
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus();
    }
  }, [edit]);

  return (
    <div className={root}>
      <div className="h-[72px] flex items-center gap-3">
        <YodoIcon type="check" />
        <div className="flex-grow">
          {edit ? (
            <YodoInput
              ref={inputRef}
              value={title}
              onEnter={saveHandler}
              onChange={(v) => setTitle(v as string)}
              onEsc={() => setEdit(false)}
            />
          ) : (
            <span onClick={editHandler}>{task.title}</span>
          )}
        </div>

        <YodoIcon type="trash-2" pointer onClick={delHandler} />
      </div>
    </div>
  );
};

const root = cx("px-4 py-2 rounded-md", borderColor, bgColor);

ListItem.displayName = "ListItem";

export default ListItem;
