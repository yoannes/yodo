import { cx } from "@utils";

export default function Home() {
  return <div className={root}>im home</div>;
}

const root = cx("flex", "flex-col", "gap-6");
