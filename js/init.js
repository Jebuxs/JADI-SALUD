import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAwspV-1KcllVyRAbajVPLc0lwsWMOLIco", 
    authDomain: "jadi-salud.firebaseapp.com",
    projectId: "jadi-salud",
    storageBucket: "jadi-salud.firebasestorage.app",
    appId: "1:679691723583:web:4235a2493d09a9196ea98a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;
    if (!user) {
        if (!path.includes("login.html")) window.location.href = "login.html";
        return;
    }

    const docSnap = await getDoc(doc(db, "centros", user.uid));
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.configurado === true && (path.includes("setup.html") || path.includes("login.html"))) {
            window.location.href = "dashboard.html";
        } else if (data.configurado === false && !path.includes("setup.html") && !path.includes("dashboard.html")) {
            window.location.href = "setup.html";
        }
    }
});
