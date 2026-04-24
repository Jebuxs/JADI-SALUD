// --- 1. CONFIGURACIÓN PWA (Instalación automática) ---
let deferredPrompt;
const installBanner = document.getElementById('installBanner'); // Asegúrate que este div esté en tu index.html

if ('serviceWorker' in navigator) {
    // Nota: Ajusta la ruta si es necesario, ej: '/JADI-SALUD/sw.js'
    navigator.serviceWorker.register('/JADI-SALUD/sw.js');
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBanner) installBanner.style.display = 'block';
});

if (installBanner) {
    installBanner.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    installBanner.style.display = 'none';
                }
                deferredPrompt = null;
            });
        }
    });
}

// --- 2. FIREBASE & LÓGICA DE NEGOCIO ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);
const centroId = params.get('id'); 

function formatearNombre(slug) {
    if (!slug) return "JADI SALUD";
    return slug.replace(/-/g, ' ').toUpperCase();
}

const nombreReal = formatearNombre(centroId);

if (centroId) {
    document.title = `${nombreReal} | Gestión`;
    const logo = document.getElementById('nombreNegocio');
    if (logo) logo.innerText = nombreReal;
    const sub = document.getElementById('tagline');
    if (sub) sub.innerText = "SISTEMA PRIVADO DE GESTIÓN";
}

const form = document.getElementById('registroForm');
if (form) {
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
            centroMedico: centroId || "jadi_default",
            fechaRegistro: new Date().toISOString(),
            procedencia: window.location.href
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
}
