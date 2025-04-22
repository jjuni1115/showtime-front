import {Button, Modal} from "react-bootstrap";
import api from "../util/axios.js";

const GameModal = ({show, handleClose, game}) => {

    const entryGaeme = () => {
        console.log(game.id);
        api.put(`/game-service/game/entry/${game.id}`).then(response => {
            alert("참가신청 완료");
            handleClose();
        })
    }


    return (
        <Modal show={show} onClose={handleClose}>

            <Modal.Header closeButton onClick={handleClose}>
                <Modal.Title id="contained-modal-title-vcenter">게임 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>


                <div>경기타입: {game.gameType === '1' ? '연습게임' : '정규게임'}</div>
                <div>주소: {game.address} {game.stadium}</div>
                <div>모집 인원: {game.maxPlayer}</div>
                <div>게임일자: {game.gameDate}</div>


            </Modal.Body>

            <Modal.Footer>

                <Button variant='secondary' onClick={handleClose}>닫기</Button>
                <Button variant='primary' onClick={entryGaeme}>참가</Button>

            </Modal.Footer>


        </Modal>


    );


}


export default GameModal;
