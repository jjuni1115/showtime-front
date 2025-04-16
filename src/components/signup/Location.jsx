import { useState, useEffect } from "react";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import { FaSearch, FaTimes } from "react-icons/fa";
import useDebounce from "../../hook/useDebounce.jsx";
import api from "../../util/axios.js";

const Location = ({ userLocation, setUserLocation }) => {
    const [locationKeyword, setLocationKeyword] = useState("");
    const debounceKeyword = useDebounce(locationKeyword, 500);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (locationKeyword !== "") {
            api.get(`/user-service/address/${locationKeyword}`).then(response => {
                console.log(response);
                setLocations(response);
            });
        }
    }, [debounceKeyword]);

    const addAddress = (id, addressNm) => {
        if (userLocation.length < 5) {
            setUserLocation((current) => [...current, { id, addressNm }]);
            alert("추가완료");
        } else {
            alert("최대 5곳까지 선택 가능합니다.");
        }
    };

    const clearSearch = () => {
        setLocationKeyword("");
    };

    return (
        <>
            <p className="text-center">활동 지역을 선택해주세요 (최대 5곳 설정)</p>
            {userLocation.map((address, index) => (
                <p key={index}>{address.addressNm}</p>
            ))}

            <InputGroup className="mb-3">
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="검색"
                    value={locationKeyword}
                    onChange={(e) => setLocationKeyword(e.target.value)}
                />
                {locationKeyword && (
                    <Button variant="light" onClick={clearSearch}>
                        <FaTimes />
                    </Button>
                )}
            </InputGroup>

            <Button variant="outline-primary" className="w-100 mb-3">
                현재 위치로 찾기
            </Button>

            <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {locations.map((address) => (
                    <ListGroup.Item key={address.id} action onClick={() => addAddress(address.id, address.addressNm)}>
                        {address.addressNm}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );
};

export default Location;
