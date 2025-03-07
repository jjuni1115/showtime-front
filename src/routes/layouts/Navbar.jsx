import Header from "../../components/Header.jsx";
import {Outlet} from "react-router-dom";

const Navbar = () =>{
    return(
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default Navbar;