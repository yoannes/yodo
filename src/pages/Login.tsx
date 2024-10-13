import { YodoButton, YodoIcon } from "@components";
import { MOBILE_BREAKPOINT, bgBrandFaint, bgBrandSubtle, textContentStrong } from "@consts";
import { useAuth, useI18n, useNavigator } from "@hooks";
import { cx } from "@utils";
import { useEffect, useState } from "react";

export default function Login() {
  const { t } = useI18n();
  const nav = useNavigator();
  const auth = useAuth();
  const [busy, setBusy] = useState(false);

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  const googleHandler = async () => {
    setBusy(true);
    await auth.loginGoogle();
    setBusy(false);
  };

  useEffect(() => {
    if (auth.state.authUser) {
      nav.push({ name: "list" });
    }
  }, [auth.state.authUser]);

  if (isMobile) {
    return (
      <div className={mobileRoot}>
        <div className="absolute top-8 left-8">
          <YodoIcon type="logo" width={77} height={32} />
        </div>

        <img src="/img/rocket.gif" className="w-[175px] h-[175px]" />

        <div className={formContainer}>
          <div className="flex flex-col items-center gap-4">
            <div className={title}>{t("letsStart")}</div>
            <div>{t("Signup or login into your account here")}</div>
          </div>

          <div>
            <YodoButton variant="secondary" busy={busy} block onClick={googleHandler}>
              <div className={sso}>
                <YodoIcon type="google" size={20} />
                {t("continueWithGoogle")}
              </div>
            </YodoButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={root}>
      <div className={body}>
        <div className={bodyLeft}>
          <div className="absolute top-8 left-8">
            <YodoIcon type="logo" size={77} />
          </div>

          <div className={formContainer}>
            <div className="flex flex-col items-center gap-4">
              <div className={title}>{t("letsStart")}</div>
              <div>{t("Signup or login into your account here")}</div>
            </div>

            <div>
              <YodoButton variant="secondary" busy={busy} block onClick={googleHandler}>
                <div className={sso}>
                  <YodoIcon type="google" size={20} />
                  {t("continueWithGoogle")}
                </div>
              </YodoButton>
            </div>
          </div>
        </div>

        <div className={bodyRight}>
          <img src="/img/rocket.gif" className="w-[175px] h-[175px]" />
        </div>
      </div>
    </div>
  );
}

const root = cx("Auth", "w-screen", "h-screen");
const mobileRoot = cx(root, "relative", "flex-center", "flex-col", "gap-16", bgBrandFaint);
const body = cx("flex", "h-full");
const title = cx("text-4xl-bold", "text-center", textContentStrong);
const bodyLeft = cx("relative", "flex-center", "w-1/2", bgBrandSubtle);
const bodyRight = cx("w-1/2", "pt-[34px]", "pl-[31px]", "flex-center", bgBrandFaint);
const formContainer = cx("flex", "flex-col", "gap-8", "w-[80%]", "max-w-[424px]");
const sso = cx("flex", "items-center", "gap-2", "py-[6px]");
