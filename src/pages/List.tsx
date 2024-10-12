import { YodoButton, YodoInput } from "@components";
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
      <div>
        <YodoInput placeholder={t("What do we have for today?")} />

        <YodoButton suffix="plus-circle">{t("create")}</YodoButton>
      </div>
      <div>lists</div>
    </div>
  );
}

const root = cx("flex flex-col gap-6 p-8 w-[1014px]");
const header = cx("text-2xl-bold", "text-center");
