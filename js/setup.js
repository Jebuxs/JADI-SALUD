import { getFirestore, doc, updateDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
let serviciosArray = [];
let esValido = false;

// Función auxiliar para crear el slug
const crearSlug = (nombre) => nombre.toUpperCase().trim().replace(/\s+/g, '_').substring(0, 15);

// Validación del nombre
document.getElementById('nombreNegocio').addEventListener('blur', async (e) => {
    const val = e.target.value.trim();
    if (!val) return;

    const slug = crearSlug(val);
    const q = query(collection(db, "centros"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        document.getElementById('status').innerHTML = "✅";
        esValido = true;
    } else {
        document.getElementById('status').innerHTML = "❌";
        alert("El nombre ya está registrado. Intenta con otro.");
        e.target.focus();
        esValido = false;
    }
});

// Agregar Servicio
document.getElementById('btnAgregarServ').addEventListener('click', () => {
    const input = document.getElementById('servicioInput');
    if (!input.value) return alert("Escribe un servicio primero");

    serviciosArray.push(input.value);
    
    const li = document.createElement('li');
    li.className = 'service-item';
    li.innerHTML = `${input.value} <span style="color:red; cursor:pointer;" onclick="this.parentElement.remove()">[Eliminar]</span>`;
    
    document.getElementById('listaServicios').appendChild(li);
    input.value = '';
    document.getElementById('btnFinalizar').disabled = false;
});

// Finalizar
document.getElementById('btnFinalizar').addEventListener('click', async () => {
    if (!esValido) return alert("Nombre de establecimiento inválido");
    
    const user = auth.currentUser;
    if (!user) return alert("Error de sesión");

    try {
        await updateDoc(doc(db, "centros", user.uid), {
            slug: crearSlug(document.getElementById('nombreNegocio').value),
            servicios: serviciosArray,
            configurado: true
        });
        window.location.href = "dashboard.html";
    } catch (e) { alert("Error al guardar: " + e.message); }
});
