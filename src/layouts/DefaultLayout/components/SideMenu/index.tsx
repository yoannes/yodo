import { type IconType, YodoAvatar, YodoDropdown, YodoIcon } from "@components";
import { borderColor } from "@consts";
import { type Word, useAuth, useI18n, useNavigator, useTheme } from "@hooks";
import type { RouteName } from "@router";
import { cx } from "@utils";
import type React from "react";
import { MenuItem } from "./components";

const SideMenu: React.FC = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const auth = useAuth();
  const nav = useNavigator();

  const menuItems: { icon: IconType; value: string }[] = [{ icon: "home", value: "home" }];

  const actionHandler = (v: string) => {
    if (v === "theme") {
      theme.setTheme(theme.theme === "dark" ? "light" : "dark");
    } else if (v === "signout") {
      auth.signout();
    } else {
      nav.push({ name: v as RouteName });
    }
  };

  if (!auth.state.user) {
    return null;
  }

  return (
    <div className={root}>
      <div
        className={cx(logoContainer, borderBottom)}
        onClick={() => actionHandler("home")}
        onKeyUp={() => actionHandler("home")}
      >
        Yodo!
      </div>

      <div className={itemsContainer}>
        {menuItems.map((item) => (
          <MenuItem key={item.value} icon={item.icon} value={item.value} onClick={actionHandler} />
        ))}
      </div>

      <div className={borderBottom} style={{ height: 1, width: "100%" }} />

      <div className="w-full flex-grow flex flex-col justify-end py-2 px-3">
        <div className="flex items-center gap-4 px-2 py-4">
          <YodoAvatar url={auth.state.user.avatar} size={32} name={auth.state.user.firstName} />
          <div className="flex-grow">{auth.state.user.firstName}</div>
          <YodoDropdown
            items={[
              {
                label: t(theme.theme as Word),
                value: "theme",
                children: <YodoIcon type={theme.theme === "dark" ? "moon" : "sun"} size={16} />,
              },
              { label: t("signout"), value: "signout" },
            ]}
            onClick={actionHandler}
          >
            <YodoIcon type="more-horizontal" size={16} pointer />
          </YodoDropdown>
        </div>
      </div>
    </div>
  );
};

const root = cx(
  "SideMenu",
  "flex",
  "flex-col",
  "items-center",
  "w-full",
  "h-full",
  "gap-4",
  "bg-tremor-background-subtle",
  "dark:bg-dark-tremor-background-subtle",
);
const logoContainer = cx(
  "flex",
  "gap-2",
  "items-center",
  "w-full",
  "px-[28px]",
  "h-[54px]",
  "cursor-pointer",
);
const itemsContainer = cx("flex", "flex-col", "w-full", "px-3", "py-2");
const borderBottom = cx("border-b", borderColor);

SideMenu.displayName = "SideMenu";

export default SideMenu;
