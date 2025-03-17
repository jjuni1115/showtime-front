import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../util/axios.js";

const Home = () =>{

    const [searchParams] = useSearchParams();

    const [temp,setTemp] = useState("");

    useEffect(() => {

        api.get("/user-service/user/test").then(response => setTemp(response));


    }, []);

    return(
<>
    <p>Hello</p>
    {temp}
</>
    );
}

export default Home;
