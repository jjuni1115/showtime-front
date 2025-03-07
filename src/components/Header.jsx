import {Container, Navbar, Nav} from "react-bootstrap";

const Header = () =>{
    return(
        <>
            <Navbar bg="primary" data-bs-theme="dark" className="w-100">

                  <Navbar.Brand href="/home">showtime</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/signup">Feature</Nav.Link>
                    <Nav.Link href="#pricing">프로필</Nav.Link>
                  </Nav>

              </Navbar>
        </>
    );
}

export default Header;
