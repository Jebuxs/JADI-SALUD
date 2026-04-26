import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const docSnap = await getDoc(doc(db, "centros", user.uid));
    const path = window.location.pathname;

    if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Estado de configuración:", data.configurado); // Mira esto en la consola

        // REGLA DE ORO: Si es false, te echo al setup inmediatamente
        if (data.configurado !== true) {
            if (!path.includes("setup.html")) {
                console.warn("Acceso denegado. Redirigiendo a setup...");
                window.location.href = "setup.html";
            }
        } 
        // REGLA DE ORO 2: Si ya es true, no te dejo volver al setup
        else if (path.includes("setup.html")) {
            window.location.href = "dashboard.html";
        }
    } else {
        // Si no existe el documento, forzar a setup
        if (!path.includes("setup.html")) window.location.href = "setup.html";
    }
});
