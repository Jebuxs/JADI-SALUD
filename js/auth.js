import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
            // No redirigimos aquí. init.js lo hará al detectar el cambio de estado.
        } catch (e) { alert("Error: " + e.message); }
    },
    register: async (nombre, email, pass) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const businessID = JADI_CORE.generateBusinessID(nombre);
            await setDoc(doc(db, "centros", userCredential.user.uid), {
                nombre: nombre,
                idNegocio: businessID,
                email: email,
                configurado: false
            });
            alert("Centro registrado.");
            // init.js detectará el usuario y redirigirá al setup.
        } catch (e) { alert("Error: " + e.message); }
    },
    google: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const docRef = doc(db, "centros", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Caso: Usuario nuevo
                const businessID = JADI_CORE.generateBusinessID(user.displayName);
                await setDoc(docRef, {
                    nombre: user.displayName,
                    idNegocio: businessID,
                    email: user.email,
                    configurado: false 
                });
                alert("¡Bienvenido! Centro creado.");
                // Redirigimos aquí solo si es registro nuevo, 
                // pero el init.js de setup.html reforzará esto.
                window.location.href = "setup.html"; 
            } else {
                // Caso: Usuario que ya existe
                alert("Bienvenido de nuevo.");
                // Al salir de esta función, init.js detectará que el usuario ya existe
                // y te llevará al dashboard automáticamente.
            }
        } catch (e) { 
            console.error(e);
            alert("Error: " + e.message); 
        }
    }
};
