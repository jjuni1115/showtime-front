import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {"Content-Type": "application/json"},
    timeout: 5000,
});


api.interceptors.request.use((config)=>{
    if(config.skipAuth){
        return config;
    }
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    console.log(localStorage.getItem("token"));
    return config;
})


api.interceptors.response.use((response)=>{
    return response.data.data;
    },
    async (error)=>{
        if(error.response && (error.response.status === 401 && error.response.data.errorCode === "401002" || error.response.status === 403)){
            console.log("UnAuthorized");


            await axios.post("http://localhost:8080/user/reissueToken",{},{
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

    }


    )


export default api;
