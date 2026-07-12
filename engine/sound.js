const fs = require("fs");


const SAMPLE_RATE = 44100;

const MIN_FREQ = 200;
const MAX_FREQ = 8000;



// =============================
// Detect thin drawing
// =============================

function getDrawingWidth(pixels){

    let minX = pixels[0].length;
    let maxX = 0;

    let found = false;


    for(let y=0; y<pixels.length; y++){

        for(let x=0; x<pixels[y].length; x++){

            if(pixels[y][x] === 1){

                found = true;

                if(x < minX)
                    minX = x;

                if(x > maxX)
                    maxX = x;

            }

        }

    }


    if(!found)
        return 0;


    return maxX - minX + 1;

}






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
                MIN_FREQ +
                (
                    (height - y)
                    /
                    height
                )
                *
                (
                    MAX_FREQ -
                    MIN_FREQ
                );


                frequencies.push(freq);

            }

        }



        columns.push(frequencies);

    }



    return columns;

}







// =============================
// Image To Audio
// =============================

function imageToAudio(pixels){


    let columns =
    imageToFrequencies(
        pixels
    );



    let width =
    getDrawingWidth(
        pixels
    );



    let isThin =
    width <= 5;



    let samples=[];



    // Normal drawings keep original timing
    // Thin vertical lines get a small duration boost only

    let columnTime =
    isThin
    ? 0.04
    : 0.02;



    let samplesPerColumn =
    Math.floor(
        SAMPLE_RATE * columnTime
    );





    for(let x=0; x<columns.length; x++){


        let frequencies =
        columns[x];



        for(let i=0; i<samplesPerColumn; i++){



            let value = 0;



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



            if(
                frequencies.length > 0
            ){

                value /=
                frequencies.length;

            }



            samples.push(
                value
            );


        }


    }




    // Normalize


    let max = 0;


    for(
        let s of samples
    ){

        if(
            Math.abs(s) > max
        )
            max = Math.abs(s);

    }



    if(max > 0){


        for(
            let i=0;
            i<samples.length;
            i++
        ){

            samples[i] /= max;

        }


    }



    return samples;

}







// =============================
// Save WAV
// =============================

function saveWav(samples, filename){


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
            s * 30000
        );


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
    saveWav

};