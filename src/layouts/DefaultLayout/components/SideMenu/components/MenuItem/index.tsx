import { IconType, YodoIcon } from "@components";
import { Word, useI18n, useNavigator, useTheme } from "@hooks";
import { cx } from "@utils";
import React, { useRef, useState } from "react";
import styles from "./style.module.scss";

interface Props {
  icon: IconType;
  value: string;
  onClick: (v: string) => void;
}

const MenuItem: React.FC<Props> = ({ icon, value, onClick }) => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const nav = useNavigator();
  const [isHovering, setIsHovering] = useState(false);
  const hoverBlurRef = useRef<HTMLDivElement>(null);

  const handleHover = (e: React.MouseEvent) => {
    if (!hoverBlurRef.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetLeft = (e.currentTarget as HTMLDivElement).offsetLeft;
    // Since the square is rotated, we need to offset the x position by 30px
    const offsetX = e.clientX - offsetLeft - rect.left - 30;
    hoverBlurRef.current.style.left = `${offsetX}px`;
  };

  return (
    <div
      className={cx(
        root,
        styles.MenuItem,
        nav.currentRoute.name === value && active,
        theme === "light" && styles.MenuItem__light,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseMove={handleHover}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onClick(value)}
    >
      <YodoIcon type={icon} />
      <span>{t(value as Word)}</span>

      {isHovering && (
        <div
          ref={hoverBlurRef}
          className={cx(
            styles.MenuItem__hoverBlur,
            theme === "light" && styles["MenuItem__hoverBlur--light"],
          )}
        />
      )}

      <div className={styles.MenuItem__hoverStars}>
        <YodoIcon type="hover-stars" size={60} />
      </div>
    </div>
  );
};

const root = cx(
  "flex",
  "items-center",
  "px-4",
  "py-2",
  "gap-2",
  "rounded-md",
  "cursor-pointer",
  "text-semibold",
  "overflow-hidden",
  "text-tremor-content",
  "dark:text-dark-tremor-content",
  "bg-tremor-background-subtle",
  "dark:bg-dark-tremor-background-subtle",
);
const active = cx(
  "bg-tremor-background-subtle",
  "dark:bg-dark-tremor-background-subtle",
  "text-tremor-content-strong",
  "dark:text-dark-tremor-content-strong",
);

MenuItem.displayName = "MenuItem";

export default MenuItem;
