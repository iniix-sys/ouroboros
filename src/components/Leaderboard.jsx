import {
    useEffect,
    useState
}
from "react";


import {
    supabase
}
from "../supabase";



export default function Leaderboard({
    refreshKey
}){


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








    useEffect(() => {

        loadScores();

        const channel = supabase
            .channel("leaderboard-live")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "leaderboard"
                    },
                    () => {
                        loadScores();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };

        }, []);



    useEffect(() => {

        if(refreshKey === undefined)
            return;

        loadScores();

    }, [refreshKey]);









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