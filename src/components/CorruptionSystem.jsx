import { useEffect, useState } from "react";

import {
    DEBUG_CORRUPTION
}
from "../config";


export default function CorruptionSystem({score}){


    const [corruption,setCorruption] = useState({

        level:0,

        inverted:false,

        speed:1,

        invisible:false,

        chaos:false

    });



    useEffect(()=>{


        if(DEBUG_CORRUPTION){

            setCorruption({

                level:4,

                inverted:true,

                speed:3,

                invisible:true,

                chaos:true

            });

            return;

        }



        const state={

            level:0,

            inverted:false,

            speed:1,

            invisible:false,

            chaos:false

        };



        if(score>=3)
            state.level=1;


        if(score>=5){

            state.level=2;
            state.speed=1.5;

        }


        if(score>=8){

            state.level=3;
            state.speed=2;
            state.inverted=true;

        }


        if(score>=12){

            state.level=4;
            state.speed=3;
            state.invisible=true;
            state.chaos=true;

        }



        setCorruption(state);


    },[score]);



    return corruption;


}