import {useState} from "react";

const useInput = (initialValue,validator) =>{
    const [value,setValue] = useState(initialValue);
    const handelInputValue = (event) =>{
        const {
            target: {value}
        } = event;
        setValue(value);
    }
    if (typeof validator === "function" && validator(value)){
        setValue(value);
    }
    return {value,handelInputValue};

}

export default useInput;