import { cx } from "@utils";
import React from "react";

interface Props {}

const ListItem: React.FC<Props> = () => {
  return <div className={root}>ListItem</div>;
};

const root = cx("");

ListItem.displayName = "ListItem";

export default ListItem;
