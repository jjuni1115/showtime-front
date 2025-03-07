import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./layouts/Navbar.jsx"
import Login from "./pages/Login.jsx"


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
    }
])

export default function Router() {
    return <RouterProvider router={router}/>
}
