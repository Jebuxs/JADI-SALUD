import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración de Firebase (JADI SALUD)
const firebaseConfig = {
  apiKey: "AIzaSyAwspV-1KcllVyRAbajVPLc0lwsWMOLIco",
  authDomain: "jadi-salud.firebaseapp.com",
  projectId: "jadi-salud",
  storageBucket: "jadi-salud.firebasestorage.app",
  messagingSenderId: "679691723583",
  appId: "1:679691723583:web:4235a2493d09a9196ea98a",
  measurementId: "G-GWBSTLYJ3C"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LÓGICA CAMALEÓN (Identidad Dinámica) ---
const params = new URLSearchParams(window.location.search);
const centroId = params.get('id'); 

// Si el link tiene ?id=azucena, personalizamos la interfaz
if (centroId === 'azucena') {
    document.title = "Azucena Medical Center | Gestión";
    const logo = document.getElementById('nombreNegocio');
    if (logo) {
        logo.innerHTML = `AZUCENA <span class="accent">MEDICAL</span>`;
    }
    const sub = document.getElementById('tagline');
    if (sub) {
        sub.innerText = "SISTEMA PRIVADO DE GESTIÓN";
    }
}

// --- LÓGICA DE REGISTRO ---
const form = document.getElementById('registroForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Captura de datos del formulario
    const datos = {
        cedula: document.getElementById('cedula').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        tipoSangre: document.getElementById('tipoSangre').value,
        alergias: document.getElementById('alergias').value,
        centroMedico: centroId || "jadi_default", // Guarda bajo qué centro se registró
        fechaRegistro: new Date().toISOString()
    };

    try {
        // Guardamos en la colección "pacientes", usando la cédula como ID único
        await setDoc(doc(db, "pacientes", datos.cedula), datos);
        alert("¡PACIENTE REGISTRADO CON ÉXITO!");
        form.reset();
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error de conexión. Verifica la consola.");
    }
});
