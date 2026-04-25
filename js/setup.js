import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
let serviciosTemporales = [];

// 1. Lógica para el botón "Agregar Servicio"
document.getElementById('btnAgregar').addEventListener('click', () => {
    const input = document.getElementById('servicioInput');
    const nombreServicio = input.value.trim();

    if (nombreServicio !== "") {
        serviciosTemporales.push(nombreServicio);
        
        // Mostrar en la lista de la pantalla
        const li = document.createElement('li');
        li.textContent = nombreServicio;
        li.style.color = "#00f2ff";
        document.getElementById('listaServicios').appendChild(li);
        
        input.value = ""; // Limpiar el campo
    } else {
        alert("Escribe un nombre para el servicio.");
    }
});

// 2. Lógica para el botón "Finalizar"
document.getElementById('btnFinalizar').addEventListener('click', async () => {
    const user = auth.currentUser;
    const nombreEst = document.getElementById('nombreEstablecimiento').value.trim();

    if (!user) return alert("Sesión expirada. Ingresa de nuevo.");
    if (nombreEst === "") return alert("Por favor, ponle un nombre a tu establecimiento.");
    if (serviciosTemporales.length === 0) return alert("Agrega al menos un servicio.");

    try {
        const centroRef = doc(db, "centros", user.uid);

        // A. Guardamos el nombre del establecimiento y marcamos como configurado
        await updateDoc(centroRef, {
            nombreEstablecimiento: nombreEst,
            configurado: true
        });

        // B. Guardamos los servicios en una sub-colección para que sea escalable
        const serviciosCol = collection(centroRef, "servicios");
        for (let s of serviciosTemporales) {
            await addDoc(serviciosCol, { nombre: s, fecha: new Date() });
        }

        alert("¡Configuración guardada con éxito!");
        window.location.href = "dashboard.html"; // Ahora sí, al Dashboard

    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Hubo un error al guardar los datos.");
    }
});
