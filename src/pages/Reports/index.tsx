import { useAuth, useI18n } from "@hooks";
import { cx } from "@utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ReportCards } from "./components";

export default function Reports() {
  const { t } = useI18n();
  const auth = useAuth();

  const greetings = useMemo(() => {
    const now = dayjs();
    if (now.hour() < 12) return t("goodMorning", auth.me?.fullname);
    if (now.hour() < 18) return t("goodAfternoon", auth.me?.fullname);
    if (now.hour() < 22) return t("goodEvening", auth.me?.fullname);
    return t("goodNight", auth.me?.fullname);
  }, [auth.me?.fullname, t]);

  if (!auth.me) return null;

  return (
    <div className={root}>
      <div
        className={header}
        dangerouslySetInnerHTML={{
          __html: t("greetingsUser", greetings, auth.me?.firstName),
        }}
      />

      <div className="mt-6">
        <ReportCards />
      </div>
    </div>
  );
}

const root = cx("p-8", "max-w-[1014px]", "w-full");
const header = cx("text-2xl-bold", "text-center");
