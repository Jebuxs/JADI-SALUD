import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Hacemos que signOut sea global para usarlo en tus botones de cierre de sesión
window.auth = { signOut: () => signOut(auth) };

onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;

    // 1. Si no hay usuario, redirigir a login (si no está ya ahí)
    if (!user) {
        if (!path.includes("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    // 2. Si hay usuario, consultar si ya configuró su centro
    try {
        const docSnap = await getDoc(doc(db, "centros", user.uid));
        const estaConfigurado = docSnap.exists() && docSnap.data().configurado === true;

        // 3. Reglas de redirección estrictas
        if (!estaConfigurado) {
            // Si NO está configurado, solo puede estar en setup.html
            if (!path.includes("setup.html")) {
                console.log("Redirigiendo a configuración...");
                window.location.href = "setup.html";
            }
        } else {
            // Si YA está configurado, NO debe estar en setup.html ni en login
            if (path.includes("setup.html") || path.includes("login.html")) {
                window.location.href = "dashboard.html";
            }
        }
    } catch (error) {
        console.error("Error al verificar estado:", error);
    }
});
