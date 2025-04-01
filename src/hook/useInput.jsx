import {useState} from "react";

const useInput = (initialValue,validator) =>{
    const [value,setValue] = useState(initialValue);
    const [isValid,setIsValid] = useState(true);
    const handelInputValue = (event) =>{

        const target = event.target.value;

        setValue(target);
        if (typeof validator === "function"){
            setIsValid(validator(target));
        }
    }

    return {value,handelInputValue,isValid};

}

export default useInput;
