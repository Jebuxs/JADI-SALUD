import { getFirestore, doc, updateDoc, collection, query, where, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
let serviciosArray = [];
let esValido = false;

// Formateador de Slug
const crearSlug = (nombre) => nombre.toUpperCase().replace(/\s+/g, '_').substring(0, 15);

// Validación Inmediata
document.getElementById('nombreNegocio').addEventListener('blur', async (e) => {
    const nombre = e.target.value;
    const status = document.getElementById('status');
    if (!nombre) return;

    const q = query(collection(db, "centros"), where("slug", "==", crearSlug(nombre)));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        status.innerHTML = "✅"; 
        esValido = true;
    } else {
        status.innerHTML = "❌";
        alert("El nombre ya está ocupado.");
        e.target.focus();
        esValido = false;
    }
});

// Agregar Servicio
document.getElementById('btnAgregarServ').addEventListener('click', () => {
    const input = document.getElementById('servicioInput');
    if (!input.value) return alert("Debes escribir un servicio");
    
    serviciosArray.push(input.value);
    const li = document.createElement('li');
    li.className = 'service-item';
    li.innerHTML = `${input.value} <span onclick="this.parentElement.remove()" style="color:red; cursor:pointer;">X</span>`;
    document.getElementById('listaServicios').appendChild(li);
    input.value = '';
    document.getElementById('btnFinalizar').disabled = false;
});

// Finalizar
document.getElementById('btnFinalizar').addEventListener('click', async () => {
    if (!esValido) return;
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, "centros", uid), {
        slug: crearSlug(document.getElementById('nombreNegocio').value),
        servicios: serviciosArray,
        configurado: true
    });
    window.location.href = "dashboard.html";
});
