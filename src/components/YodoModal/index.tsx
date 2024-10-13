import { YodoButton, YodoIcon } from "@components";
import { bgColor, textContentSubtle } from "@consts";
import { Word, useI18n } from "@hooks";
import { cx } from "@utils";
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./TremorDialog";

interface Props {
  isOpen: boolean;
  title?: React.ReactNode;
  closable?: boolean;
  hideFooter?: boolean;
  hideCancel?: boolean;
  large?: boolean;
  busy?: boolean;
  okLabel?: Word;
  placement?: "top" | "center";
  children?: React.ReactNode;
  preventClose?: boolean;
  onClose?: () => void;
  onOk?: () => void;
}

const YodoModal: React.FC<Props> = ({
  isOpen,
  children,
  title,
  hideFooter = false,
  closable = true,
  busy,
  large,
  okLabel,
  preventClose,
  placement = "center",
  hideCancel,
  onClose,
  onOk,
}) => {
  const { t } = useI18n();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !preventClose) {
          onClose?.();
        }
      }}
    >
      <DialogContent
        placement={placement}
        className={cx(bgColor, large ? "w-[800px] max-w-[80vw]" : "max-w-sm")}
      >
        <div className="YodoModal overflow-x-hidden px-1 py-1">
          {closable && (
            <div className={cx("absolute", "top-7", "right-6", textContentSubtle)}>
              <YodoIcon type="x" pointer onClick={() => onClose?.()} />
            </div>
          )}

          <DialogTitle>{title}</DialogTitle>

          {children}

          {!hideFooter && (
            <div className="flex gap-2 mt-6">
              {!hideCancel && (
                <YodoButton variant="secondary" className="grow" onClick={onClose}>
                  {t("cancel")}
                </YodoButton>
              )}
              <YodoButton variant="primary" className="grow" busy={busy} onClick={onOk}>
                {t(okLabel || "save")}
              </YodoButton>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

YodoModal.displayName = "YodoModal";

export default YodoModal;
