import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        if (!window.location.pathname.includes("login.html")) window.location.href = "login.html";
        return;
    }

    const docSnap = await getDoc(doc(db, "centros", user.uid));
    const path = window.location.pathname;

    // Si NO existe el documento O no está configurado
    if (!docSnap.exists() || docSnap.data().configurado !== true) {
        if (!path.includes("setup.html")) {
            window.location.href = "setup.html"; // SE QUEDA ATRAPADO AQUÍ
        }
    } else {
        // Si YA está configurado, no puede volver a entrar al setup
        if (path.includes("setup.html")) {
            window.location.href = "dashboard.html";
        }
    }
});
