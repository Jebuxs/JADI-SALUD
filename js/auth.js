import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { JADI_CORE } from './generator.js';
 
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

export const Auth = {
    showRegister: () => {
        document.getElementById('view-login').style.display = 'none';
        document.getElementById('view-register').style.display = 'block';
    },
    showLogin: () => {
        document.getElementById('view-login').style.display = 'block';
        document.getElementById('view-register').style.display = 'none';
    },
    login: async (email, pass) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            alert("¡Bienvenido a JADI SALUD!");
        } catch (e) { alert("Error: " + e.message); }
    },
    register: async (nombre, email, pass) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const businessID = JADI_CORE.generateBusinessID(nombre);
            await setDoc(doc(db, "centros", userCredential.user.uid), {
                nombre: nombre,
                idNegocio: businessID,
                email: email
            });
            alert("Centro registrado con éxito. ID: " + businessID);
        } catch (e) { alert("Error: " + e.message); }
    },
    google: async () => {
        try { await signInWithPopup(auth, provider); alert("Sesión iniciada con Google"); }
        catch (e) { alert("Error Google: " + e.message); }
    }
};
