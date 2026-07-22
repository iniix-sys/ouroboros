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

    corruption,

    onGameOver,

    onReset

}){


    const canvasRef = useRef(null);

    const glitchMove = useRef(false);

    const snake = useRef([]);

    const direction = useRef({});

    const apple = useRef({});



    const [started,setStarted] =
    useState(false);


    const [gameOver,setGameOver] =
    useState(false);



    const [touchStart,setTouchStart] =
    useState(null);




    function createStartingPosition(){


        const GRID_WIDTH =
        WIDTH / TILE;


        const GRID_HEIGHT =
        HEIGHT / TILE;



        return {


            x:
            Math.floor(
                Math.random() *
                (GRID_WIDTH - 2)
            ) + 1,


            y:
            Math.floor(
                Math.random() *
                (GRID_HEIGHT - 2)
            ) + 1


        };


    }






    function resetGame(){


        snake.current = [

            createStartingPosition()

        ];



        const directions = [


            {
                x:1,
                y:0
            },


            {
                x:-1,
                y:0
            },


            {
                x:0,
                y:1
            },


            {
                x:0,
                y:-1
            }


        ];



        direction.current =

        directions[

            Math.floor(
                Math.random() *
                directions.length
            )

        ];



        spawnApple();



        setScore(0);


        setGameOver(false);


        setStarted(false);


        onReset();



        requestAnimationFrame(draw);


    }







    function spawnApple(){


        const GRID_WIDTH =
        WIDTH / TILE;


        const GRID_HEIGHT =
        HEIGHT / TILE;



        apple.current = {


            x:
            Math.floor(
                Math.random() *
                (GRID_WIDTH - 2)
            ) + 1,



            y:
            Math.floor(
                Math.random() *
                (GRID_HEIGHT - 2)
            ) + 1


        };


    }








    function changeDirection(newDirection){


        const current =
        direction.current;



        // prevent reversing into itself

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
        touch.clientX -
        touchStart.x;



        const dy =
        touch.clientY -
        touchStart.y;



        if(

            Math.abs(dx)<20 &&

            Math.abs(dy)<20

        ){

            return;

        }






        if(Math.abs(dx)>Math.abs(dy)){



            changeDirection({


                x:
                dx > 0
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
                dy > 0
                ?
                1
                :
                -1


            });


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
        target.x -
        head.x;



        const dy =
        target.y -
        head.y;





        if(Math.abs(dx)>Math.abs(dy)){


            changeDirection({


                x:
                dx > 0
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
                dy > 0
                ?
                1
                :
                -1


            });


        }


    }
        function moveSnake(){

            // Reset glitch flag every frame
            glitchMove.current = false;

            let move = {
                ...direction.current
            };

            const head =
            snake.current[0];

            const GRID_WIDTH =
            WIDTH / TILE;

            const GRID_HEIGHT =
            HEIGHT / TILE;

            /*
                Ouroboros corruption:
                Chaos is strongest in open space,
                but fades near walls.
            */

            const wallDistance =
            Math.min(

                head.x,

                head.y,

                GRID_WIDTH - 1 - head.x,

                GRID_HEIGHT - 1 - head.y

            );

            const CHAOS_DISTANCE = 3;

            const chaosStrength =
            Math.max(

                0,

                Math.min(

                    1,

                    wallDistance / CHAOS_DISTANCE

                )

            );

            /*
                Corruption only causes LEGAL snake turns.
                No backwards movement.
                No diagonal movement.
                No two-tile jumps.
            */

            if(

                corruption.chaos &&

                Math.random() < 0.15 * chaosStrength

            ){

                glitchMove.current = true;

                const current =
                direction.current;

                let options = [];

                if(current.x !== 0){

                    // Moving horizontally.
                    // Can continue, turn up, or turn down.

                    options = [

                        {
                            x:current.x,
                            y:0
                        },

                        {
                            x:0,
                            y:-1
                        },

                        {
                            x:0,
                            y:1
                        }

                    ];

                }

                else{

                    // Moving vertically.
                    // Can continue, turn left, or turn right.

                    options = [

                        {
                            x:0,
                            y:current.y
                        },

                        {
                            x:-1,
                            y:0
                        },

                        {
                            x:1,
                            y:0
                        }

                    ];

                }

                /*
                    Only allow glitch turns that don't land
                    on the snake's own body. Otherwise the
                    head can end up overlapping a body segment,
                    and the very next normal frame would treat
                    that leftover overlap as a fatal collision.
                */

                const safeOptions =
                options.filter(
                    opt => {

                        const testX =
                        head.x + opt.x;

                        const testY =
                        head.y + opt.y;

                        for(
                            let i = 1;
                            i < snake.current.length;
                            i++
                        ){

                            const part =
                            snake.current[i];

                            if(
                                testX === part.x &&
                                testY === part.y
                            ){
                                return false;
                            }

                        }

                        return true;

                    }
                );

                if(safeOptions.length > 0){

                    move =

                    safeOptions[

                        Math.floor(

                            Math.random() *

                            safeOptions.length

                        )

                    ];

                }

                else{

                    // No safe glitch turn available this frame.
                    glitchMove.current = false;

                }

            }

            const newHead = {

                x:
                head.x + move.x,

                y:
                head.y + move.y

            };

            // Wall collision

            if(

                newHead.x < 0 ||

                newHead.y < 0 ||

                newHead.x >= GRID_WIDTH ||

                newHead.y >= GRID_HEIGHT

            ){

                endGame();
                return;

            }

            /*
                Ignore self-collision ONLY
                during corrupted glitch movement.
            */

            if(!glitchMove.current){

                for(

                    let i = 1;

                    i < snake.current.length;

                    i++

                ){

                    const part =
                    snake.current[i];

                    if(

                        newHead.x === part.x &&

                        newHead.y === part.y

                    ){

                        endGame();
                        return;

                    }

                }

            }

            







        snake.current.unshift(newHead);






        if(

            newHead.x === apple.current.x &&

            newHead.y === apple.current.y

        ){


            setScore(
                s => s + 1
            );



            consumeWebsite();



            spawnApple();


        }

        else{


            snake.current.pop();


        }


    }







    function endGame(){


        const score =
        snake.current.length - 1;



        setGameOver(true);


        onGameOver(score);


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





        ctx.fillStyle =
        "#050505";



        ctx.fillRect(

            0,

            0,

            WIDTH,

            HEIGHT

        );







        // apple


        ctx.shadowBlur = 20;


        ctx.shadowColor = "red";


        ctx.fillStyle = "#ff3333";



        ctx.beginPath();



        ctx.arc(

            apple.current.x*TILE + TILE/2,

            apple.current.y*TILE + TILE/2,

            TILE*.4,

            0,

            Math.PI*2

        );



        ctx.fill();






        ctx.shadowBlur = 0;








        // snake rendering


        if(

            !corruption.invisible ||

            Math.random() > 0.3

        ){



            snake.current.forEach((part,index)=>{


                ctx.shadowBlur = 15;



                ctx.shadowColor =

                index === 0

                ?

                glitchMove.current

                ?

                "#00ffff"

                :

                "white"

                :

                "#00ff88";




                ctx.fillStyle =

                index === 0

                ?

                glitchMove.current

                ?

                "#66ffff"

                :

                "white"

                :

                "#00ff88";





                ctx.beginPath();



                ctx.arc(

                    part.x*TILE + TILE/2,

                    part.y*TILE + TILE/2,

                    TILE*.42,

                    0,

                    Math.PI*2

                );



                ctx.fill();



            });


        }






        ctx.shadowBlur = 0;






        // corruption visuals


        if(corruption.level >= 2){



            ctx.fillStyle =
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


        resetGame();



    },[]);







    useEffect(()=>{


        function key(e){


            if(
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
            ){
                e.preventDefault();
            }



            if(e.key === "ArrowUp"){


                changeDirection({

                    x:0,

                    y:-1

                });


            }



            if(e.key === "ArrowDown"){


                changeDirection({

                    x:0,

                    y:1

                });


            }



            if(e.key === "ArrowLeft"){


                changeDirection({

                    x:-1,

                    y:0

                });


            }



            if(e.key === "ArrowRight"){


                changeDirection({

                    x:1,

                    y:0

                });


            }


        }






        window.addEventListener(

            "keydown",

            key

        );






        const timer =

        setInterval(()=>{


            if(

                started &&

                !gameOver

            ){


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

            120 / corruption.speed

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

            <button

                className="reset-button"

                onClick={resetGame}

            >

                RESET

            </button>


            <canvas

                ref={canvasRef}

                width={WIDTH}

                height={HEIGHT}

                className="game-canvas"

                onTouchStart={handleTouchStart}

                onTouchEnd={handleTouchEnd}

            />


            {
            !started && !gameOver &&

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


        </div>

    );


}