import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AppProvider } from "./context/AppStateContext.tsx";

import "./index.scss";

dayjs.extend(localizedFormat);
dayjs.extend(dayOfYear);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider enableSystem={false} attribute="class">
      <AppProvider>
        <App />
      </AppProvider>
      <div className="text-[9px] fixed bottom-1 right-2">{__APP_VERSION__}</div>
    </ThemeProvider>
  </React.StrictMode>,
);
