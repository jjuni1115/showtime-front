import {useEffect, useState} from "react";


const useDebounce = (value,delayTime) =>{

    const [debounceValue,setDebounceValue] = useState(value);


    useEffect(() => {
        const timer = setTimeout(()=>{
            setDebounceValue(value)
        },delayTime);

        return () =>{
            clearTimeout(timer);
        }
    }, [value]);

    return debounceValue;


}

export default useDebounce;
