import { useState } from "react";

import Game from "./components/Game";

import Destroyable from "./components/Destroyable";

import CorruptionSystem from "./components/CorruptionSystem";

import corruptText from "./utils/corruptText";

import Leaderboard from "./components/Leaderboard";



export default function App(){


    const [score,setScore] = useState(0);



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


                    <Leaderboard />


                </div>








                <div className="game-container">



                    <Game


                        setScore={setScore}


                        consumeWebsite={consumeWebsite}


                        corruption={corruption}


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