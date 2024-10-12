import { YodoButton, YodoCheckbox, YodoDivider, YodoIcon, YodoInput } from "@components";
import { Word, useAuth, useI18n, useNavigator, useTheme } from "@hooks";
import { useEffect, useState } from "react";
import { classes } from "./styles";

export default function Signup() {
  const { t } = useI18n();
  const nav = useNavigator();
  const auth = useAuth();
  const { setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({ email: "", password: "", terms: "" });

  const googleHandler = () => {
    auth.loginGoogle();
  };
  const signupHandler = async () => {
    setErr({ email: "", password: "", terms: "" });

    if (!email) {
      return setErr({ email: t("emailRequired") });
    }
    if (!password) {
      return setErr({ password: t("pwdRequired") });
    }
    if (!agree) {
      return setErr({ terms: t("pleaseAgreeToTheTerms") });
    }

    const res = await auth.signup(email, password);
    if (res !== "OK") {
      if (res.includes("email")) {
        return setErr({ email: t(res as Word) });
      }

      setTheme("dark");
      return setErr({ password: t(res as Word) });
    }

    nav.push({ name: "list" });
  };
  const loginHandler = () => {
    nav.push({ name: "login" });
  };

  useEffect(() => {
    if (auth.state.authUser) {
      setTheme("dark");
      nav.push({ name: "list" });
    } else {
      setTheme("light");
    }
  }, [auth.state.authUser]);

  return (
    <div className={classes.root}>
      <div className={classes.body}>
        <div className={classes.bodyLeft}>
          <div className="absolute top-8 left-8">Yodo!</div>
          <div className={classes.formContainer}>
            <div className={classes.title}>{t("signup")}</div>
            <div>
              <YodoButton variant="secondary" block>
                <div className={classes.sso}>
                  <YodoIcon type="google" size={20} onClick={googleHandler} />
                  {t("continueWithGoogle")}
                </div>
              </YodoButton>
            </div>

            <YodoDivider>{t("Or, Signup with your email")}</YodoDivider>

            <div className="flex flex-col gap-6">
              <YodoInput
                value={email}
                type="text"
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

              <div>
                <YodoCheckbox checked={agree} onChange={setAgree}>
                  {t("agreeToTheTerms")}
                </YodoCheckbox>
                {err.terms && <div className={classes.error}>{err.terms}</div>}
              </div>
            </div>

            <div>
              <YodoButton variant="primary" size="lg" block onClick={signupHandler}>
                {t("signup")}
              </YodoButton>
            </div>

            <div className={classes.footer}>
              {t("Already have an account?")}
              <YodoButton variant="link" size="lg" onClick={loginHandler}>
                {t("login")}
              </YodoButton>
            </div>
          </div>
        </div>
        <div className="w-1/2 pt-[34px] pl-[31px] flex-center">Some nice text</div>
      </div>
    </div>
  );
}
