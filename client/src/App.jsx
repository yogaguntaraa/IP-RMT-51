import {
  RouterProvider,
  createBrowserRouter,
  redirect,
  Outlet
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Navbar from './components/Navbar'
import DetailPage from "./pages/DetailPage"



const router = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if (localStorage.token) {
        return redirect("/")
      }
      return null
    }
  },
  {
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
    
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: () => {
          if (!localStorage.token) {
            return redirect("/login");
          }
          return null;
        },
      },
      {
        path: "/detail/:id",
        element: <DetailPage />,

      },
    ]
  },
])

function App() {

  return <GoogleOAuthProvider clientId="22551179301-gtv4f4mjq76n1fdu15lg7co1r2ta4hin.apps.googleusercontent.com">
    <RouterProvider router={router} />;
  </GoogleOAuthProvider>
}

export default App
