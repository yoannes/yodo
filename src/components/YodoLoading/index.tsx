import YodoIcon from "@components/YodoIcon";
import { cx } from "@utils";
import React from "react";

interface Props {
  full?: boolean;
}

const YodoLoading: React.FC<Props> = ({ full }) => {
  return (
    <div className={cx(full && "w-screen h-screen flex-center")}>
      <YodoIcon type="loader" size={30} spin />
    </div>
  );
};

YodoLoading.displayName = "YodoLoading";

export default YodoLoading;
