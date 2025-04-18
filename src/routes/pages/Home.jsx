import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import api from "../../util/axios.js";
import {Card, Col, Container, Row, Form} from "react-bootstrap";
import Game from "../../components/main/Game.jsx";
import GameModal from "../../components/main/GameModal.jsx";
import game from "../../components/main/Game.jsx";

const Home = () => {
    const [searchParams] = useSearchParams();
    const [gameList, setGameList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState();
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


    const handleGameClick = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    }

    const modalClose = () => {setShowModal(false)}



    const getGameList = (currPage,pageSize,keyword) => {
        api.get("/game-service/game",{
            params:{
                pageSize: pageSize,
                currPage: currPage
            }
        }).then(response => {
            setGameList(current => [...current,...response.content]);
            console.log(response.totalElements);
            setTotalCount(current => current=response.totalElements);
        });
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
                {
                    gameList.length === 0 && (
                        <div className="text-center">
                            <h5>경기가 없습니다.</h5>
                        </div>
                    )
                }
            </div>


            {selectedGame && (
                <GameModal show={showModal} handleClose={modalClose} game={selectedGame}/>
            )}
        </Container>
    );
}

export default Home;
