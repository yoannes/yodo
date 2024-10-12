import { textContentEmphasis } from "@consts";
import { cx, randomString } from "@utils";
import { forwardRef, useMemo } from "react";
import { Input } from "./TremorInput";

interface Props {
  value?: string | number;
  type?: "text" | "password" | "email" | "url" | "number";
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  label?: string;
  onChange?: (value: string | number) => void;
  onEnter?: () => void;
  onEsc?: () => void;
}

const YodoInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const id = useMemo(() => {
    return randomString();
  }, []);

  const keydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.onEnter?.();
    }
    if (e.key === "Escape") {
      props.onEsc?.();
    }
  };

  return (
    <div>
      {props.label && (
        <label className={cx(textContentEmphasis, "text-medium")} htmlFor={id}>
          {props.label}
        </label>
      )}

      <Input
        id={id}
        ref={ref}
        value={props.value as string}
        type={props.type}
        placeholder={props.placeholder}
        className={props.className}
        hasError={!!props.errorMessage}
        onKeyDown={keydownHandler}
        onBlur={() => props.onEsc?.()}
        onChange={(e) => props.onChange?.(e.target.value)}
      />

      {props.errorMessage && <span className="text-red-500">{props.errorMessage}</span>}
    </div>
  );
});

YodoInput.displayName = "YodoInput";

export default YodoInput;
