const FFT = require("fft-js").fft;
const WavDecoder = require("wav-decoder");


async function wavToSpectrogram(buffer){


    const audio =
    await WavDecoder.decode(
        buffer
    );


    const samples =
    audio.channelData[0];



    const size = 1024;

    const hop = 512;


    let result=[];



    for(
        let start=0;
        start+size<samples.length;
        start+=hop
    ){


        let frame =
        samples.slice(
            start,
            start+size
        );



        let spectrum =
        FFT(frame);



        let row=[];



        for(
            let i=0;
            i<size/2;
            i++
        ){


            let real =
            spectrum[i][0];


            let imag =
            spectrum[i][1];



            let power =
            Math.sqrt(
                real*real +
                imag*imag
            );



            row.push(
                power
            );


        }



        result.push(row);


    }



    return result;

}



module.exports={
    wavToSpectrogram
};