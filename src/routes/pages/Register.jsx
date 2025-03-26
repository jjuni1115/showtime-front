import {useNavigate, useNavigationType, useParams, useSearchParams} from "react-router-dom";
import {
    Button,
    ButtonGroup,
    Card,
    Container,

    Form,
    InputGroup, ListGroup,

    ToggleButton
} from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import useInput from "../../hook/useInput.jsx";
import api from "../../util/axios.js";
import {useEffect, useState} from "react";
import useDebounce from "../../hook/useDebounce.jsx";

const Register = () => {


    const [searchParam, setSearchParam] = useSearchParams();

    const userEmail = useInput(searchParam.get("email") ?? "");
    const userName = useInput(searchParam.get("name") ?? "");

    const [step,setStep] = useState(1);

    const [radioValue, setRadioValue] = useState('1');


    const userPassword = useInput("");

    const grade = ["최하","하","중","중상","상","최상"];



    const navigate = useNavigate();
    const navigationType = useNavigationType();


    const [locationKeyowrd,setLocationKeyword] = useState("");

    const debounceKeyword = useDebounce(locationKeyowrd, 500);

    const [locations, setLocations] = useState([]);

    useEffect(() => {

        if(locationKeyowrd!==null && locationKeyowrd !== "") {
            api.get(`/user-service/address/${locationKeyowrd}`).then(response => {
                setLocations(response);
            })
            console.log(locations);
        }

    }, [debounceKeyword]);

    const addAddress = (id) => {



    }

    const clearSearch = () =>{
        setLocationKeyword("");
    }




    const registerUser = () => {

        api.post("/user-service/user/register", {
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

    const nextStep = () => {
        if(step === 1 || step === 2){
            setStep(current => current + 1);
        }else {
            alert("register");
        }
    }

    return (
        <Container className="d-flex flex-column align-items-center vh-100">
            <Card className="p-4  mt-5" style={{width: "350px"}}>
                <h2 className="text-center mb-3">
                    Showtime
                </h2>
                <p className="text-center">즐거운 농구 시작하기</p>

                <hr className="text-light"/>

                {step === 1 && (

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
                        <Form.Check inline type="radio" label="남" name="gender" value="M"/>
                        <Form.Check inline type="radio" label="여" name="gender" value="F"/>
                    </Form.Group>

                </Form>
                    )}
                {step === 2 && (
                    <>
                    <p className="text-center">농구 실력을 선택해주세요</p>

                    <ButtonGroup className="mb-2">

                        {
                            grade.map((item,index) => (
                                <ToggleButton
                                    key={index}
                                    id={index}
                                    type="radio"
                                    variant="outline-primary"
                                    value={item}
                                    onChange={(e) => setRadioValue(e.currentTarget.value)}
                                    checked={radioValue === item}
                                >
                                    {item}
                                </ToggleButton>
                            ))
                        }

                    </ButtonGroup>
                    </>
                )}
                {
                 step === 3 && (
                     <>
                        <p className="text-center">활동 지역을 선택해주세요 (최대 5곳 설정)</p>
                         <InputGroup className="mb-3">
                             <InputGroup.Text>
                                 <FaSearch />
                             </InputGroup.Text>
                             <Form.Control
                                 type="text"
                                 placeholder="검색"
                                 value={locationKeyowrd}
                                 onChange={(e) => setLocationKeyword(e.target.value)}
                             />
                             {locationKeyowrd && (
                                 <Button variant="light" onClick={clearSearch}>
                                     <FaTimes />
                                 </Button>
                             )}
                         </InputGroup>

                         <Button variant="warning" className="w-100 mb-3">
                             현재 위치로 찾기
                         </Button>

                         <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                             {locations.map((address, index) => (
                                 <ListGroup.Item key={address.id} onClick={addAddress(address.id)}>{address.address}</ListGroup.Item>
                             ))}
                         </ListGroup>

                     </>

                    )
                }

                <Button variant="primary" className="w-100" onClick={nextStep}>
                    {
                        step === 3 ? "회원가입" : "다음"
                    }
                </Button>
            </Card>



            <p className="mt-3 text-white">앱을 다운로드하세요.</p>
        </Container>
    );
}

export default Register
