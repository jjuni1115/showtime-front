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
import {FaCheckCircle, FaSearch, FaTimes} from "react-icons/fa";
import useInput from "../../hook/useInput.jsx";
import api from "../../util/axios.js";
import {useEffect, useState} from "react";
import useDebounce from "../../hook/useDebounce.jsx";

const Register = () => {

    //validation
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValidte = (password) => {
        if (password.length < 8 || password.length > 20) {
            return false;
        }

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        return hasSpecial && ((hasUpper + hasLower + hasDigit) >= 2);
    }


    const [searchParam, setSearchParam] = useSearchParams();

    const userEmail = useInput(searchParam.get("email") ?? "", validateEmail);
    const userName = useInput(searchParam.get("name") ?? "");
    const nickName = useInput("");

    const [skill, setSkill] = useState("");

    const [step, setStep] = useState(1);

    const [radioValue, setRadioValue] = useState("");

    const handleRadioChange = (e) => {
        setRadioValue(e.target.value);
        setInvalidateField((current) => ({...current, gender: false}));
    }

    const handleSkillValue = (e) => {
        setSkill(e.target.value);
        setInvalidateField((current) => ({...current, skill: false}));
    }


    const userPassword = useInput("", passwordValidte);

    const grade = ["최하", "하", "중", "중상", "상", "최상"];

    const navigate = useNavigate();
    const navigationType = useNavigationType();



    const [locationKeyowrd,setLocationKeyword] = useState("");
    const debounceKeyword = useDebounce(locationKeyowrd, 500);
    const [locations, setLocations] = useState([]);
    const [userLocation, setUserLocation] = useState([]);


    useEffect(() => {

        if(locationKeyowrd!==null && locationKeyowrd !== "") {
            api.get(`/user-service/address/${locationKeyowrd}`).then(response => {
                setLocations(response.data);
            })
        }

    }, [debounceKeyword]);

    const addAddress = (addressId, addressNm) => {
            const foundAddress = userLocation.find((location) => location.addressId === addressId);

            if(foundAddress){
                setUserLocation((current) => current.filter((location) => location.addressId !== addressId));
            }else {
                if (userLocation.length < 5) {
                    setUserLocation((current) => [...current, {addressId, addressNm}]);
                } else {
                    alert("최대 5개까지 선택 가능합니다.");
                }
            }

    }

    const clearSearch = () =>{
        setLocationKeyword("");
    }

    const [invalidateField, setInvalidateField] = useState({
        userEmail: false,
        userPassword: false,
        userName: false,
        nickName: false,
        gender: false,
        skill: false,
        locations: false
    });


    const registerUser = () => {

        api.post("/user-service/user/register", {
            "userEmail": userEmail.value,
            "userPassword": userPassword.value,
            "userName": userName.value,
            "nickName": nickName.value,
            "gender": radioValue,
            "skill": skill,
            "addressList": userLocation.map(address => address.addressId),
            "age":30

        }, {skipAuth: true}).then(response => {

            alert("회원가입이 완료되었습니다");
            navigate("/");

        })

    }

    const nextStep = () => {

        if (!isValid()) {
            console.log("valid end")
            return;
        } else {
            if (step === 3) {
                registerUser();
            } else {
                setStep(currentStep => currentStep + 1);
            }

        }
    }

    const previosStep = () => {

        if (step !== 1) setStep(currentStep => currentStep - 1);
    }

    const handleInputChange = (field, value, validator = () => true) => {
        if (validator(value)) {
            setInvalidateField((current) => ({...current, [field]: false}));
        } else {
            setInvalidateField((current) => ({...current, [field]: true}));
        }
    };


    const isValid = () => {
        console.log("valid start")

        let valid = true;

        const checkValidation = {...invalidateField};

        if (step === 1) {
            if (userEmail.value === "" || !userEmail.isValid) {
                checkValidation.userEmail = true;
                valid = false;
            }
            if (userPassword.value === "" || !userPassword.isValid) {
                checkValidation.userPassword = true;
                valid = false;
            }
            if (userName.value === "") {
                checkValidation.userName = true;
                valid = false;
            }
            if (nickName.value === "") {
                checkValidation.nickName = true;
                valid = false;
            }
            if (radioValue === "") {
                checkValidation.gender = true;
                valid = false;
            }
        } else if (step === 2) {

            if(skill === ""){
                checkValidation.skill = true;
                valid = false;
            }

        }
        setInvalidateField(checkValidation);

        return valid;
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
                    {step === 1 && (
                        <>

                            <Form.Group className="mb-2">
                                <Form.Label>사용자 이메일</Form.Label>
                                <Form.Control type="email" value={userEmail.value}
                                              onChange={(e) => {
                                                  userEmail.handelInputValue(e);
                                                  handleInputChange("userEmail", e.target.value, validateEmail)
                                              }}
                                              disabled={!!searchParam.get("email")}
                                              isInvalid={invalidateField.userEmail}
                                              required/>
                                <Form.Control.Feedback type="invalid">
                                    유효하지 않은 이메일 주소입니다
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>비밀번호</Form.Label>
                                <Form.Control type="password" value={userPassword.value}
                                              isInvalid={invalidateField.userPassword}
                                              onChange={(e) => {
                                                  userPassword.handelInputValue(e);
                                                  handleInputChange("userPassword", e.target.value, passwordValidte)
                                              }} required/>
                                <Form.Control.Feedback type="invalid">
                                    패스워드 양식이 틀렸습니다.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>이름</Form.Label>
                                <Form.Control type="text" value={userName.value}
                                              isInvalid={invalidateField.userName}
                                              onChange={(e) => {
                                                  userName.handelInputValue(e);
                                                  handleInputChange("userName", e.target.value)
                                              }}
                                              disabled={!!searchParam.get("name")}
                                />
                                <Form.Control.Feedback type="invalid">필수값입니다.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>닉네임</Form.Label>
                                <Form.Control type="text" name="nickName" value={nickName.value}
                                              isInvalid={invalidateField.nickName}
                                              onChange={(e) => {
                                                  nickName.handelInputValue(e);
                                                  handleInputChange("nickName", e.target.value)
                                              }}
                                              required/>
                                <Form.Control.Feedback type="invalid">필수값입니다.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>성별 <br/> </Form.Label>
                                <Form.Check inline type="radio" label="남" name="gender" value="M"
                                            isInvalid={invalidateField.gender} onChange={handleRadioChange}/>
                                <Form.Check inline type="radio" label="여" name="gender" value="F"
                                            isInvalid={invalidateField.gender} onChange={handleRadioChange}/>
                                {invalidateField.gender && (

                                    <Form.Control.Feedback type="invalid" style={{display: "block"}}>
                                        성별을 선택해주세요.
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </>


                    )}
                    {step === 2 && (
                        <>
                            <p className="text-center">농구 실력을 선택해주세요</p>

                            <ButtonGroup className="mb-3">

                                {
                                    grade.map((item, index) => (
                                        <ToggleButton
                                            key={index}
                                            id={`skill-${index}`}
                                            type="radio"
                                            variant="outline-primary"
                                            value={item}
                                            checked={skill === item}
                                            onChange={handleSkillValue}
                                        >
                                            {item}
                                        </ToggleButton>

                                    ))
                                }

                            </ButtonGroup>
                            {invalidateField.skill && (
                                <Form className="text-center">
                                    <Form.Control.Feedback type="invalid" style={{display: "block"}}>
                                        실력을 선택해주세요.
                                    </Form.Control.Feedback>
                                </Form>
                            )}

                        </>
                    )}
                    {
                        step === 3 && (
                            <>
                                <p className="text-center">활동 지역을 선택해주세요 (최대 5곳 설정)</p>
                                {userLocation.map((address, index) => (
                                    <p key={index}>{address.addressNm}</p>
                                ))}
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
                                    {locations.map((address, index) => {
                                        // userLocation에 해당 address.id가 있는지 확인
                                        const isAddressSelected = userLocation.some((location) => location.addressId === address.id);

                                        return (
                                            <ListGroup.Item
                                                key={address.id}
                                                onClick={() => addAddress(address.id, address.addressNm)}
                                                style={{
                                                    backgroundColor: isAddressSelected ? '#f0f8ff' : 'transparent', // 선택된 주소는 배경색 변경
                                                    borderColor: isAddressSelected ? '#007bff' : '#ddd', // 선택된 주소는 테두리 색 변경
                                                    color: isAddressSelected ? '#007bff' : 'inherit', // 선택된 주소는 텍스트 색 변경
                                                }}
                                            >
                                                {isAddressSelected && <FaCheckCircle style={{ marginRight: '10px', color: '#007bff' }} />}
                                                {address.addressNm}
                                            </ListGroup.Item>
                                        );
                                    })}
                                </ListGroup>

                            </>

                        )
                    }


                    <Button onClick={nextStep} variant="primary" className="w-100 mb-3">
                        {step === 3 ? "회원가입" : "다음"}
                    </Button>
                    {

                        step !== 1 && (
                            <Button onClick={previosStep} variant="warning" className="w-100 mt-2">이전</Button>)

                    }
                </Form>
            </Card>


            <p className="mt-3 text-white">앱을 다운로드하세요.</p>
        </Container>
    )
        ;
}


export default Register
