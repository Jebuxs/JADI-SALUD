import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Hacemos que signOut sea accesible globalmente para el botón del dashboard
window.auth = { signOut: () => signOut(auth) };

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Si no hay usuario, regresa al login
        window.location.href = "login.html";
        return;
    }

    // Si hay usuario, verificamos su configuración
    const docSnap = await getDoc(doc(db, "centros", user.uid));
    
    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Si el usuario llega a dashboard.html pero no está configurado, mándalo a setup
        if (data.configurado === false && window.location.pathname !== "/setup.html") {
            window.location.href = "setup.html";
        }
        // Si ya está configurado, no hacemos nada, que vea el dashboard
        onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docSnap = await getDoc(doc(db, "centros", user.uid));
        const data = docSnap.data();

        // Si NO está configurado y está intentando entrar al dashboard...
        if (!data.configurado && window.location.pathname.includes("dashboard.html")) {
            window.location.href = "setup.html"; // ¡De vuelta al setup!
        }
    } else {
        window.location.href = "login.html";
    }
});
    }
});
