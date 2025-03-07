import {useParams, useSearchParams} from "react-router-dom";
import {Button, Card, Container, Form} from "react-bootstrap";
import useInput from "../../hook/useInput.jsx";

const Register = () =>{

    const [searchParam, setSearchParam] = useSearchParams();

    const userEmail = useInput(searchParam.get("email"));
    const userName = useInput(searchParam.get("name"));

    console.log(searchParam.get("email"))

    return (
        <Container className="d-flex flex-column align-items-center vh-100">
            <Card className="p-4  mt-5" style={{ width: "350px" }}>
                <h2 className="text-center mb-3" >
                    Showtime
                </h2>
                <p className="text-center">즐거운 농구 시작하기</p>

                <hr className="text-light" />
                <p className="text-center">또는</p>

                <Form>
                    <Form.Group className="mb-2">
                        <Form.Control type="email" placeholder="이메일 주소" value={userEmail.value} onChange={userEmail.handelInputValue} disabled={!!userEmail.value} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Control type="password" placeholder="비밀번호" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Control type="text" placeholder="성명" value={userName.value} onChange={userName.handelInputValue} disabled={!!userName.value}/>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Control type="text" placeholder="닉네임" />
                    </Form.Group>
                    <Button variant="primary" className="w-100">
                        가입
                    </Button>
                </Form>
            </Card>

            <p className="mt-3 text-white">앱을 다운로드하세요.</p>
        </Container>
    );
}

export default Register
