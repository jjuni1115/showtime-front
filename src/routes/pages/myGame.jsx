import { useEffect, useState, useRef } from "react";
import api from "../../util/axios.js";
import { Col, Container, Row, Form, InputGroup, Button } from "react-bootstrap";
import Game from "../../components/main/Game.jsx";
import GameModal from "../../modal/GameModal.jsx";
import useDebounce  from "../../hook/useDebounce.jsx";

const MyGame = () => {
    const [gameList, setGameList] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState();
    const [keyword, setKeyword] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const debouncedKeyword = useDebounce(keyword, 500);
    const devRef = useRef(null);
    const [totalCount, setTotalCount] = useState(0);
    let currPage = 0;
    let pageSize = 10;

    useEffect(() => {
        getGameList(currPage, pageSize);
    }, []);

    useEffect(() => {
        const divElement = devRef.current;

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = devRef.current;
            if ((scrollTop + clientHeight >= scrollHeight) && (totalCount > (currPage + 1) * pageSize)) {
                getGameList(++currPage, pageSize);
            }
        }

        divElement.addEventListener("scroll", handleScroll);
        return () => {
            divElement.removeEventListener("scroll", handleScroll);
        }
    }, [totalCount]);

    useEffect(() => {
        setGameList([]);
        getGameList(0, pageSize, debouncedKeyword, searchDate);
    }, [debouncedKeyword, searchDate]);

    const getGameList = (currPage, pageSize, keyword, date) => {
        api.get("/game-service/game/my-game", {
            params: {
                currPage: currPage,
                pageSize: pageSize,
                keyword: keyword
                //date: date
            }
        })
            .then(response => {
                setGameList(current => [...current, ...response.data.content]);
                setTotalCount(response.data.totalElements);
            })
            .catch(error => {
                console.error("Error fetching my games:", error);
            });
    }

    const handleGameClick = (game) => {
        setSelectedGame(game);
        setShowDetailModal(true);
    }

    const detailModalClose = () => {
        setShowDetailModal(false);
    }

    const handleSearch = () => {
        setGameList([]);
        getGameList(0, pageSize, keyword, searchDate);
    }

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h1>My Games</h1>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col md={8}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search by keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <Form.Control
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                        <Button onClick={handleSearch}>Search</Button>
                    </InputGroup>
                </Col>
            </Row>
            <div ref={devRef} style={{ maxHeight: '1000px', minHeight: '100px', overflow: 'scroll' }}>
                {gameList.length > 0 ? (
                    gameList.map((game, index) => (
                        <Row key={index} className="mb-3">
                            <Col>
                                <Game
                                    id={game.id}
                                    gameName={game.gameName}
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
                    ))
                ) : (
                    <div className="text-center">
                        <h5>참여중인 경기가 없습니다.</h5>
                    </div>
                )}
            </div>

            {selectedGame && (
                <GameModal show={showDetailModal} handleClose={detailModalClose} game={selectedGame} />
            )}
        </Container>
    );
};

export default MyGame;
