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
    return config;
})


api.interceptors.response.use((response)=>{
    return response.data.data;
    },
    async (error)=>{
        if(error.response && error.response.status === 401){
            console.log("UnAuthorized");


            //TODO: refresh token
        }

    }


    )


export default api;
