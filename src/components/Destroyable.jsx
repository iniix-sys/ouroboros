export default function Destroyable({

    children,

    destroying,

    corruption

}){


    return (

        <div

            className={

                [

                    destroying
                    ?
                    "destroying"
                    :
                    "",


                    corruption >= 3
                    ?
                    "glitch"
                    :
                    ""

                ]

                .join(" ")

            }

        >

            {children}

        </div>

    );

}