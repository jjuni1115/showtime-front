import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import api from "../../util/axios.js";
import {Card, Col, Container, Row, Form, Button, Spinner} from "react-bootstrap";
import Game from "../../components/main/Game.jsx";
import GameModal from "../../modal/GameModal.jsx";
import game from "../../components/main/Game.jsx";
import GameRegisterModal from "../../modal/GameRegisterModal.jsx";
import useInput from "../../hook/useInput.jsx";
import useDebounce from "../../hook/useDebounce.jsx";

const Home = () => {
    const [searchParams] = useSearchParams();
    const [gameList, setGameList] = useState([]);
    const [loading, setLoading] = useState(false);




    const keyword = useInput("");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState();
    const devRef = useRef(null);
    const [totalCount, setTotalCount] = useState(0);
    let currPage = 0;
    let pageSize = 10;

    const debounceKeyword = useDebounce(keyword.value, 500);

    useEffect(() => {
        getGameList(currPage, pageSize);
    }, []);

    useEffect(() => {
        const divElement = devRef.current;

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight, id } = devRef.current;
            console.log(totalCount,currPage,pageSize,id);
            if ((scrollTop + clientHeight >= scrollHeight) && (totalCount > (currPage+1)*pageSize)) {
                getGameList(++currPage,pageSize);
            }
        }

        divElement.addEventListener("scroll", handleScroll);
        return () => {
            divElement.removeEventListener("scroll", handleScroll);
        }
    }, [totalCount]);

    useEffect(() => {

        if(keyword.value!==null && keyword.value !== "") {
            setGameList([]);
            getGameList(currPage,pageSize,keyword.value);
        }

    }, [debounceKeyword]);


    const handleGameClick = (game) => {
        setSelectedGame(game);
        setShowDetailModal(true);
    }

    const handleCreateGame = () => {
        setShowRegisterModal(true);
    }

    const detailModalClose = () => {setShowDetailModal(false);}
    const registerModalClose = () => {setShowRegisterModal(false); setGameList([]); getGameList(0,pageSize);}



    const getGameList = (currPage,pageSize,keyword) => {
        setLoading(true);
        api.get("/game-service/game",{
            params:{
                pageSize: pageSize,
                currPage: currPage,
                keyword: keyword
            }
        }).then(response => {
            console.log(response);
            setGameList(current => [...current,...response.data.content]);
            console.log(response.totalElements);
            setTotalCount(current => current=response.data.totalElements);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <Form.Control type="text" style={{display: 'inline-block' , width:'90%' , marginRight: '10px' }} placeholder="검색어를 입력해주세요" value={keyword.value} onChange={keyword.handelInputValue}/>
                    <Button style={{display: 'inline-block'}} onClick={handleCreateGame}>게임등록</Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className="text-end">
                    <div>전체 {totalCount}개</div>
                    <div>showtime 추천순</div>
                </Col>
            </Row>
            <div
                ref={devRef}
                style={{ maxHeight: '1000px', minHeight: '100px', overflow: 'scroll' }}
                id={totalCount}>
                {gameList.length > 0 &&
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
                                keyword={keyword.value}
                            />
                        </Col>
                    </Row>
                ))}
                {
                    loading && gameList.length === 0 && (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    )
                }
                {
                    !loading && gameList.length === 0 && (
                        <div className="text-center">
                            <h5>경기가 없습니다.</h5>
                        </div>
                    )
                }
            </div>


            {selectedGame && (
                <GameModal show={showDetailModal} handleClose={detailModalClose} game={selectedGame}/>
            )}
            {
                showRegisterModal && (
                    <GameRegisterModal show={showRegisterModal} handleClose={registerModalClose}></GameRegisterModal>
                )
            }
        </Container>
    );
}

export default Home;
