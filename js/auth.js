import { auth, db } from './init.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();

export const Auth = {
    login: async (email, pass) => {
        try { await signInWithEmailAndPassword(auth, email, pass); } 
        catch (e) { alert("Error: " + e.message); }
    },
    register: async (name, email, pass) => {
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "centros", cred.user.uid), { nombre: name, email: email, configurado: false });
        } catch (e) { alert("Error: " + e.message); }
    },
    google: async () => { await signInWithRedirect(auth, provider); },
    handleRedirect: async () => {
        const result = await getRedirectResult(auth);
        if (result) {
            const user = result.user;
            await setDoc(doc(db, "centros", user.uid), { nombre: user.displayName, email: user.email, configurado: false }, { merge: true });
        }
    }
};
