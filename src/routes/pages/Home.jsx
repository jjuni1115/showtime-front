import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";

const Home = () =>{

    const [searchParams] = useSearchParams();

    useEffect(() => {

        const token = searchParams.get("token");

        if(token){
            sessionStorage.setItem("token",token);
            console.log(token);
        }


    }, []);

    return(
<>
    <p>Hello</p>
</>
    );
}

export default Home;
