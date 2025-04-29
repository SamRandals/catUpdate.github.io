"use strict";

const send = document.getElementById("send"); //send button
const errors = document.getElementById("messages")  //error msgs

function openDB(){
    return new Promise((resolve, reject)=>{

        
    const request = indexedDB.open("Cats",1);
    
    request.onupgradeneeded=()=>{
        const db = request.result;
        if(!db.objectStoreNames.contains("Race")){
        db.createObjectStore("Race",{autoIncrement:true});
        }
    }

    request.onsuccess=()=>{
         const db = request.result;
         resolve(db)
        }
    request.onerror=()=>{
        reject("Ha ocurrido un error");
    }

    })
}

send.addEventListener("click",async (e)=>{
    e.preventDefault();

// definir datos de input

const nameInput = document.getElementById("name");
const raceInput = document.getElementById("race");
const photoInput = document.getElementById("photo");
const img = document.getElementById("img");
// variables representativas:
const name = nameInput.value;
const race = raceInput.value
const files = photoInput.files[0];

// Validaciones
if(!name && race && files){
    errors.classList.add("fail");
    errors.textContent="Llena todos los datos por favor"
}
else if(!files){
    errors.classList.add("fail");
    errors.textContent="Por favor sube una imagen de tu gatito"
}
else if(!files.type.startsWith("image/")){
    errors.classList.add("fail");
    errors.textContent="Este tipo de imagenes no es valida"
}
else{
    errors.classList.remove("fail");
    errors.classList.add("success");
     errors.textContent="Sus datos fueron guardados correctamente."
     nameInput.value="";
     raceInput.value=""
     img.src="";
}


const addCat= (db,data)=>{
    return new Promise((resolve, reject)=>{

        const DBTransaction = db.transaction("Race","readwrite");
        const IDBobjectStorage = DBTransaction.objectStore("Race")

        IDBobjectStorage.add(data);
        DBTransaction.onsuccess=()=>{
            resolve();
        }
        DBTransaction.onerror=()=>{
            reject("Ocurrio un error");
        }
    })
}



    const reader= new FileReader();
    reader.readAsDataURL(files);

    reader.onload= async()=>{
        
    const photoBase64 = reader.result;
    const cat = {
        name,
        race,
        photo: photoBase64
    }

    try{
        const db = await openDB();
       await addCat(db, cat);
        
        console.log("Datos guardados correctamente");
    }
    catch(error){
        console.log(error)
    }
    }


})



// loadCats


function loadCats(){
    openDB().then((db)=>{
        const IDBtransaction = db.transaction("Race", "readonly");
        const ObjStore= IDBtransaction.objectStore("Race");
        const request = ObjStore.openCursor();
        const catList= document.getElementById("cat__list");

        catList.innerHTML="";


        request.onsuccess=()=>{
            const cursor =request.result;
            if(cursor){
                const {name, race, photo} = cursor.value;

                const container  = document.createElement("div");
                container.classList.add("cat_item");

                container.innerHTML=`

                <div class="content__wrapper">
                <div class="image__container">
                <img class="cat__image" src="${photo}">
                </div>
                <div class="text__container">
                    <p>Nombre: ${name}</p>
                    <p>Raza: ${race}</p>
                </div>
                </div>
                `

                catList.appendChild(container);
                cursor.continue();
            }
        }
    })
}

window.onload=loadCats();