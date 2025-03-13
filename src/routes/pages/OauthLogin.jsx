import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";

const OauthLogin = () => {

    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useSearchParams();
    useEffect(() => {

        const token = searchParam.get("token");
        if(token!==null){
            console.log(token);
            localStorage.setItem("token",token);
            navigate("/home");
        }
    }, []);




    return(
        <>
        </>
    );

}

export default OauthLogin;
