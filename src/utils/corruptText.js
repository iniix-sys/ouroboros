export default function corruptText(text,level){


    if(level <= 0)
        return text;



    const symbols = [

        "@",
        "#",
        "!",
        "0",
        "1",
        "%",
        "$"

    ];



    return text
        .split("")
        .map(char=>{


            if(
                char !== " " &&
                Math.random() < level * 0.08
            ){

                return symbols[
                    Math.floor(
                        Math.random()*symbols.length
                    )
                ];

            }


            return char;


        })
        .join("");

}