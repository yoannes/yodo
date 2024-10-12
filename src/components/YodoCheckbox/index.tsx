import { textContent } from "@consts";
import { cx, randomString } from "@utils";
import React, { useMemo } from "react";
import { Checkbox } from "./TremorCheckbox";

interface Props {
  checked?: boolean;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

const YodoCheckbox: React.FC<Props> = ({ checked, onChange, children }) => {
  const id = useMemo(() => {
    return randomString();
  }, []);

  return (
    <div className={classes.root}>
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      {/* <input
        id={id}
        checked={checked}
        type="checkbox"
        className="accent-cyan-800 rounded"
        onChange={(e) => onChange?.(e.target.checked)}
      /> */}
      <label htmlFor={id} className={classes.label}>
        {children}
      </label>
    </div>
  );
};

const classes = {
  root: cx("flex-center", "gap-3", "w-fit", "cursor-pointer"),
  label: cx(textContent, "text-regular", "flex-center"),
};

YodoCheckbox.displayName = "YodoCheckbox";

export default YodoCheckbox;
