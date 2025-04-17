import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import api from "../../util/axios.js";
import {Card, Col, Container, Row, Form} from "react-bootstrap";
import Game from "../../components/main/Game.jsx";
import GameModal from "../../components/main/GameModal.jsx";

const Home = () => {
    const [searchParams] = useSearchParams();
    const [gameList, setGameList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState();
    const devRef = useRef(null);

    useEffect(() => {
        api.get("/game-service/game").then(response => {
            setGameList(response.content); // Ensure you're accessing the correct data structure
        });
    }, []);

    useEffect(() => {
        const divElement = devRef.current;
        divElement.addEventListener("scroll", handleScroll);
        return () => {
            divElement.removeEventListener("scroll", handleScroll);
        }
    }, []);

    const handleGameClick = (game) => {
        console.log('click');
        setSelectedGame(game);
        setShowModal(true);
    }

    const handleClose = () => {setShowModal(false)}

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = devRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
            // Load more data here
            console.log("Load more data");
        }
    }

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <Form.Control type="text" placeholder="검색어를 입력해주세요"/>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className="text-end">
                    <div>전체 2405개</div>
                    <div>showtime 추천순</div>
                </Col>
            </Row>
            <div
                ref={devRef}
                style={{maxHeight: '500px', overflowY: 'scroll'}}>
                {gameList.map((game, index) => (
                    <Row key={game.id} className="mb-3">
                        <Col>
                            <Game
                                gameName={game.game_name}
                                gameType={game.gameType}
                                gameDate={game.gameDate}
                                maxPlayer={game.maxPlayer}
                                minPlayer={game.minPlayer}
                                address={game.address}
                                stadium={game.stadium}
                                onClick={() => handleGameClick(game)}
                            />
                        </Col>
                    </Row>
                ))}
            </div>


            {selectedGame && (
                <GameModal show={showModal} handleClose={handleClose} game={selectedGame}/>
            )}
        </Container>
    );
}

export default Home;
