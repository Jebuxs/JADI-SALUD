import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

window.auth = { signOut: () => signOut(auth) };

onAuthStateChanged(auth, async (user) => {
    // 1. Si no hay usuario, obligar a ir a login
    if (!user) {
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    // 2. Si hay usuario, consultamos su estado en la base de datos
    const docSnap = await getDoc(doc(db, "centros", user.uid));
    
    if (docSnap.exists()) {
        const data = docSnap.data();
        const path = window.location.pathname;

        // 3. Lógica de seguridad estricta:
        // Si no está configurado (false) y no está en la página de setup, MANDAR A SETUP
        if (data.configurado === false && !path.includes("setup.html")) {
            window.location.href = "setup.html";
        } 
        // Si ya está configurado (true) y está en la página de setup, MANDAR A DASHBOARD
        else if (data.configurado === true && path.includes("setup.html")) {
            window.location.href = "dashboard.html";
        }
    }
});
