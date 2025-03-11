import {useNavigate, useNavigationType, useParams, useSearchParams} from "react-router-dom";
import {Button, Card, Container, Form} from "react-bootstrap";
import useInput from "../../hook/useInput.jsx";
import api from "../../util/axios.js";
import {useEffect} from "react";

const Register = () => {


    const [searchParam, setSearchParam] = useSearchParams();

    const userEmail = useInput(searchParam.get("email"));
    const userName = useInput(searchParam.get("name"));


    const userPassword = useInput("");

    const navigate = useNavigate();
    const navigationType = useNavigationType();


    const registerUser = () => {

        api.post("/user/register", {
            "userEmail": userEmail.value,
            "userPassword": userPassword.value,
            "userName": userName.value,
            "nickName": document.querySelector("input[name=nickName]").value,
            "gender": document.querySelector("input[name='gender']:checked")?.value,

        },{skipAuth:true}).then(response => {

            alert("회원가입이 완료되었습니다");
            navigate("/");

        })

    }

    return (
        <Container className="d-flex flex-column align-items-center vh-100">
            <Card className="p-4  mt-5" style={{width: "350px"}}>
                <h2 className="text-center mb-3">
                    Showtime
                </h2>
                <p className="text-center">즐거운 농구 시작하기</p>

                <hr className="text-light"/>

                <Form>
                    <Form.Group className="mb-2">
                        <Form.Control type="email" placeholder="이메일 주소" value={userEmail.value}
                                      onChange={userEmail.handelInputValue} disabled={!!searchParam.get("email")}/>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Control type="password" placeholder="비밀번호" value={userPassword.value}
                                      onChange={userPassword.handelInputValue}/>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Control type="text" placeholder="성명" value={userName.value}
                                      onChange={userName.handelInputValue} disabled={!!searchParam.get("name")}/>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Control type="text" placeholder="닉네임" name="nickName"/>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Check inline type="radio" label="남" name="gender"/>
                        <Form.Check inline type="radio" label="여" name="gender"/>
                    </Form.Group>
                    <Button variant="primary" className="w-100" onClick={registerUser}>
                        가입
                    </Button>
                </Form>
            </Card>

            <p className="mt-3 text-white">앱을 다운로드하세요.</p>
        </Container>
    );
}

export default Register
