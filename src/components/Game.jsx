import {
    useEffect,
    useRef,
    useState
}
from "react";


import {

    DEBUG_MODE,

    DEBUG_SPEED

}
from "../config";



const TILE = 20;

const WIDTH = 400;

const HEIGHT = 400;



export default function Game({

    setScore,

    consumeWebsite,

    corruption

}){


    const canvasRef = useRef(null);



    const snake = useRef([

        {
            x:10,
            y:10
        }

    ]);



    const direction = useRef({

        x:1,

        y:0

    });



    const apple = useRef({

        x:15,

        y:15

    });



    const [started,setStarted] =
    useState(false);


    const [gameOver,setGameOver] =
    useState(false);



    const [touchStart,setTouchStart] =
    useState(null);





    function spawnApple(){


        apple.current={

            x:
            Math.floor(Math.random()*20),

            y:
            Math.floor(Math.random()*20)

        };


    }





    function changeDirection(newDirection){


        const current =
        direction.current;



        // prevent reversing into yourself

        if(

            newDirection.x === -current.x &&

            newDirection.y === -current.y

        ){

            return;

        }



        direction.current =
        newDirection;


    }





    function handleTouchStart(e){


        const touch =
        e.touches[0];


        setTouchStart({

            x:touch.clientX,

            y:touch.clientY

        });


    }






    function handleTouchEnd(e){


        if(!touchStart)
            return;



        const touch =
        e.changedTouches[0];



        const dx =
        touch.clientX - touchStart.x;



        const dy =
        touch.clientY - touchStart.y;



        if(

            Math.abs(dx) < 20 &&

            Math.abs(dy) < 20

        ){

            return;

        }





        if(Math.abs(dx)>Math.abs(dy)){


            if(dx>0){

                changeDirection({

                    x:1,

                    y:0

                });

            }

            else{

                changeDirection({

                    x:-1,

                    y:0

                });

            }


        }

        else{


            if(dy>0){

                changeDirection({

                    x:0,

                    y:1

                });

            }

            else{

                changeDirection({

                    x:0,

                    y:-1

                });

            }


        }



        setTouchStart(null);


    }







    function debugAI(){


        if(!DEBUG_MODE)
            return;



        const head =
        snake.current[0];


        const target =
        apple.current;



        const dx =
        target.x-head.x;



        const dy =
        target.y-head.y;




        if(Math.abs(dx)>Math.abs(dy)){


            changeDirection({

                x:
                dx>0
                ?
                1
                :
                -1,

                y:0

            });


        }

        else{


            changeDirection({

                x:0,

                y:
                dy>0
                ?
                1
                :
                -1

            });


        }


    }







    function moveSnake(){


        let move =
        {
            ...direction.current
        };



        if(corruption.chaos){


            if(Math.random()<0.15){


                move.x +=
                Math.floor(
                    Math.random()*3
                )-1;



                move.y +=
                Math.floor(
                    Math.random()*3
                )-1;


            }


        }





        const head =
        snake.current[0];



        const newHead={


            x:
            head.x+move.x,


            y:
            head.y+move.y


        };





        // wall collision

        if(

            newHead.x < 0 ||

            newHead.y < 0 ||

            newHead.x >= WIDTH/TILE ||

            newHead.y >= HEIGHT/TILE

        ){

            setGameOver(true);

            return;

        }






        // self collision

        for(const part of snake.current){


            if(

                newHead.x===part.x &&

                newHead.y===part.y

            ){

                setGameOver(true);

                return;

            }


        }






        snake.current.unshift(newHead);





        if(

            newHead.x===apple.current.x &&

            newHead.y===apple.current.y

        ){


            setScore(
                s=>s+1
            );



            consumeWebsite();



            spawnApple();


        }

        else{


            snake.current.pop();


        }


    }







    function draw(){


        const ctx =
        canvasRef.current.getContext("2d");



        ctx.clearRect(

            0,

            0,

            WIDTH,

            HEIGHT

        );



        ctx.fillStyle="#050505";

        ctx.fillRect(

            0,

            0,

            WIDTH,

            HEIGHT

        );





        // apple

        ctx.shadowBlur=20;

        ctx.shadowColor="red";


        ctx.fillStyle="#ff3333";


        ctx.beginPath();


        ctx.arc(

            apple.current.x*TILE + TILE/2,

            apple.current.y*TILE + TILE/2,

            TILE*.4,

            0,

            Math.PI*2

        );


        ctx.fill();






        ctx.shadowBlur=0;





        // snake

        if(

            !corruption.invisible ||

            Math.random()>0.3

        ){


            snake.current.forEach((part,index)=>{


                ctx.shadowBlur=15;


                ctx.shadowColor =
                index===0
                ?
                "white"
                :
                "#00ff88";



                ctx.fillStyle =
                index===0
                ?
                "white"
                :
                "#00ff88";



                ctx.beginPath();



                ctx.arc(

                    part.x*TILE+TILE/2,

                    part.y*TILE+TILE/2,

                    TILE*.42,

                    0,

                    Math.PI*2

                );



                ctx.fill();


            });


        }



        ctx.shadowBlur=0;






        if(corruption.level>=2){


            ctx.fillStyle=
            "rgba(255,255,255,.08)";



            for(let i=0;i<8;i++){


                ctx.fillRect(

                    Math.random()*WIDTH,

                    Math.random()*HEIGHT,

                    50,

                    4

                );


            }


        }



    }








    useEffect(()=>{


        function key(e){


            if(e.key==="ArrowUp")

                changeDirection({

                    x:0,

                    y:-1

                });



            if(e.key==="ArrowDown")

                changeDirection({

                    x:0,

                    y:1

                });



            if(e.key==="ArrowLeft")

                changeDirection({

                    x:-1,

                    y:0

                });



            if(e.key==="ArrowRight")

                changeDirection({

                    x:1,

                    y:0

                });



        }





        window.addEventListener(

            "keydown",

            key

        );





        const timer=setInterval(()=>{


            if(started && !gameOver){


                debugAI();


                moveSnake();


                draw();


            }


        },

        DEBUG_MODE

        ?

        DEBUG_SPEED

        :

        Math.max(

            35,

            120/corruption.speed

        )

        );






        return()=>{


            window.removeEventListener(

                "keydown",

                key

            );


            clearInterval(timer);


        };



    },[
        started,
        gameOver,
        corruption
    ]);








    return (

        <div className="game-wrapper">


            <canvas

                ref={canvasRef}

                width={WIDTH}

                height={HEIGHT}

                className="game-canvas"

                onTouchStart={handleTouchStart}

                onTouchEnd={handleTouchEnd}

            />



            {

            !started &&

            <button

                className="start"

                onClick={()=>setStarted(true)}

            >

                {
                DEBUG_MODE
                ?
                "START DEBUG GAME"
                :
                "START GAME"
                }


            </button>

            }



            {

            gameOver &&

            <h2>

                GAME OVER

            </h2>

            }



        </div>

    );

}