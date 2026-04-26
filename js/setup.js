import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
let serviciosTemporales = [];

document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btnAgregar');
    const btnFinalizar = document.getElementById('btnFinalizar');

    if (!btnAgregar || !btnFinalizar) {
        console.error("Error: No se encontraron los botones en el HTML. Verifica los IDs.");
        return;
    }

    btnAgregar.addEventListener('click', () => {
        const input = document.getElementById('servicioInput');
        const nombreServicio = input.value.trim();

        if (nombreServicio !== "") {
            serviciosTemporales.push(nombreServicio);
            const li = document.createElement('li');
            li.textContent = nombreServicio;
            li.style.color = "#00f2ff";
            document.getElementById('listaServicios').appendChild(li);
            input.value = ""; 
        } else {
            alert("Escribe un nombre para el servicio.");
        }
    });

    btnFinalizar.addEventListener('click', async () => {
        const user = auth.currentUser;
        const nombreEst = document.getElementById('nombreEstablecimiento').value.trim();

        if (!user) return alert("Sesión expirada. Ingresa de nuevo.");
        if (nombreEst === "") return alert("Por favor, ponle un nombre a tu establecimiento.");
        if (serviciosTemporales.length === 0) return alert("Agrega al menos un servicio.");

        try {
            const centroRef = doc(db, "centros", user.uid);
            await updateDoc(centroRef, {
                nombreEstablecimiento: nombreEst,
                configurado: true
            });

            const serviciosCol = collection(centroRef, "servicios");
            for (let s of serviciosTemporales) {
                await addDoc(serviciosCol, { nombre: s, fecha: new Date() });
            }

            alert("¡Configuración guardada!");
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar: " + error.message);
        }
    });
});
