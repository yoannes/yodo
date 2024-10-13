import { IconType, YodoAvatar, YodoIcon, YodoModal } from "@components";
import { bgSubtle, borderColor, menuItems, textContentEmphasis } from "@consts";
import { useAuth, useNavigator, useTheme } from "@hooks";
import { RouteName } from "@router";
import { cx } from "@utils";
import React from "react";

interface Props {}

const MobileHeader: React.FC<Props> = () => {
  const nav = useNavigator();
  const theme = useTheme();
  const auth = useAuth();
  const [modalOpen, setModalOpen] = React.useState(false);

  const _menuItems = [...menuItems, { icon: "log-out" as IconType, value: "signout" }];

  const themeHandler = () => {
    theme.setTheme(theme.currentTheme === "dark" ? "light" : "dark");
  };

  if (!auth.state.user) return null;

  return (
    <div className={root}>
      <YodoIcon type="logo" width={77} height={32} />

      <div className="flex gap-4">
        <YodoAvatar url={auth.state.user.avatar} size={24} name={auth.state.user.firstName} />
        <YodoIcon
          type={theme.currentTheme === "dark" ? "moon" : "sun"}
          size={24}
          onClick={themeHandler}
        />
        <YodoIcon type="menu" size={24} onClick={() => setModalOpen(true)} />
      </div>

      <YodoModal
        title={<YodoIcon type="logo" width={58} height={24} />}
        isOpen={modalOpen}
        hideFooter
        onClose={() => setModalOpen(false)}
      >
        <div className="flex flex-col gap-1 mt-4">
          {_menuItems.map((item) => (
            <div
              key={item.value}
              className={menuItem}
              onClick={() => {
                if (item.value === "signout") {
                  auth.signout();
                  return;
                }
                setModalOpen(false);
                nav.push({ name: item.value as RouteName });
              }}
            >
              <YodoIcon type={item.icon} />
              {item.value}
            </div>
          ))}
        </div>
      </YodoModal>
    </div>
  );
};

const root = cx(
  "flex",
  "px-6",
  "justify-between",
  "items-center",
  "h-16",
  "border-b",
  borderColor,
  bgSubtle,
);
const menuItem = cx(
  "flex",
  "items-center",
  "gap-2",
  "px-4",
  "py-2",
  "text-medium",
  textContentEmphasis,
);

MobileHeader.displayName = "MobileHeader";

export default MobileHeader;
