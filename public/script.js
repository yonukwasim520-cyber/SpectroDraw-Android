const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


function resize(){

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = "white";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


resize();


let drawing = false;



canvas.addEventListener(
"pointerdown",
(e)=>{

    drawing = true;

    canvas.setPointerCapture(
        e.pointerId
    );

    draw(e);

});



canvas.addEventListener(
"pointermove",
(e)=>{

    if(drawing){

        draw(e);

    }

});



canvas.addEventListener(
"pointerup",
()=>{

    drawing = false;

});



canvas.addEventListener(
"pointercancel",
()=>{

    drawing = false;

});





function draw(e){

    const rect =
    canvas.getBoundingClientRect();


    const x =
    e.clientX - rect.left;


    const y =
    e.clientY - rect.top;


    ctx.fillStyle = "black";


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        5,
        0,
        Math.PI * 2
    );


    ctx.fill();

}





document
.getElementById("clear")
.onclick = ()=>{


    ctx.fillStyle="white";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    document
    .getElementById("status")
    .innerText =
    "Cleared";

};







function getImageData(){


    const image =
    ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );


    let pixels = [];



    for(
        let y = 0;
        y < canvas.height;
        y++
    ){

        let row = [];


        for(
            let x = 0;
            x < canvas.width;
            x++
        ){


            let index =
            (y * canvas.width + x) * 4;



            let r =
            image.data[index];


            let g =
            image.data[index + 1];


            let b =
            image.data[index + 2];



            if(
                r < 128 &&
                g < 128 &&
                b < 128
            ){

                row.push(1);

            }
            else{

                row.push(0);

            }


        }


        pixels.push(row);

    }


    return pixels;

}







document
.getElementById("convert")
.onclick = ()=>{


    let pixels =
    getImageData();



    fetch(
        "/capture",
        {

            method:"POST",

            headers:
            {
                "Content-Type":
                "application/json"
            },


            body:
            JSON.stringify(
                {
                    pixels:pixels
                }
            )

        }
    )
    .then(
        response=>response.json()
    )
    .then(
        data=>{

            document
            .getElementById("status")
            .innerText =
            "Drawing sent";

        }
    );


};