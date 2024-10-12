import { YodoButton, YodoDivider, YodoIcon, YodoInput } from "@components";
import { Word, useAuth, useI18n, useNavigator, useTheme } from "@hooks";
import { useEffect, useState } from "react";
import { classes } from "./styles";

export default function Login() {
  const { t } = useI18n();
  const nav = useNavigator();
  const { setTheme } = useTheme();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<Record<string, string>>({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const googleHandler = async () => {
    setBusy(true);
    await auth.loginGoogle();
    setBusy(false);
  };
  const loginHandler = async () => {
    setErr({});

    if (!email) {
      return setErr({ email: t("emailRequired") });
    }
    if (!password) {
      return setErr({ password: t("pwdRequired") });
    }

    setBusy(true);
    const res = await auth.login(email, password);
    setBusy(false);

    if (res !== "OK") {
      if (res.includes("email") || res.toLowerCase().includes("user")) {
        return setErr({ email: t(res as Word) });
      }

      return setErr({ password: t(res as Word) });
    }

    nav.push({ name: "home" });
  };
  const signupHandler = () => {
    nav.push({ name: "signup" });
  };

  useEffect(() => {
    if (auth.state.authUser) {
      nav.push({ name: "home" });
    }
  }, [auth.state.authUser]);

  useEffect(() => {
    setTheme("light");
  });

  return (
    <div className={classes.root}>
      <div className={classes.body}>
        <div className={classes.bodyLeft}>
          <div className="absolute top-8 left-8">Yodo!</div>

          <div className={classes.formContainer}>
            <div className={classes.title}>{t("login")}</div>
            <div>
              <YodoButton variant="secondary" busy={busy} block onClick={googleHandler}>
                <div className={classes.sso}>
                  <YodoIcon type="google" size={20} />
                  {t("continueWithGoogle")}
                </div>
              </YodoButton>
            </div>

            <YodoDivider>{t("Or, Login with your email")}</YodoDivider>

            <div className="flex flex-col gap-6">
              <YodoInput
                value={email}
                label={t("email")}
                placeholder={t("insertYourEmail")}
                errorMessage={err.email}
                onChange={(v) => setEmail(v as string)}
              />
              <YodoInput
                value={password}
                type="password"
                label={t("pwd")}
                placeholder={t("insertYourPwd")}
                errorMessage={err.password}
                onChange={(v) => setPassword(v as string)}
              />

              <div className="flex justify-end">
                <YodoButton variant="link">{t("forgotPwd")}</YodoButton>
              </div>
            </div>

            <div>
              <YodoButton variant="primary" size="lg" block onClick={loginHandler}>
                {t("login")}
              </YodoButton>
            </div>

            <div className={classes.footer}>
              {t("don't have an account?")}
              <YodoButton variant="link" size="lg" onClick={signupHandler}>
                {t("signup")}
              </YodoButton>
            </div>
          </div>
        </div>
        <div className="w-1/2 pt-[34px] pl-[31px] flex-center">
          <span>Some nice text here</span>
        </div>
      </div>
    </div>
  );
}
