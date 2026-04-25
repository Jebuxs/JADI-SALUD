import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docSnap = await getDoc(doc(db, "centros", user.uid));
        
        if (docSnap.exists() && docSnap.data().configurado === false) {
            // El usuario existe pero NO está configurado -> Redirigir al Setup
            window.location.href = "setup.html"; 
        } else {
            console.log("Sistema listo, cargando dashboard...");
        }
    } else {
        window.location.href = "login.html";
    }
});
