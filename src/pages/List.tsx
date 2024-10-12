import { YodoButton, YodoDivider, YodoIcon, YodoInput } from "@components";
import { bgBrandSubtle, textContent, textContentEmphasis } from "@consts";
import { useAuth, useI18n } from "@hooks";
import { cx } from "@utils";

export default function Home() {
  const { t } = useI18n();
  const auth = useAuth();

  return (
    <div className={root}>
      <div
        className={header}
        dangerouslySetInnerHTML={{
          __html: t("Hey %s, Let's check your schedule for today", auth.me?.firstName),
        }}
      />

      <div className="flex gap-2 mt-6">
        <div className="flex-grow">
          <YodoInput placeholder={t("What do we have for today?")} />
        </div>
        <YodoButton suffix="plus-circle">{t("create")}</YodoButton>
      </div>

      <div className="flex justify-between mt-6">
        <div className="text-bold text-cyan-500">
          {t("todos")} <span className={badge}>0</span>
        </div>
        <div className="text-bold text-cyan-500">
          {t("completed")} <span className={badge}>0</span>
        </div>
      </div>

      <div>
        <YodoDivider />
        lists
        <div className={cx("py-16", "px-6", emptyStateContainer)}>
          <YodoIcon type="clipboard" className={textContent} size={56} />

          <div className="text-center">
            <div className={cx("text-bold", textContent)}>{t("You don't have any tasks")}</div>
            <div className={cx("text-title", textContent)}>
              {t("Create tasks and organize your to-do items")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = cx("p-8", "w-[1014px]");
const header = cx("text-2xl-bold", "text-center");
const badge = cx("rounded-full", "px-2", "py-[2px]", bgBrandSubtle, textContentEmphasis);
const emptyStateContainer = cx("flex-center", "flex-col", "gap-4");
