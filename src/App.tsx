import { Toaster, YodoLoading } from "@components";
import { useAuth } from "@hooks";
import { router } from "@router";
import { RouterProvider } from "react-router-dom";

function App() {
  const auth = useAuth();

  if (!auth.state.ready) {
    return <YodoLoading full />;
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
