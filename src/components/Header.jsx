import {Container, Navbar, Nav, Dropdown} from "react-bootstrap";
import api from "../util/axios.js";

const Header = () => {

    const userLogout = () =>{
        localStorage.removeItem("token");
        api.post("/user-service/user/logout",{}).then(response => {
            window.location.href = "/";
            }

        ).catch(error=>{
            window.location.href = "/";
        })

    }

    return (
        <>
        <Navbar bg="primary" data-bs-theme="dark" className="w-100">

            <Navbar.Brand href="/home">showtime</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/my-game">나의게임</Nav.Link>
                <Nav.Link href="/signup">Feature</Nav.Link>
            </Nav>
            <Nav className="ms-auto">

                <Dropdown>
                    <Dropdown.Toggle variant="link" id="profile-dropdown">
                        프로필
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/profile">프로필</Dropdown.Item>
                        <Dropdown.Item onClick={userLogout}>로그아웃</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

        </Nav>

        </Navbar>
</>
)
    ;
}

export default Header;
