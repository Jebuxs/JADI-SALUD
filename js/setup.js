import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
let servicios = [];

// Agregar servicio a la lista temporal
document.getElementById('btnAgregar').addEventListener('click', () => {
    const input = document.getElementById('servicio');
    if (input.value) {
        servicios.push(input.value);
        const li = document.createElement('li');
        li.textContent = input.value;
        document.getElementById('listaServicios').appendChild(li);
        input.value = '';
    }
});

// Guardar todo en Firebase
document.getElementById('btnFinalizar').addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        const centroRef = doc(db, "centros", user.uid);
        
        // 1. Guardamos la lista de servicios en una subcolección
        for (const nombre of servicios) {
            await addDoc(collection(centroRef, "servicios"), { nombre: nombre });
        }

        // 2. Marcamos como configurado
        await setDoc(centroRef, { configurado: true }, { merge: true });

        alert("¡Configuración exitosa!");
        window.location.href = "dashboard.html";
    }
});
