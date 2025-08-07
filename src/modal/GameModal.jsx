import {Button, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import api from "../util/axios.js";

const GameModal = ({show, handleClose, game}) => {
    const [modalGame, setModalGame] = useState(game);

    useEffect(() => {
        if (game) {
            setModalGame(game);
        }
    }, [game]);

    const refetchGame = () => {
        if (!modalGame) return;
        api.get(`/game-service/game/${modalGame.id}`)
            .then(response => {
                setModalGame(response.data);
            })
            .catch(error => {
                console.error("게임 정보를 다시 불러오는데 실패했습니다:", error);
                alert("게임 정보를 새로고침하는데 실패했습니다.");
                handleClose();
            });
    };

    if (!modalGame) {
        return null;
    }

    const currentUserEmail = localStorage.getItem('userEmail');
    const isHost = modalGame.createUser.userEmail === currentUserEmail;

    const entryGaeme = () => {
        api.put(`/game-service/game/entry/${modalGame.id}`).then(() => {
            alert("참가신청 완료");
            handleClose();
        }).catch(error => {
            console.error("게임 참가 신청 실패:", error);
            alert("참가 신청에 실패했습니다.");
        });
    };

    const approvePlayer = (approvedUserId) => {
        api.put(`/game-service/game/entry/confirm/${modalGame.id}/${approvedUserId}`).then(() => {
                alert("승인 완료");
                refetchGame();
            })
            .catch(error => {
                console.error("참가자 승인 실패:", error);
                alert("승인에 실패했습니다.");
            });
    };

    const deletePlayer = (deleteUserId) => {
        api.delete(`/game-service/game/entry/${modalGame.id}/${deleteUserId}`).then(() => {
            alert("삭제완료");
            refetchGame();
        }).catch(error => {
            alert("삭제에 실패했습니다.");
        })
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">게임 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div><strong>경기타입:</strong> {modalGame.gameType === '1' ? '연습게임' : '정규게임'}</div>
                <div><strong>주소:</strong> {modalGame.address} {modalGame.stadium}</div>
                <div><strong>모집 인원:</strong> {modalGame.maxPlayer}</div>
                <div><strong>게임일자:</strong> {modalGame.gameDate}</div>
                <div><strong>호스트:</strong> {modalGame.createUser.userName}</div>

                <hr />
                <h5>참가자</h5>
                {modalGame.players && modalGame.players.length > 0 ? (
                    <ul className="list-group">
                        {modalGame.players.map(player => (
                            <li key={player.userEmail} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{player.userName}</strong> ({player.nickName})
                                    <br />
                                </div>
                                {isHost && <Button variant="danger" size="sm" onClick={() => deletePlayer(player.userId)}>삭제</Button>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>참가자가 없습니다.</p>
                )}

                {isHost && (
                    <>
                        <hr />
                        <h5>참가 대기자 목록</h5>
                        {modalGame.waitingPlayers && modalGame.waitingPlayers.length > 0 ? (
                            <ul className="list-group">
                                {modalGame.waitingPlayers.map(waitingPlayer => (
                                    <li key={waitingPlayer.userEmail} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{waitingPlayer.userName}</strong> ({waitingPlayer.nickName})
                                            <br />
                                            <small className="text-muted">{waitingPlayer.userEmail}</small>
                                        </div>
                                        <Button variant="success" size="sm" onClick={() => approvePlayer(waitingPlayer.userId)}>승인</Button>
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
