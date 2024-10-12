import { YodoIcon } from "@components";
import { bgColor, borderColor } from "@consts";
import { Task } from "@types";
import { cx } from "@utils";
import React from "react";

interface Props {
  task: Task;
}

const ListItem: React.FC<Props> = ({ task }) => {
  return (
    <div className={root}>
      <div className="h-[72px] flex items-center gap-3">
        <YodoIcon type="check" />
        {task.title}
      </div>
    </div>
  );
};

const root = cx("px-4 py-2 rounded-md", borderColor, bgColor);

ListItem.displayName = "ListItem";

export default ListItem;
