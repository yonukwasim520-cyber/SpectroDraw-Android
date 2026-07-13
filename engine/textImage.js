const PImage = require("pureimage");
const { registerFont } = PImage;


// =============================
// Font
// =============================

const FONT_PATH =
"/data/data/com.termux/files/usr/share/fonts/TTF/DejaVuSans.ttf";


registerFont(
    FONT_PATH,
    "SpectroFont"
).loadSync();




// =============================
// Text To Pixels
// =============================

async function textToPixels(text){


    if(!text)
        return [];



    text =
    String(text)
    .substring(0,100);



    const FONT_SIZE = 250;



    // حساب عرض النص تلقائيا

    let tempWidth = 100;



    let temp =
    PImage.make(
        2000,
        500
    );


    let tempCtx =
    temp.getContext("2d");



    tempCtx.font =
    FONT_SIZE +
    "px SpectroFont";



    for(
        let char of text
    ){

        tempWidth +=
        tempCtx.measureText(char).width
        + 50;

    }






    const width =
    Math.max(
        1200,
        tempWidth
    );


    const height = 500;





    let img =
    PImage.make(
        width,
        height
    );



    let ctx =
    img.getContext("2d");




    // Background

    ctx.fillStyle =
    "white";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );




    // Text

    ctx.fillStyle =
    "black";


    ctx.font =
    FONT_SIZE +
    "px SpectroFont";





    let x = 80;


    let y = 360;



    for(
        let char of text
    ){


        ctx.fillText(
            char,
            x,
            y
        );



        let charWidth =
        ctx.measureText(char)
        .width;



        // مسافة بين الحروف

        x +=
        charWidth + 50;


    }







    // =============================
    // Convert Image To Pixels
    // =============================

    let pixels=[];



    for(
        let y=0;
        y<height;
        y++
    ){


        let row=[];



        for(
            let x=0;
            x<width;
            x++
        ){


            let index =
            (
                y*width+x
            )*4;



            let brightness =
            img.data[index];



            row.push(

                brightness < 200
                ? 1
                : 0

            );


        }



        pixels.push(row);


    }





    return autoCrop(
        pixels
    );

}







// =============================
// Auto Crop
// =============================

function autoCrop(pixels){


    let minX =
    pixels[0].length;


    let maxX=0;


    let minY =
    pixels.length;


    let maxY=0;


    let found=false;



    for(
        let y=0;
        y<pixels.length;
        y++
    ){


        for(
            let x=0;
            x<pixels[y].length;
            x++
        ){


            if(
                pixels[y][x]===1
            ){


                found=true;


                minX =
                Math.min(
                    minX,
                    x
                );


                maxX =
                Math.max(
                    maxX,
                    x
                );


                minY =
                Math.min(
                    minY,
                    y
                );


                maxY =
                Math.max(
                    maxY,
                    y
                );


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





module.exports = {

    textToPixels

};