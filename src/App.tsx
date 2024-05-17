import { RouterProvider, createBrowserRouter } from "react-router-dom"
import RootLayout from "./pages/RootLayout"
import paths from "./util/paths"

function App() {

  const router = createBrowserRouter([
    {
      path: '/AsyncRace/',
      element: <RootLayout />,
      children: paths
    }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
