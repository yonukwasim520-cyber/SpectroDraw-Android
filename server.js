const express = require("express");
const path = require("path");
const fs = require("fs");

const {
    imageToAudio,
    saveWav
} = require("./engine/sound");


const {
    wavToSpectrogram
} = require("./engine/spectrogram");


const app = express();

const PORT = 3000;



app.use(express.json({
    limit:"50mb"
}));


app.use(express.static("public"));


app.use(
    "/output",
    express.static(
        path.join(__dirname,"output")
    )
);




// =============================
// Auto Crop
// =============================

function autoCrop(pixels){

    let minX=pixels[0].length;
    let maxX=0;

    let minY=pixels.length;
    let maxY=0;

    let found=false;



    for(let y=0;y<pixels.length;y++){

        for(let x=0;x<pixels[y].length;x++){


            if(pixels[y][x]===1){

                found=true;


                if(x<minX) minX=x;
                if(x>maxX) maxX=x;

                if(y<minY) minY=y;
                if(y>maxY) maxY=y;

            }

        }

    }



    if(!found)
        return [];



    let result=[];



    for(let y=minY;y<=maxY;y++){

        let row=[];


        for(let x=minX;x<=maxX;x++){

            row.push(
                pixels[y][x]
            );

        }


        result.push(row);

    }



    return result;

}







// =============================
// Expand thin drawing
// =============================

function expandThinImage(
    pixels,
    minWidth=32
){

    let height=pixels.length;
    let width=pixels[0].length;



    if(width>=minWidth)
        return pixels;



    let result=[];


    let repeat =
    Math.ceil(
        minWidth/width
    );



    for(let y=0;y<height;y++){

        let row=[];


        for(let x=0;x<width;x++){


            for(
                let i=0;
                i<repeat;
                i++
            ){

                row.push(
                    pixels[y][x]
                );

            }


        }


        result.push(row);

    }



    return result;

}







// =============================
// Normalize
// =============================

function normalizeImage(
    pixels,
    size=256
){

    let height=pixels.length;
    let width=pixels[0].length;


    let result=[];



    for(let y=0;y<size;y++){

        let row=[];


        for(let x=0;x<size;x++){


            let sx =
            Math.floor(
                x*width/size
            );


            let sy =
            Math.floor(
                y*height/size
            );



            row.push(
                pixels[sy][sx]
            );


        }


        result.push(row);

    }



    return result;

}







// =============================
// Receive Drawing
// =============================

app.post(
"/capture",
async(req,res)=>{


    let pixels=req.body.pixels;



    if(!pixels){

        return res.json({
            status:"no data"
        });

    }




    console.log("====================");



    console.log(
        "Original:",
        pixels.length,
        "x",
        pixels[0].length
    );



    let cropped =
    autoCrop(
        pixels
    );



    if(cropped.length===0){

        return res.json({
            status:"empty"
        });

    }




    console.log(
        "Cropped:",
        cropped.length,
        "x",
        cropped[0].length
    );



    cropped =
    expandThinImage(
        cropped,
        64
    );



    console.log(
        "Expanded:",
        cropped.length,
        "x",
        cropped[0].length
    );





    let normalized =
    normalizeImage(
        cropped,
        256
    );



    console.log(
        "Normalized:",
        normalized.length,
        "x",
        normalized[0].length
    );






    let samples =
    imageToAudio(
        normalized
    );



    saveWav(
        samples,
        "./output/drawing.wav"
    );



    console.log(
        "WAV created"
    );





    let wavBuffer =
    fs.readFileSync(
        "./output/drawing.wav"
    );



    let spectrogram =
    await wavToSpectrogram(
        wavBuffer
    );



    console.log(
        "Spectrogram created"
    );



    console.log("====================");






    res.json({

        status:"success",

        file:
        "/output/drawing.wav",


        spectrogram:
        spectrogram

    });



});






app.get(
"/",
(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});






app.listen(
PORT,
"0.0.0.0",
()=>{


    console.log(
        "SpectroDraw running"
    );


    console.log(
        "http://localhost:"+PORT
    );


});