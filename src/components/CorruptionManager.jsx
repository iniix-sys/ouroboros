import { useEffect, useState } from "react";


export default function CorruptionManager({score}){

    const [level,setLevel] = useState(0);


    useEffect(()=>{

        if(score >= 12)
            setLevel(4);

        else if(score >= 8)
            setLevel(3);

        else if(score >= 5)
            setLevel(2);

        else if(score >= 2)
            setLevel(1);

        else
            setLevel(0);


    },[score]);


    return level;

}