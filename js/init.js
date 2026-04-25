import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Hacemos que signOut sea global para poder usarlo en los botones de salida
window.auth = { signOut: () => signOut(auth) };

onAuthStateChanged(auth, async (user) => {
    // 1. Si NO hay usuario, debe estar en login
    if (!user) {
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    // 2. Si hay usuario, consultamos su estado en Firestore
    const docSnap = await getDoc(doc(db, "centros", user.uid));
    
    // Obtenemos la ruta actual para saber dónde está parado el usuario
    const path = window.location.pathname;

    if (docSnap.exists()) {
        const data = docSnap.data();

        // 3. Lógica de seguridad estricta
        if (data.configurado === false) {
            // Si NO está configurado, NO puede estar en el dashboard
            if (!path.includes("setup.html")) {
                window.location.href = "setup.html";
            }
        } else {
            // Si YA está configurado, NO debe volver al login ni al setup
            if (path.includes("login.html") || path.includes("setup.html")) {
                window.location.href = "dashboard.html";
            }
        }
    } else {
        // Si el usuario existe en Auth pero no en Firestore, algo anda mal: forzar a setup
        if (!path.includes("setup.html")) {
            window.location.href = "setup.html";
        }
    }
});
