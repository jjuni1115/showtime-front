import {Card} from "react-bootstrap";


const Game = ({ gameName, gameType, maxPlayer, minPlayer, address, stadium, gameDate, onClick }) => {
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body className="d-flex align-items-center" onClick={onClick} style={{ cursor: 'pointer' }}>
                <Card.Img src='public/night_court.jpg' style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '15px' }} />
                <div>
                    <Card.Title>{gameName}</Card.Title>
                    <Card.Text as="div">
                        <div>경기타입:
                            {gameType === '1' && <span>연습게임</span>}
                            {gameType === '2' && <span>정규게임</span>}
                        </div>
                        <div>주소: {address} {stadium}</div>
                        <div>모집 인원 : {maxPlayer}</div>
                        <div>게임일자 : {gameDate}</div>
                    </Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Game;

