import {Button, Modal} from "react-bootstrap";

const GameModal = ({show, handleClose, game}) => {


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
                <Button variant='primary'>참가</Button>

            </Modal.Footer>


        </Modal>


    );


}


export default GameModal;
