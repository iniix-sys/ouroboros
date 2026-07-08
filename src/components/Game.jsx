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



const TILE=20;

const WIDTH=400;

const HEIGHT=400;



export default function Game({

    setScore,

    consumeWebsite,

    corruption

}){


    const canvasRef =
    useRef(null);



    const snake =
    useRef([

        {
            x:10,
            y:10
        }

    ]);



    const direction =
    useRef({

        x:1,
        y:0

    });



    const apple =
    useRef({

        x:15,
        y:15

    });



    const [started,setStarted]=useState(false);

    const [gameOver,setGameOver]=useState(false);





    function spawnApple(){


        apple.current={

            x:
            Math.floor(Math.random()*20),

            y:
            Math.floor(Math.random()*20)

        };


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


            direction.current={

                x:
                dx>0
                ?
                1
                :
                -1,

                y:0

            };


        }

        else{


            direction.current={

                x:0,

                y:
                dy>0
                ?
                1
                :
                -1

            };


        }


    }





    function moveSnake(){


        let move = {
            ...direction.current
        };



        // corruption can slightly disrupt movement

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



        const newHead = {

            x:
            head.x + move.x,

            y:
            head.y + move.y

        };





        // wall collision

        if(

            newHead.x < 0 ||

            newHead.y < 0 ||

            newHead.x >= WIDTH / TILE ||

            newHead.y >= HEIGHT / TILE

        ){

            setGameOver(true);

            return;

        }





        // self collision

        for(
            let i = 0;
            i < snake.current.length;
            i++
        ){

            const part =
            snake.current[i];


            if(

                newHead.x === part.x &&

                newHead.y === part.y

            ){

                setGameOver(true);

                return;

            }

        }






        snake.current.unshift(newHead);





        // apple eaten

        if(

            newHead.x === apple.current.x &&

            newHead.y === apple.current.y

        ){


            setScore(
                s => s + 1
            );


            consumeWebsite();



            apple.current = {

                x:
                Math.floor(
                    Math.random()*20
                ),

                y:
                Math.floor(
                    Math.random()*20
                )

            };


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



        // background

        ctx.fillStyle = "#050505";

        ctx.fillRect(

            0,
            0,
            WIDTH,
            HEIGHT

        );



        // subtle grid

        ctx.strokeStyle =
        "rgba(255,255,255,0.03)";


        for(let x=0;x<WIDTH;x+=TILE){

            ctx.beginPath();

            ctx.moveTo(
                x,
                0
            );

            ctx.lineTo(
                x,
                HEIGHT
            );

            ctx.stroke();

        }



        for(let y=0;y<HEIGHT;y+=TILE){

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                WIDTH,
                y
            );

            ctx.stroke();

        }





        // apple glow

        const appleX =
        apple.current.x*TILE + TILE/2;


        const appleY =
        apple.current.y*TILE + TILE/2;



        ctx.shadowBlur = 20;

        ctx.shadowColor =
        "red";



        ctx.fillStyle =
        "#ff3333";


        ctx.beginPath();


        ctx.arc(

            appleX,

            appleY,

            TILE*0.45,

            0,

            Math.PI*2

        );


        ctx.fill();





        ctx.shadowBlur = 0;





        // snake glow


        if(

            !corruption.invisible ||

            Math.random()>0.3

        ){



            snake.current.forEach((part,index)=>{


                const x =
                part.x*TILE + TILE/2;


                const y =
                part.y*TILE + TILE/2;



                const size =
                TILE*0.42;



                ctx.shadowBlur = 15;

                ctx.shadowColor =
                index===0
                ?
                "#ffffff"
                :
                "#00ff88";



                ctx.fillStyle =
                index===0
                ?
                "#ffffff"
                :
                "#00ff88";



                ctx.beginPath();


                ctx.arc(

                    x,

                    y,

                    size,

                    0,

                    Math.PI*2

                );


                ctx.fill();


            });


        }



        ctx.shadowBlur=0;





        // corruption overlay


        if(corruption.level>=2){


            ctx.fillStyle =
            "rgba(255,255,255,.05)";


            for(let i=0;i<8;i++){


                ctx.fillRect(

                    Math.random()*WIDTH,

                    Math.random()*HEIGHT,

                    Math.random()*80,

                    3

                );


            }


        }




        if(corruption.level>=3){


            ctx.strokeStyle =
            "rgba(255,0,0,.5)";


            ctx.lineWidth=2;


            ctx.beginPath();


            ctx.moveTo(

                Math.random()*WIDTH,

                0

            );


            ctx.lineTo(

                Math.random()*WIDTH,

                HEIGHT

            );


            ctx.stroke();


        }


    }






    useEffect(()=>{


        function key(e){


            const current =
            direction.current;



            let newDirection = null;



            if(e.key==="ArrowUp"){

                newDirection = {
                    x:0,
                    y:-1
                };

            }



            if(e.key==="ArrowDown"){

                newDirection = {
                    x:0,
                    y:1
                };

            }



            if(e.key==="ArrowLeft"){

                newDirection = {
                    x:-1,
                    y:0
                };

            }



            if(e.key==="ArrowRight"){

                newDirection = {
                    x:1,
                    y:0
                };

            }





            if(!newDirection)
                return;





            // Prevent reversing into yourself

            if(

                newDirection.x === -current.x &&

                newDirection.y === -current.y

            ){

                return;

            }





            direction.current =
            newDirection;


        }




        window.addEventListener(

            "keydown",

            key

        );





        const timer =
        setInterval(()=>{


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

        <div>


            <canvas

                ref={canvasRef}

                width={WIDTH}

                height={HEIGHT}

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