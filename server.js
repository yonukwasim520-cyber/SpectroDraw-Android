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


const {
    textToPixels
} = require("./engine/textImage");



const app = express();


const PORT = 3000;



app.use(
    express.json({
        limit:"50mb"
    })
);



app.use(
    express.static("public")
);



app.use(
    "/output",
    express.static(
        path.join(
            __dirname,
            "output"
        )
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


                if(x<minX)
                    minX=x;


                if(x>maxX)
                    maxX=x;


                if(y<minY)
                    minY=y;


                if(y>maxY)
                    maxY=y;


            }


        }


    }



    if(!found)
        return [];



    let result=[];



    for(
        let y=minY;
        y<=maxY;
        y++
    ){


        let row=[];


        for(
            let x=minX;
            x<=maxX;
            x++
        ){


            row.push(
                pixels[y][x]
            );


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


    let h=pixels.length;

    let w=pixels[0].length;


    let result=[];



    for(let y=0;y<size;y++){


        let row=[];


        for(let x=0;x<size;x++){


            let sx =
            Math.floor(
                x*w/size
            );


            let sy =
            Math.floor(
                y*h/size
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
// DRAW MODE
// =============================

app.post(
"/capture",
async(req,res)=>{


    let pixels =
    req.body.pixels;



    if(!pixels){

        return res.json({
            status:"no data"
        });

    }



    console.log(
        "Drawing received"
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




    let normalized =
    normalizeImage(
        cropped
    );



    let samples =
    imageToAudio(
        normalized
    );



    saveWav(
        samples,
        "./output/drawing.wav"
    );



    let wav =
    fs.readFileSync(
        "./output/drawing.wav"
    );



    let spectrogram =
    await wavToSpectrogram(
        wav
    );



    res.json({

        status:"success",

        file:
        "/output/drawing.wav",

        spectrogram

    });


});









// =============================
// TEXT MODE
// =============================

app.post(
"/text",
async(req,res)=>{


    let text =
    req.body.text;



    if(!text){

        return res.json({

            status:"empty"

        });

    }



    console.log(
        "Text received:",
        text
    );




    let pixels =
    await textToPixels(
        text
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



    let normalized =
    normalizeImage(
        cropped
    );



    let samples =
    imageToAudio(
        normalized
    );



    saveWav(
        samples,
        "./output/text.wav"
    );



    let wav =
    fs.readFileSync(
        "./output/text.wav"
    );



    let spectrogram =
    await wavToSpectrogram(
        wav
    );



    res.json({

        status:"success",

        file:
        "/output/text.wav",

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