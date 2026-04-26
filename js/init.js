import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const docSnap = await getDoc(doc(db, "centros", user.uid));
    
    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Si no está configurado, lanza el mensaje y redirige
        if (data.configurado !== true) {
            console.log("AQUI ESTOY");
            alert("AQUI ESTOY: Falta configurar el centro");
            window.location.href = "setup.html";
        }
    }
});
