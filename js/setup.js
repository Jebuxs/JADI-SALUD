import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
let servicios = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log("Setup cargado");

    document.getElementById('btnAgregar').onclick = () => {
        const input = document.getElementById('servicioInput');
        if (input.value.trim() !== "") {
            servicios.push(input.value.trim());
            const li = document.createElement('li');
            li.textContent = input.value;
            document.getElementById('listaServicios').appendChild(li);
            input.value = "";
        }
    };

    document.getElementById('btnFinalizar').onclick = async () => {
        const user = auth.currentUser;
        const nombre = document.getElementById('nombreEstablecimiento').value.trim();

        if (!user) return alert("Error: No hay sesión.");
        if (!nombre || servicios.length === 0) return alert("Completa nombre y servicios.");

        try {
            console.log("Guardando...");
            // 1. Guardar centro
            await setDoc(doc(db, "centros", user.uid), {
                nombreEstablecimiento: nombre,
                configurado: true
            }, { merge: true });

            // 2. Guardar servicios
            const col = collection(db, "centros", user.uid, "servicios");
            for (let s of servicios) {
                await addDoc(col, { nombre: s, fecha: new Date() });
            }

            console.log("Redirigiendo...");
            window.location.href = "dashboard.html";
        } catch (e) {
            console.error(e);
            alert("Error: " + e.message);
        }
    };
});
