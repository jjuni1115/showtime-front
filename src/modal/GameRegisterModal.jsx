import {Button, Form, Modal} from "react-bootstrap";
import ReactQuill from "react-quill";
import DaumPostcodeEmbed, {useDaumPostcodePopup} from "react-daum-postcode";
import {data} from "react-router-dom";
import {useState} from "react";
import useInput from "../hook/useInput.jsx";
import api from "../util/axios.js";

const GameRegisterModal = ({show, handleClose}) => {

    const open = useDaumPostcodePopup();

    const gameTile = useInput("");
    const gameContent = useInput("");
    const minPlayers = useInput(0);
    const maxPlayers = useInput(0);
    const gameDate = useInput("");
    const gameTime = useInput("");
    const [gameLocation, setGameLocation] = useState("");

    const [addressModalShow, setAddressModalShow] = useState(false);

    const addressButtonClick = () => {
        open({onComplete: setAddress, });
    }

    const setAddress = (data) => {
        setGameLocation(data.address);
    }

    const registerGame = () => {

        console.log(gameDate.value);
        console.log(gameTime.value);

        api.post("/game-service/game",{
            gameName: gameTile.value,
            content: gameContent.value,
            gameType: "1",
            maxPlayers: maxPlayers.value,
            minPlayers: minPlayers.value,
            address: gameLocation,
            stadium: "1코드",
            gameDate: gameDate.value.replaceAll("-","") + " " + gameTime.value,
        }).then(response => {
            console.log(response);
            if(response.success === true){
                console.log(response);
                alert("게임 등록 완료");
                handleClose();
            }else{
                alert("게임 등록 실패");
            }

        })

    }

    return (
        <Modal show={show} onClose={handleClose}>

            <Modal.Header closeButton onClick={handleClose}>

                <Modal.Title id="contained-modal-title-vcenter">게임 등록</Modal.Title>

            </Modal.Header>

            <Modal.Body>


                <Form>
                    <Form.Group controlId="formGameTitle">
                        <Form.Label>경기 제목</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="경기 제목 입력"
                            value={gameTile.value}
                            onChange={gameTile.handelInputValue}
                        />
                    </Form.Group>
                    <Form.Group controlId="formGameContent">
                        <Form.Label>경기 내용</Form.Label>
                        <ReactQuill
                            style={{width: '100%', height: '100%'}}
                            value={gameContent.value}
                            onChange={gameContent.handelInputValue}
                        />
                    </Form.Group>
                    <Form.Group controlId="formMinPlayers">
                        <Form.Label>최소 인원</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="최소 인원 입력"
                            value={minPlayers.value}
                            onChange={minPlayers.handelInputValue}
                        />
                    </Form.Group>
                    <Form.Group controlId="formMaxPlayers">
                        <Form.Label>최대 인원</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="최대 인원 입력"
                            value={maxPlayers.value}
                            onChange={maxPlayers.handelInputValue}
                        />
                    </Form.Group>
                    <Form.Group controlId="formGameDate">
                        <Form.Label>경기 날짜</Form.Label>
                        <Form.Control
                            type="date"
                            value={gameDate.value}
                            onChange={gameDate.handelInputValue}
                        />
                    </Form.Group>
                    <Form.Group controlId="formGameTime">
                        <Form.Label>경기 시간</Form.Label>
                        <Form.Control
                            type="time"
                            value={gameTime.value}
                            onChange={gameTime.handelInputValue}
                        />
                    </Form.Group>
                    <Form.Group controlId="formGameLocation">
                        <Form.Label>경기 장소</Form.Label>
                        <Form.Control
                            type="text"
                            onClick={addressButtonClick}
                            placeholder="경기 장소 입력"
                            value={gameLocation}
                        />
                    </Form.Group>
                </Form>


            </Modal.Body>

            <Modal.Footer>

                <Button variant='secondary' onClick={handleClose}>닫기</Button>
                <Button variant='primary' onClick={registerGame}>등록</Button>

            </Modal.Footer>



        </Modal>
    )


}

export default GameRegisterModal;
