import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
let lista = [];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnAgregar').addEventListener('click', () => {
        const input = document.getElementById('servicioInput');
        if (input.value.trim()) {
            lista.push(input.value);
            const li = document.createElement('li');
            li.textContent = input.value;
            document.getElementById('listaServicios').appendChild(li);
            input.value = "";
        }
    });

    document.getElementById('btnFinalizar').addEventListener('click', async () => {
        const user = auth.currentUser;
        const nombre = document.getElementById('nombreEstablecimiento').value.trim();

        if (!nombre || lista.length === 0) return alert("Completa nombre y servicios");

        try {
            // USAMOS setDoc con {merge: true} para crear o actualizar sin borrar otros datos
            await setDoc(doc(db, "centros", user.uid), {
                nombreEstablecimiento: nombre,
                configurado: true
            }, { merge: true });

            const subCol = collection(doc(db, "centros", user.uid), "servicios");
            for(let s of lista) { 
                await addDoc(subCol, { nombre: s, fecha: new Date() }); 
            }

            alert("Configuración completada");
            window.location.href = "dashboard.html";
        } catch(e) { 
            console.error(e);
            alert("Error: " + e.message); 
        }
    });
});
