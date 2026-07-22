import { useState } from "react";

import Game from "./components/Game";

import Destroyable from "./components/Destroyable";

import CorruptionSystem from "./components/CorruptionSystem";

import corruptText from "./utils/corruptText";

import Leaderboard from "./components/Leaderboard";

import { supabase } from "./supabase";



export default function App(){


    const [score,setScore] = useState(0);


    const [gameOver,setGameOver] = useState(false);

    const [finalScore,setFinalScore] = useState(0);

    const [playerName,setPlayerName] = useState("");

    const [submitted,setSubmitted] = useState(false);

    const [leaderboardRefreshKey,setLeaderboardRefreshKey] = useState(0);


    function handleGameOver(finishedScore){

        setFinalScore(finishedScore);

        setGameOver(true);

    }


    function handleReset(){

        setGameOver(false);

        setFinalScore(0);

        setPlayerName("");

        setSubmitted(false);

    }


    async function submitScore(){

        if(submitted)
            return;

        const name =
        playerName.trim() || "Anonymous";

        const {
            data:existing
        } = await supabase

        .from("leaderboard")

        .select("score")

        .eq(
            "username",
            name
        )

        .single();

        if(existing){

            if(finalScore <= existing.score){

                setSubmitted(true);

                return;

            }

            await supabase

            .from("leaderboard")

            .update({

                score:finalScore

            })

            .eq(

                "username",

                name

            );

        }

        else{

            await supabase

            .from("leaderboard")

            .insert({

                username:name,

                score:finalScore

            });

        }

        setLeaderboardRefreshKey(key => key + 1);

        setSubmitted(true);

    }



    const corruption =
        CorruptionSystem({
            score
        });





    const [elements,setElements] = useState({

        title:true,

        subtitle:true,

        score:true,

        instructions:true,

        status:true,

        quote:true,

        footer:true

    });





    const [destroying,setDestroying] = useState([]);






    function consumeWebsite(){


        if(corruption.level < 4)

            return;





        const available =

            Object.keys(elements)

            .filter(

                key =>

                elements[key] &&

                !destroying.includes(key)

            );





        if(available.length === 0)

            return;





        const victim =

            available[

                Math.floor(

                    Math.random()*available.length

                )

            ];






        setDestroying(old=>[

            ...old,

            victim

        ]);







        setTimeout(()=>{


            setElements(old=>({


                ...old,


                [victim]:false


            }));




            setDestroying(old =>

                old.filter(

                    item => item !== victim

                )

            );



        },700);



    }








    return (

        <main>





            {
            elements.title &&


            <Destroyable

                destroying={

                    destroying.includes("title")

                }

            >

                <h1>

                    {

                    corruptText(

                        "Ouroboros",

                        corruption.level

                    )

                    }


                </h1>


            </Destroyable>

            }








            {
            elements.subtitle &&


            <Destroyable

                destroying={

                    destroying.includes("subtitle")

                }

            >

                <p>


                    {

                    corruptText(

                        "There are no winners, but all are losers.",

                        corruption.level

                    )

                    }


                </p>


            </Destroyable>

            }









            <div className="layout">






                <div className="leaderboard-panel">


                    <Leaderboard refreshKey={leaderboardRefreshKey} />


                    {
                    gameOver &&

                    <div className="score-submit">

                        <h2>
                            GAME OVER
                        </h2>


                        <h3>
                            Score: {finalScore}
                        </h3>


                        {
                        !submitted &&

                        <>

                            <input

                                value={playerName}

                                onChange={e =>
                                    setPlayerName(e.target.value)
                                }

                                placeholder="Name"

                            />


                            <button

                                className="start"

                                onClick={submitScore}

                            >

                                SUBMIT SCORE

                            </button>

                        </>

                        }


                        {
                        submitted &&

                        <p>
                            SCORE SUBMITTED
                        </p>

                        }


                    </div>

                    }


                </div>








                <div className="game-container">



                    <Game


                        setScore={setScore}


                        consumeWebsite={consumeWebsite}


                        corruption={corruption}


                        onGameOver={handleGameOver}


                        onReset={handleReset}


                    />



                </div>








                <div className="side-panel">





                    {
                    elements.score &&


                    <Destroyable

                        destroying={

                            destroying.includes("score")

                        }

                    >


                        <div className="card">


                            Score:

                            {" "}

                            {score}


                            <br/>


                            Corruption:

                            {" "}

                            {corruption.level}



                        </div>



                    </Destroyable>

                    }









                    {
                    elements.status &&


                    <Destroyable

                        destroying={

                            destroying.includes("status")

                        }

                    >



                        <div className="card status">



                            {

                            corruptText(

                                "SYSTEM ONLINE",

                                corruption.level

                            )

                            }



                        </div>



                    </Destroyable>

                    }









                    {
                    elements.instructions &&


                    <Destroyable

                        destroying={

                            destroying.includes("instructions")

                        }

                    >



                        <div className="card">


                            ARROW KEYS


                            <br/>


                            SURVIVE



                        </div>



                    </Destroyable>

                    }









                    {
                    elements.quote &&


                    <Destroyable

                        destroying={

                            destroying.includes("quote")

                        }

                    >



                        <div className="card">



                            {

                            corruptText(

                                "You're wasting your time.",

                                corruption.level

                            )

                            }



                        </div>



                    </Destroyable>

                    }





                </div>






            </div>








            {
            elements.footer &&


            <Destroyable

                destroying={

                    destroying.includes("footer")

                }

            >


                <footer>


                    {

                    corruptText(

                        "Good luck.",

                        corruption.level

                    )

                    }


                </footer>



            </Destroyable>

            }





        </main>

    );

}