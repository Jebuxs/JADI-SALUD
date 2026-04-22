import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase (Tu motor central)
const firebaseConfig = {
    apiKey: "AIzaSyAwspV-1KcllVyRAbajVPLc0lwsWMOLIco",
    authDomain: "jadi-salud.firebaseapp.com",
    projectId: "jadi-salud",
    storageBucket: "jadi-salud.firebasestorage.app",
    messagingSenderId: "679691723583",
    appId: "1:679691723583:web:4235a2493d09a9196ea98a",
    measurementId: "G-GWBSTLYJ3C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LÓGICA DEL ECOSISTEMA DINÁMICO ---
const params = new URLSearchParams(window.location.search);
const centroId = params.get('id'); 

// Esta función limpia el ID (ej: de "luz-para-siempre" a "LUZ PARA SIEMPRE")
function formatearNombre(slug) {
    if (!slug) return "JADI SALUD";
    return slug.replace(/-/g, ' ').toUpperCase();
}

const nombreReal = formatearNombre(centroId);

// Aplicar cambios a la interfaz automáticamente
if (centroId) {
    document.title = `${nombreReal} | Gestión`;
    const logo = document.getElementById('nombreNegocio');
    if (logo) logo.innerText = nombreReal;
    
    const sub = document.getElementById('tagline');
    if (sub) sub.innerText = "SISTEMA PRIVADO DE GESTIÓN";
}

// --- REGISTRO UNIVERSAL ---
const form = document.getElementById('registroForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cedula = document.getElementById('cedula').value;

    const datos = {
        cedula: cedula,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        tipoSangre: document.getElementById('tipoSangre').value,
        alergias: document.getElementById('alergias').value,
        centroMedico: centroId || "jadi_default", // Aquí se marca de quién es el paciente
        fechaRegistro: new Date().toISOString(),
        procedencia: window.location.href // Guardamos el link exacto por seguridad
    };

    try {
        await setDoc(doc(db, "pacientes", cedula), datos);
        alert(`¡PACIENTE REGISTRADO EN ${nombreReal}!`);
        form.reset();
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión. Revisa los permisos de Firebase.");
    }
});
