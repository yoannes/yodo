# Components

```ts
import { cx } from "@utils"
import React from "react"

interface Props {}

const COMPONENT_NAME: React.FC<Props> = () => {
  return <div className={root}>COMPONENT_NAME</div>
}

const root = cx("")

COMPONENT_NAME.displayName = "COMPONENT_NAME"

export default COMPONENT_NAME
```
