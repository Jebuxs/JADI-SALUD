import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Hacemos que signOut sea global
window.auth = { signOut: () => signOut(auth) };

onAuthStateChanged(auth, async (user) => {
    // 1. Si no hay usuario, obligar a ir a login
    if (!user) {
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    // 2. Si hay usuario, consultar su estado en la base de datos
    const docSnap = await getDoc(doc(db, "centros", user.uid));
    
    if (docSnap.exists()) {
        const data = docSnap.data();

        // 3. Lógica de redirección inteligente
        const estaEnDashboard = window.location.pathname.includes("dashboard.html");
        const estaEnSetup = window.location.pathname.includes("setup.html");

        if (data.configurado === false && estaEnDashboard) {
            // Si no está configurado y está en dashboard, enviarlo a setup
            window.location.href = "setup.html";
        } else if (data.configurado === true && estaEnSetup) {
            // Si ya configuró y está en setup, llevarlo a dashboard
            window.location.href = "dashboard.html";
        }
    }
});
