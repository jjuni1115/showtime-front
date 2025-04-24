import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {"Content-Type": "application/json"},
    timeout: 5000,
});


api.interceptors.request.use((config)=>{
    if(config.skipAuth){
        return config;
    }
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
})


api.interceptors.response.use((response)=>{
    return response.data;
    },
    async (error)=>{
        console.log(error.response);
        if(error.response && error.response.data.errorCode && error.response.data.errorCode === "401002"){
            console.log("UnAuthorized");


            await axios.post("http://localhost:8000/user-service/user/reissueToken",{},{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(response => {
                localStorage.setItem("token",response.data.data.token);
                error.config.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
                return axios.request(error.config);
            }).catch(error => {
                console.log("reiisue token error");
                localStorage.removeItem("token");
                window.location.href = "/";
            })

        }
        else{
            alert(error.response.data.message);
            //return Promise.reject(error);
        }

    }


    )


export default api;
