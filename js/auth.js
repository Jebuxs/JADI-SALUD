import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { JADI_CORE } from './generator.js'; // Verifica que generator.js esté en la carpeta js

const firebaseConfig = {
    apiKey: "AIzaSyAwspV-1KcllVyRAbajVPLc0lwsWMOLIco", 
    authDomain: "jadi-salud.firebaseapp.com",
    projectId: "jadi-salud",
    storageBucket: "jadi-salud.firebasestorage.app",
    appId: "1:679691723583:web:4235a2493d09a9196ea98a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

async function verificarRedireccion(uid) {
    try {
        const docSnap = await getDoc(doc(db, "centros", uid));
        if (docSnap.exists()) {
            const data = docSnap.data();
            window.location.href = data.configurado === true ? "dashboard.html" : "setup.html";
        }
    } catch (e) { console.error("Error al verificar:", e); }
}

export const Auth = {
    showRegister: () => { document.getElementById('view-login').style.display = 'none'; document.getElementById('view-register').style.display = 'block'; },
    showLogin: () => { document.getElementById('view-login').style.display = 'block'; document.getElementById('view-register').style.display = 'none'; },
    
    login: async (email, pass) => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, pass);
            await verificarRedireccion(cred.user.uid);
        } catch (e) { alert("Error: " + e.message); }
    },

    google: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const docRef = doc(db, "centros", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    nombre: user.displayName,
                    idNegocio: JADI_CORE.generateBusinessID(user.displayName),
                    email: user.email,
                    configurado: false 
                });
            }
            alert("JADI-SALUD TE DA LA BIENVENIDA");
            await verificarRedireccion(user.uid);
        } catch (e) { alert("Error: " + e.message); }
    }
};
