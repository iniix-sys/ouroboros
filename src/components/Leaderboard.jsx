import {
    useEffect,
    useState
}
from "react";


import {
    supabase
}
from "../supabase";



export default function Leaderboard(){


    const [scores,setScores] =
    useState([]);




    async function loadScores(){


        const {

            data,

            error

        } = await supabase

        .from("leaderboard")

        .select("*")

        .order(

            "score",

            {
                ascending:false
            }

        )

        .limit(10);




        if(error){

            console.error(
                error
            );

            return;

        }



        setScores(data || []);


    }








    useEffect(()=>{


        loadScores();




        const channel =

        supabase

        .channel(
            "leaderboard-live"
        )

        .on(

            "postgres_changes",

            {

                event:"INSERT",

                schema:"public",

                table:"leaderboard"

            },


            (payload)=>{


                setScores(old=>{


                    const updated = [

                        payload.new,

                        ...old

                    ];



                    return updated

                    .sort(

                        (a,b)=>

                        b.score-a.score

                    )

                    .slice(
                        0,
                        10
                    );


                });


            }


        )

        .subscribe();






        return()=>{


            supabase

            .removeChannel(
                channel
            );


        };


    },[]);








    return (

        <div className="leaderboard card">


            <h2>

                TOP SNAKES

            </h2>





            {

            scores.length === 0 &&


            <p>

                NO DATA

            </p>

            }





            {

            scores.map(

                (entry,index)=>(


                    <div

                        key={entry.id}

                        className="leader-entry"

                    >


                        #{index+1}

                        {" "}

                        {entry.username}


                        {" - "}


                        {entry.score}



                    </div>


                )

            )

            }



        </div>

    );


}