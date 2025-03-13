import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./layouts/Navbar.jsx"
import Login from "./pages/Login.jsx"
import OauthLogin from "./pages/OauthLogin.jsx";


const router = createBrowserRouter([
    {
        element: <Navbar/>,
        children: [

            {
                path: "/home",
                element: <Home/>
            }
        ]
    }, {
        path: "/",
        element: <Login/>
    }, {
        path: `/signup`,
        element: <Register/>
    }, {
        path: `/oauth`,
        element: <OauthLogin/>
    }
])

export default function Router() {
    return <RouterProvider router={router}/>
}
