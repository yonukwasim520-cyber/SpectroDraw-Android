const fs = require("fs");


const SAMPLE_RATE = 44100;





// =============================
// Image -> Frequencies
// =============================

function imageToFrequencies(pixels){


    let height = pixels.length;
    let width = pixels[0].length;


    let columns = [];



    for(let x=0; x<width; x++){


        let frequencies = [];



        for(let y=0; y<height; y++){


            if(pixels[y][x] === 1){


                let freq =
                200 +
                (
                    (height-y)
                    /
                    height
                )
                *
                7800;



                frequencies.push(freq);


            }


        }



        columns.push(frequencies);


    }



    return columns;

}








// =============================
// Drawing -> Audio
// =============================

function imageToAudio(pixels){



    let columns =
    imageToFrequencies(
        pixels
    );



    let samples=[];



    let samplesPerColumn =
    Math.floor(
        SAMPLE_RATE * 0.02
    );





    for(let x=0; x<columns.length; x++){


        let frequencies =
        columns[x];



        for(let i=0; i<samplesPerColumn; i++){



            let value=0;



            for(
                let freq of frequencies
            ){



                value +=
                Math.sin(
                    2 *
                    Math.PI *
                    freq *
                    i /
                    SAMPLE_RATE
                );


            }




            if(frequencies.length){

                value /=
                frequencies.length;

            }




            samples.push(
                value
            );


        }


    }



    return normalize(
        samples
    );

}








// =============================
// Normalize Audio
// =============================

function normalize(samples){


    let max=0;



    for(
        let s of samples
    ){


        if(
            Math.abs(s)>max
        )

            max =
            Math.abs(s);


    }





    if(max>0){


        for(
            let i=0;
            i<samples.length;
            i++
        ){


            samples[i] =
            samples[i]/max;


        }


    }



    return samples;

}









// =============================
// Save WAV
// =============================

function saveWav(
    samples,
    filename
){



    samples =
    normalize(
        samples
    );



    const channels = 1;


    let dataSize =
    samples.length * 2;



    let buffer =
    Buffer.alloc(
        44 + dataSize
    );



    buffer.write(
        "RIFF",
        0
    );


    buffer.writeUInt32LE(
        36 + dataSize,
        4
    );


    buffer.write(
        "WAVE",
        8
    );



    buffer.write(
        "fmt ",
        12
    );


    buffer.writeUInt32LE(
        16,
        16
    );


    buffer.writeUInt16LE(
        1,
        20
    );


    buffer.writeUInt16LE(
        channels,
        22
    );


    buffer.writeUInt32LE(
        SAMPLE_RATE,
        24
    );


    buffer.writeUInt32LE(
        SAMPLE_RATE * 2,
        28
    );


    buffer.writeUInt16LE(
        2,
        32
    );


    buffer.writeUInt16LE(
        16,
        34
    );


    buffer.write(
        "data",
        36
    );


    buffer.writeUInt32LE(
        dataSize,
        40
    );



    let offset = 44;



    for(
        let s of samples
    ){



        let value =
        Math.floor(
            s * 28000
        );



        // حماية من تجاوز WAV

        if(value > 32767)
            value = 32767;


        if(value < -32768)
            value = -32768;




        buffer.writeInt16LE(
            value,
            offset
        );


        offset += 2;


    }




    fs.writeFileSync(
        filename,
        buffer
    );


}






module.exports = {

    imageToAudio,
    saveWav,
    normalize

};