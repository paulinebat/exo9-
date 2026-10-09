const video = document.querySelector("#video")
const btnStart = document.querySelector("#btn-start")
const btnGrab = document.querySelector("#btn-grab")
const btnPhoto = document.querySelector("#btn-photo")
const canvas = document.querySelector("#canvas");
let imageCapture;

btnStart.addEventListener("click", () =>{
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => { /* diffuser le flux */ 
            video.srcObject = stream;

            const track = stream.getVideoTracks()[0];
            if ('ImageCapture' in window) {
                imageCapture = new ImageCapture(track);
                btnGrab.disabled = false;
                btnPhoto.disabled = false;
            } else {
                alert("L'API ImageCapture n'est pas supportée par votre navigateur (essayez Chrome/Edge).");
            }

            /*imageCapture = new ImageCapture(track);

            btnGrab.disabled = false;
            btnPhoto.disabled = false;*/
})
.catch((err) => {
    console.error("Erreur d'accès à la caméra :", err)
});

})

btnGrab.addEventListener("click", () => {
    imageCapture.grabFrame()
        .then((imageBitmap) => { 
            canvas.width = imageBitmap.width; 
            canvas.height = imageBitmap.height; 
            const ctx = canvas.getContext("2d"); 
            ctx.drawImage(imageBitmap, 0, 0); 

            const dataURL = canvas.toDataURL("image/png");
            const linkCanvas = document.querySelector("#download-canvas");
            linkCanvas.href = dataURL;
            linkCanvas.computedStyleMap.display = "inline";
})
.catch((err) => console.error("Erreur grabFrame() :", err))

})

btnPhoto.addEventListener("click", () =>{
    imageCapture.takePhoto()
    .then((blob) =>{
        const img = document.querySelector("#photo");
        const objectURL = URL.createObjectURL(blob);

        img.src = objectURL;
        img.onload = () => {URL.revokeObjectURL(objectURL);};

        const linkPhoto = document.querySelector("#download-photo");
        linkPhoto.href = objectURL;
        linkPhoto.computedStyleMap.display = "inline";
        
    })
    .catch((err) => console.error("Erreur takePhoto() :", err))
})
