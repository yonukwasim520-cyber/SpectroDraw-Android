const SAMPLE_RATE = 44100;


function charPattern(char){

    let code =
    char.charCodeAt(0);


    return [

        250 + code * 3,

        500 + code * 5,

        900 + code * 7

    ];

}



function envelope(i,total){


    let x =
    i / total;


    return Math.sin(
        Math.PI * x
    );

}





function generateChar(char){


    let frequencies =
    charPattern(char);



    let length =
    Math.floor(
        SAMPLE_RATE * 0.25
    );


    let samples=[];



    for(
        let i=0;
        i<length;
        i++
    ){


        let t =
        i / SAMPLE_RATE;



        let value=0;



        for(
            let j=0;
            j<frequencies.length;
            j++
        ){


            value +=

            Math.sin(
                2*Math.PI*
                frequencies[j]*
                t
            )
            /
            (j+1);


        }



        value *=
        envelope(
            i,
            length
        );



        samples.push(
            value
        );


    }



    return samples;

}






function textToAudio(text){


    let samples=[];



    for(
        let char of text
    ){


        if(char===" "){


            let silence =
            SAMPLE_RATE*0.1;


            for(
                let i=0;
                i<silence;
                i++
            ){

                samples.push(0);

            }


        }
        else{


            samples.push(
                ...generateChar(char)
            );


        }


    }



    return samples;

}





module.exports={
    textToAudio
};