import {Button, Form, Modal} from "react-bootstrap";
import ReactQuill from "react-quill";
import DaumPostcodeEmbed, {useDaumPostcodePopup} from "react-daum-postcode";
import {useState} from "react";
import useInput from "../hook/useInput.jsx";
import api from "../util/axios.js";

const GameRegisterModal = ({show, handleClose}) => {
    const open = useDaumPostcodePopup();

    const gameTile = useInput("");
    const [gameContent, setGameConenet] = useState("");
    const minPlayers = useInput(null,"/^\d*$/.");
    const maxPlayers = useInput(null,"/^\d*$/.");
    const gameDate = useInput("");
    const gameTime = useInput("");
    const stadium = useInput("");
    const [gameLocation, setGameLocation] = useState("");
    const [radioValue, setRadioValue] = useState("");

    const [invalidateField, setInvalidateField] = useState({
        gameTile: false,
        gameContent: false,
        minPlayers: false,
        maxPlayers: false,
        gameDate: false,
        gameTime: false,
        stadium: false,
        gameLocation: false,
        gameType: false,
    })

    const [addressModalShow, setAddressModalShow] = useState(false);

    const addressButtonClick = () => {
        open({onComplete: setAddress});
    };

    const setAddress = (data) => {
        setGameLocation(data.address);
    };

    const handleRadioChange = (e) => {
        setRadioValue(e.target.value);
    };

    const registerGame = () => {
        if (isValid()) {

            api.post("/game-service/game", {
                gameName: gameTile.value,
                content: gameContent.value,
                gameType: radioValue,
                maxPlayers: parseInt(maxPlayers.value),
                minPlayers: parseInt(minPlayers.value),
                address: gameLocation,
                stadium: stadium.value,
                gameDate: gameDate.value.replaceAll("-", "") + " " + gameTime.value,
            }).then((response) => {

                    alert("게임 등록 완료");
                    handleClose();

            }).catch(
                (error) => {
                    alert("게임 등록 실패 : "+error.data.message);
                }
            );
        }
    };

    const isValid = () => {

        let valid = true;
        const checkValidation = {...invalidateField};
        if (gameTile.value === "") {
            checkValidation.gameTile = true;
            valid = false;
        }
        if (gameContent.value === "") {
            checkValidation.gameContent = true;
            valid = false;
        }
        if (minPlayers.value === "" || minPlayers.value <= 0) {
            checkValidation.minPlayers = true;
            valid = false;
        }
        if (maxPlayers.value === "" || maxPlayers.value <= 0) {
            checkValidation.maxPlayers = true;
            valid = false;
        }
        if (gameDate.value === "") {
            checkValidation.gameDate = true;
            valid = false;
        }
        if (gameTime.value === "") {
            checkValidation.gameTime = true;
            valid = false;
        }
        if (stadium.value === "") {
            checkValidation.stadium = true;
            valid = false;
        }
        if (gameLocation === "") {
            checkValidation.gameLocation = true;
        }
        if (radioValue === "") {
            checkValidation.gameType = true;
            valid = false;
        }

        setInvalidateField(checkValidation);

        return valid;

    }

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">게임 등록</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formGameTitle" className="mb-3">
                        <Form.Label>경기 제목</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="경기 제목 입력"
                            value={gameTile.value}
                            onChange={gameTile.handelInputValue}
                            isInvalid={invalidateField.gameTile}
                        />
                        <Form.Control.Feedback type="invalid">
                            경기 제목을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formGameType" className="mb-3">
                        <Form.Label>경기타입</Form.Label>
                        <div className="mb-2">
                            <Form.Check
                                inline
                                type="radio"
                                label="연습경기"
                                name="gameType"
                                value="1"
                                onChange={handleRadioChange}
                                isInvalid={invalidateField.gameType}
                            />
                            <Form.Check
                                inline
                                type="radio"
                                label="정규게임"
                                name="gameType"
                                value="2"
                                onChange={handleRadioChange}
                                isInvalid={invalidateField.gameType}
                            />
                        </div>
                        {invalidateField.gameType &&
                            <Form.Control.Feedback type="invalid" style={{display: "block"}}>
                                경기타입을 선택해주세요.
                            </Form.Control.Feedback>}
                    </Form.Group>
                    <Form.Group controlId="formGameContent" className="mb-3">
                        <Form.Label>경기 내용</Form.Label>
                        <ReactQuill
                            style={{width: "100%", height: "100%"}}
                            value={gameContent}
                            onChange={setGameConenet}
                        />
                        {invalidateField.gameContent &&
                            <Form.Control.Feedback type="invalid" style={{display: "block"}}>
                                경기 내용을 입력해주세요.
                            </Form.Control.Feedback>}
                    </Form.Group>
                    <Form.Group controlId="formMinPlayers" className="mb-3">
                        <Form.Label>최소 인원</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="최소 인원 입력"
                            value={minPlayers.value}
                            onChange={minPlayers.handelInputValue}
                            isInvalid={invalidateField.minPlayers}
                        />
                        <Form.Control.Feedback type="invalid">
                            최소 인원을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formMaxPlayers" className="mb-3">
                        <Form.Label>최대 인원</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="최대 인원 입력"
                            value={maxPlayers.value}
                            onChange={maxPlayers.handelInputValue}
                            isInvalid={invalidateField.maxPlayers}
                        />
                        <Form.Control.Feedback type="invalid">
                            최대 인원을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formGameDate" className="mb-3">
                        <Form.Label>경기 날짜</Form.Label>
                        <Form.Control
                            type="date"
                            value={gameDate.value}
                            onChange={gameDate.handelInputValue}
                            isInvalid={invalidateField.gameDate}
                        />
                        <Form.Control.Feedback type="invalid">
                            경기 날짜를 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formGameTime" className="mb-3">
                        <Form.Label>경기 시간</Form.Label>
                        <Form.Control
                            type="time"
                            value={gameTime.value}
                            onChange={gameTime.handelInputValue}
                            isInvalid={invalidateField.gameTime}
                        />
                        <Form.Control.Feedback type="invalid">
                            경기 시간을 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formGameLocation" className="mb-3">
                        <Form.Label>주소</Form.Label>
                        <Form.Control
                            type="text"
                            onClick={addressButtonClick}
                            placeholder="주소 입력"
                            value={gameLocation}
                            isInvalid={invalidateField.gameLocation}
                        />
                        <Form.Control.Feedback type="invalid">
                            주소를 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formGameLocation" className="mb-3">
                        <Form.Label>경기 장소</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="경기 장소 입력"
                            value={stadium.value}
                            onChange={stadium.handelInputValue}
                            isInvalid={invalidateField.stadium}
                        />
                        <Form.Control.Feedback type="invalid">
                            경기 장소를 입력해주세요.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
                <Button variant="primary" onClick={registerGame}>
                    등록
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GameRegisterModal;
