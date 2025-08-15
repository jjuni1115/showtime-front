import { useEffect, useState, useRef } from "react";
import api from "../../util/axios.js";
import { Col, Container, Row, Form, InputGroup, Button, Tabs, Tab, Card, Spinner } from "react-bootstrap";
import Game from "../../components/main/Game.jsx";
import GameModal from "../../modal/GameModal.jsx";
import useDebounce from "../../hook/useDebounce.jsx";

const MyGame = () => {
    const [gameLists, setGameLists] = useState({
        inProgress: [],
        past: [],
        created: []
    });
    const [activeTab, setActiveTab] = useState('inProgress');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 500);
    const devRef = useRef(null);
    const [totalCounts, setTotalCounts] = useState({
        inProgress: 0,
        past: 0,
        created: 0
    });
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    const tabToState = {
        inProgress: 1,
        past: 2,
        created: 3
    };

    useEffect(() => {
        setGameLists(prev => ({ ...prev, [activeTab]: [] }));
        setPage(0);
        getGameList(0, pageSize, debouncedKeyword, activeTab, tabToState[activeTab]);
    }, [debouncedKeyword, activeTab]);

    useEffect(() => {
        const divElement = devRef.current;
        const handleScroll = () => {
            if (divElement.scrollHeight - divElement.scrollTop === divElement.clientHeight) {
                const currentList = gameLists[activeTab];
                const totalCount = totalCounts[activeTab];
                if (currentList.length < totalCount) {
                    const newPage = page + 1;
                    setPage(newPage);
                    getGameList(newPage, pageSize, debouncedKeyword, activeTab, tabToState[activeTab]);
                }
            }
        };

        divElement?.addEventListener("scroll", handleScroll);
        return () => divElement?.removeEventListener("scroll", handleScroll);
    }, [gameLists, activeTab, totalCounts, page, debouncedKeyword]);

    const getGameList = (currPage, pageSize, keyword, status, myGameState) => {
        setLoading(true);
        api.get("/game-service/game/my-game", {
            params: {
                currPage,
                pageSize,
                keyword,
                myGameState
            }
        })
        .then(response => {
            const { content, totalElements } = response.data;
            setGameLists(prev => ({
                ...prev,
                [status]: currPage === 0 ? content : [...prev[status], ...content]
            }));
            setTotalCounts(prev => ({ ...prev, [status]: totalElements }));
        })
        .catch(error => {
            console.error(`Error fetching ${status} games:`, error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleGameClick = (game) => {
        setSelectedGame(game);
        setShowDetailModal(true);
    };

    const detailModalClose = () => {
        setShowDetailModal(false);
        setSelectedGame(null);
    };

    const renderGameList = (list) => {
        if (loading && list.length === 0) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }
        if (list.length === 0) {
            return (
                <div className="text-center py-5">
                    <h5>해당 경기가 없습니다.</h5>
                </div>
            );
        }
        return list.map((game) => (
            <Row key={game.id} className="mb-3">
                <Col>
                    <Game {...game} onClick={() => handleGameClick(game)} />
                </Col>
            </Row>
        ));
    };

    return (
        <Container fluid="lg" className="mt-4">
            <Row className="justify-content-center">
                <Col lg={10} md={12}>
                    <h1 className="mb-4" style={{ fontWeight: 'bold' }}>My Games</h1>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Row className="mb-3">
                                <Col>
                                    <InputGroup>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search by keyword"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            className="rounded-pill"
                                        />
                                    </InputGroup>
                                </Col>
                            </Row>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                id="my-games-tabs"
                                className="mb-3 nav-pills"
                                fill
                            >
                                <Tab eventKey="inProgress" title="진행중인 경기">
                                    <div ref={devRef} style={{ maxHeight: '60vh', overflowY: 'auto' }} className="p-1">
                                        {renderGameList(gameLists.inProgress)}
                                    </div>
                                </Tab>
                                <Tab eventKey="past" title="지난 경기">
                                     <div ref={devRef} style={{ maxHeight: '60vh', overflowY: 'auto' }} className="p-1">
                                        {renderGameList(gameLists.past)}
                                    </div>
                                </Tab>
                                <Tab eventKey="created" title="내가 생성한 경기">
                                     <div ref={devRef} style={{ maxHeight: '60vh', overflowY: 'auto' }} className="p-1">
                                        {renderGameList(gameLists.created)}
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {selectedGame && (
                <GameModal show={showDetailModal} handleClose={detailModalClose} game={selectedGame} />
            )}
        </Container>
    );
};

export default MyGame;