import { YodoIcon } from "@components";
import { SECOND, bgColor, borderColor } from "@consts";
import { Toast, useI18n, useNavigator, useTasks, useToast } from "@hooks";
import { Task } from "@types";
import { cx } from "@utils";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  task: Task;
}

const ListItem: React.FC<Props> = ({ task }) => {
  const nav = useNavigator();
  const { t } = useI18n();
  const { toast } = useToast();
  const tasks = useTasks();
  const [edit, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const editHandler = () => {
    nav.push({ name: "editItem", params: { id: task.id } });
  };

  const completeHandler = async () => {
    const res = await tasks.edit(task.id, { completedAt: dayjs().unix() });
    const options: Toast = {
      title: t("task"),
      timeout: SECOND * 5,
    };

    if (res) {
      const _toast = toast({
        ...options,
        variant: "success",
        description: t("taskCompleted", task.title),
        action: {
          altText: t("revertChanges"),
          label: t("undo"),
          async onClick() {
            await tasks.edit(task.id, { completedAt: null });
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
        <YodoIcon type="check" size={24} pointer onClick={completeHandler} />

        <div className="flex-grow">
          <span className="cursor-pointer" onClick={editHandler}>
            {task.title}
          </span>
        </div>

        <YodoIcon type="trash-2" pointer onClick={delHandler} />
      </div>
    </div>
  );
};

const root = cx("px-4 py-2 rounded-md", borderColor, bgColor);

ListItem.displayName = "ListItem";

export default ListItem;
