"use strict";


let photo = document.getElementById("photo");
let preview = document.querySelector(".preview");

let imgPreview= document.querySelector(".img__preview");

photo.addEventListener("change",(e)=>{
    

    let file = e.target.files[0];
    let reader = new FileReader();
    // validaciones
    if(!file) return;

    if(!file.type.startsWith("image/")){
        alert("selecciona una imagen valida");
        return
    }


    // cuando cargue
    reader.onload = (e)=>{
       imgPreview.src = e.target.result;
    } 
    reader.readAsDataURL(file);

})





