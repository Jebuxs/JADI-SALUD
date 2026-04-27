import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;

    // 1. Si no hay usuario y no estamos en login, ir a login
    if (!user) {
        if (!path.includes("login.html")) window.location.href = "login.html";
        return;
    }

    // 2. Si hay usuario, verificamos su configuración
    const docSnap = await getDoc(doc(db, "centros", user.uid));
    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Reglas de oro:
        if (data.configurado === true) {
            // Si está configurado, solo puede estar en dashboard
            if (path.includes("setup.html") || path.includes("login.html")) {
                window.location.href = "dashboard.html";
            }
        } else {
            // Si NO está configurado, fuérzalo a setup
            if (!path.includes("setup.html") && !path.includes("dashboard.html")) {
                window.location.href = "setup.html";
            }
        }
    }
});
