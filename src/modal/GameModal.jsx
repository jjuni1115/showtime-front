import {Button, Modal} from "react-bootstrap";
import api from "../util/axios.js";

const GameModal = ({show, handleClose, game}) => {
    const currentUserEmail = localStorage.getItem('userEmail');
    const isHost = game.createUser.userEmail === currentUserEmail;

    const entryGaeme = () => {
        api.put(`/game-service/game/entry/${game.id}`).then(() => {
            alert("참가신청 완료");
            handleClose();
        }).catch(error => {
            console.error("게임 참가 신청 실패:", error);
            alert("참가 신청에 실패했습니다.");
        });
    };

    const approvePlayer = (approvedUserId) => {
        api.put(`/entry/confirm/${game.id}/${approvedUserId}`)
            .then(() => {
                alert("승인 완료");
                handleClose(); // Or refresh data
            })
            .catch(error => {
                console.error("참가자 승인 실패:", error);
                alert("승인에 실패했습니다.");
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">게임 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div><strong>경기타입:</strong> {game.gameType === '1' ? '연습게임' : '정규게임'}</div>
                <div><strong>주소:</strong> {game.address} {game.stadium}</div>
                <div><strong>모집 인원:</strong> {game.maxPlayer}</div>
                <div><strong>게임일자:</strong> {game.gameDate}</div>
                <div><strong>호스트:</strong> {game.createUser.userName}</div>

                <hr />
                <h5>참가자</h5>
                {game.players && game.players.length > 0 ? (
                    <ul className="list-group">
                        {game.players.map(player => (
                            <li key={player.userId} className="list-group-item">{player.userName}</li>
                        ))}
                    </ul>
                ) : (
                    <p>참가자가 없습니다.</p>
                )}

                {isHost && (
                    <>
                        <hr />
                        <h5>참가 대기자 목록</h5>
                        {game.waitingPlayers && game.waitingPlayers.length > 0 ? (
                            <ul className="list-group">
                                {game.waitingPlayers.map(waitingPlayer => (
                                    <li key={waitingPlayer.userEmail} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{waitingPlayer.userName}</strong> ({waitingPlayer.userNickName})
                                            <br />
                                            <small className="text-muted">{waitingPlayer.userEmail}</small>
                                        </div>
                                        <Button variant="success" size="sm" onClick={() => approvePlayer(waitingPlayer.userEmail)}>승인</Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>참가 대기자가 없습니다.</p>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>닫기</Button>
                {!isHost && <Button variant='primary' onClick={entryGaeme}>참가</Button>}
            </Modal.Footer>
        </Modal>
    );
}

export default GameModal;
