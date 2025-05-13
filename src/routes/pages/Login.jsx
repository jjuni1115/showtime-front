import {Button, Card, Container, Form} from "react-bootstrap";
import useInput from "../../hook/useInput.jsx";
import api from "../../util/axios.js";
import {useNavigate, useNavigationType} from "react-router-dom";
import React, {useEffect, useState} from "react";

const Login = () =>{


  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const userId = useInput("",validateEmail);

  const userPw = useInput("");


  const navigate = useNavigate();
  const navigationType = useNavigationType();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if(token!==null){
      navigate("/home");
    }
  }, []);

  const fetchLogin = () =>{


    if(userId.value === "" || !userId.isValid){

        alert("이메일을 입력해주세요");
        return;

    }
    if(userPw.value === ""){

        alert("비밀번호를 입력해주세요");
        return;
    }

    api.post("/user-service/user/login",{
      userEmail: userId.value,
      userPassword: userPw.value

    },{skipAuth:true})
        .then(response => {

          localStorage.setItem("token",response.data.token);

          navigate("/home");



        }

        ).catch(error => {

           alert(error.data.message);

        }
    )
  }


  const handleEnter = (e) => {
    if(e.key === "Enter"){
      fetchLogin();
    }
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
              <Form.Control type="text" placeholder="전화번호, 사용자 이름 또는 이메일" value={userId.value} onChange={userId.handelInputValue} onKeyDown={handleEnter} />
              <Form.Control.Feedback type="invalid">
                유효하지 않은 이메일 주소입니다
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                이메일을 입력해주세요
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control type="password" placeholder="비밀번호" value={userPw.value} onChange={userPw.handelInputValue} onKeyDown={handleEnter} />
              <Form.Control.Feedback type="invalid">
                비밀번호를 입력해주세요
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" className="w-100" onClick={fetchLogin}>로그인</Button>
          </Form>

          <div className="my-2">또는</div>

          <Button variant="link" className="text-primary fw-bold" onClick={() => window.location.href = "http://localhost:8000/user-service/oauth2/authorization/google"}>
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
          계정이 없으신가요? <a href="/signup" className="text-primary fw-bold">가입하기</a>
        </Card>

      </div>
    </Container>
        </>


    );
}

export default Login;
