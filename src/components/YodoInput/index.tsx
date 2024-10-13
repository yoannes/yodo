import { textContentEmphasis } from "@consts";
import { cx, randomString } from "@utils";
import { forwardRef, useMemo } from "react";
import { Input } from "./TremorInput";
import { Textarea } from "./TremorTextarea";

interface Props {
  value?: string | number;
  type?: "text" | "password" | "email" | "url" | "number" | "textarea";
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  label?: string;
  onChange?: (value: string | number) => void;
  onEnter?: () => void;
  onEsc?: () => void;
}

const YodoInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>((props, ref) => {
  const id = useMemo(() => {
    return randomString();
  }, []);

  const keydownHandler = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      {props.type === "textarea" ? (
        <Textarea
          id={id}
          ref={ref as React.LegacyRef<HTMLTextAreaElement>}
          value={props.value as string}
          placeholder={props.placeholder}
          className={props.className}
          hasError={!!props.errorMessage}
          onKeyDown={keydownHandler}
          onBlur={() => props.onEsc?.()}
          onChange={(e) => props.onChange?.(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          ref={ref as React.LegacyRef<HTMLInputElement>}
          value={props.value as string}
          type={props.type}
          placeholder={props.placeholder}
          className={props.className}
          hasError={!!props.errorMessage}
          onKeyDown={keydownHandler}
          onBlur={() => props.onEsc?.()}
          onChange={(e) => props.onChange?.(e.target.value)}
        />
      )}

      {props.errorMessage && <span className="text-red-500">{props.errorMessage}</span>}
    </div>
  );
});

YodoInput.displayName = "YodoInput";

export default YodoInput;
