import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = { /* ... tus datos ... */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Función auxiliar para redirigir según BD
async function verificarRedireccion(uid) {
    const docSnap = await getDoc(doc(db, "centros", uid));
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.configurado === true) {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "setup.html";
        }
    } else {
        alert("Usuario no registrado en sistema.");
    }
}

export const Auth = {
    login: async (email, pass) => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, pass);
            await verificarRedireccion(cred.user.uid);
        } catch (e) {
            if (e.code === 'auth/user-not-found') alert("Usuario no existe.");
            else alert("Error: " + e.message);
        }
    },
    google: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // Si el usuario es nuevo, tu lógica anterior de register ya lo creó en BD
            // Aquí simplemente verificamos a dónde enviarlo
            alert("JADI-SALUD TE DA LA BIENVENIDA");
            await verificarRedireccion(result.user.uid);
        } catch (e) { alert("Error: " + e.message); }
    }
};
