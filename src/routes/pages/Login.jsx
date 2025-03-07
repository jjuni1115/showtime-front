import {Button, Card, Container, Form} from "react-bootstrap";
import useInput from "../../hook/useInput.jsx";

const Login = () =>{

  const userId = useInput("");
  const userPw = useInput("");

  const login = () =>{
    console.log(userId.value);
    console.log(userPw.value)
  }

    return(
        <>
                <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {/* 로그인 카드 */}
        <Card className="p-4 text-center">
          <h1 className="mb-3">showtime</h1>
          <Form>
            <Form.Group className="mb-2">
              <Form.Control type="text" placeholder="전화번호, 사용자 이름 또는 이메일" value={userId.value} onChange={userId.handelInputValue} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control type="password" placeholder="비밀번호" value={userPw.value} onChange={userPw.handelInputValue} />
            </Form.Group>
            <Button variant="primary" className="w-100" onClick={login}>로그인</Button>
          </Form>

          <div className="my-2">또는</div>

          <Button variant="link" className="text-primary fw-bold" onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}>
            <i className="bi bi-facebook"></i> Google로 로그인
          </Button>

          <Button variant="link" className="text-primary fw-bold">
              <i className="bi bi-facebook"></i> Kakao로 로그인
            </Button>

          <div className="mt-2">
            <a href="#" className="text-muted">비밀번호를 잊으셨나요?</a>
          </div>
        </Card>

        <Card className="mt-3 p-3 text-center">
          계정이 없으신가요? <a href="#" className="text-primary fw-bold">가입하기</a>
        </Card>

      </div>
    </Container>
        </>


    );
}

export default Login;