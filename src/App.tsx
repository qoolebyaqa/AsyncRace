import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import paths from "./util/paths";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/AsyncRace/",
      element: <RootLayout />,
      children: paths,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
