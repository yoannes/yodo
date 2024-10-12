import { cx } from "@utils";
import React from "react";

interface Props {
  url?: string;
  size?: number;
  name?: string;
}

const YodoAvatar: React.FC<Props> = ({ name = "", size = 40, url }) => {
  if (!url) {
    return (
      <div style={{ width: size, height: size }} className={classes.img}>
        {name}
      </div>
    );
  }

  return <img src={url} style={{ width: size, height: size }} className={classes.img} alt={name} />;
};

const classes = {
  img: cx("object-fit", "rounded-full"),
};

YodoAvatar.displayName = "YodoAvatar";

export default YodoAvatar;
