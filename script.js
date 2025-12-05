// --- 1. REFERENCIAS AL HTML (Las herramientas) ---
const formulario = document.getElementById("formularioGasto");
const contenedorLista = document.getElementById("listaGastos");
const inputNombre = document.getElementById("inputNombre");
const inputPrecio = document.getElementById("inputPrecio");
const textoTotal = document.getElementById("totalGastos");

// --- 2. ESTADO DE LA APP (La memoria) ---
let gastos = JSON.parse(localStorage.getItem('misGastos')) || [];

// --- 3. FUNCIONES (La lógica) ---

// Función para calcular y mostrar el total
const actualizarTotal = () => {
    let total = 0;
    for (let gasto of gastos) {
        total += gasto.precio;
    }

    // Formatear con 2 decimales
    textoTotal.textContent = `Total: ${total.toFixed(2)} €`;

    // Cambiar clase según el total (CSS maneja los estilos)
    if (total > 100) {
        textoTotal.classList.remove('success');
        textoTotal.classList.add('danger');
    } else {
        textoTotal.classList.remove('danger');
        textoTotal.classList.add('success');
    }
};

// Función para pintar un gasto en la pantalla
const imprimirGasto = (gasto) => {
    // Crear el li
    const li = document.createElement('li');

    // Crear contenedor de info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'gasto-info';

    const nombreSpan = document.createElement('span');
    nombreSpan.className = 'gasto-nombre';
    nombreSpan.textContent = gasto.nombre;

    const precioSpan = document.createElement('span');
    precioSpan.className = 'gasto-precio';
    precioSpan.textContent = `${gasto.precio.toFixed(2)} €`;

    infoDiv.appendChild(nombreSpan);
    infoDiv.appendChild(precioSpan);

    // Crear el botón de borrar
    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = "Borrar";
    botonBorrar.className = 'boton-borrar';
    botonBorrar.setAttribute('aria-label', `Borrar gasto: ${gasto.nombre}`);

    // Funcionalidad del botón borrar
    botonBorrar.addEventListener('click', () => {
        // Animación de salida
        li.style.opacity = '0';
        li.style.transform = 'translateX(10px)';

        setTimeout(() => {
            // 1. Borrar de la pantalla
            li.remove();

            // 2. Borrar del array (memoria)
            const indice = gastos.indexOf(gasto);
            if (indice > -1) {
                gastos.splice(indice, 1);
            }

            // 3. Actualizar localStorage
            localStorage.setItem('misGastos', JSON.stringify(gastos));

            // 4. Actualizar el total visual
            actualizarTotal();

            // 5. Mostrar empty state si no hay gastos
            mostrarEmptyState();
        }, 200);
    });

    // Unir todo
    li.appendChild(infoDiv);
    li.appendChild(botonBorrar);
    contenedorLista.appendChild(li);
};

// Función para mostrar/ocultar empty state
const mostrarEmptyState = () => {
    const existingEmpty = contenedorLista.querySelector('.empty-state');

    if (gastos.length === 0) {
        if (!existingEmpty) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = `
                <div class="empty-state-icon">📝</div>
                <p>No hay gastos registrados</p>
            `;
            contenedorLista.appendChild(emptyDiv);
        }
    } else {
        if (existingEmpty) {
            existingEmpty.remove();
        }
    }
};

// --- 4. EVENTOS (La interacción) ---

// Evento del formulario (submit)
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = inputNombre.value.trim();
    const precio = Number(inputPrecio.value);

    if (nombre && precio > 0) {
        const nuevoGasto = { nombre, precio };

        // Guardar datos
        gastos.push(nuevoGasto);
        localStorage.setItem('misGastos', JSON.stringify(gastos));

        // Quitar empty state si existe
        const emptyState = contenedorLista.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        // Actualizar interfaz
        imprimirGasto(nuevoGasto);
        actualizarTotal();

        // Limpiar inputs
        inputNombre.value = "";
        inputPrecio.value = "";
        inputNombre.focus();
    }
});

// --- 5. INICIO (Al cargar la página) ---

// Pintar los gastos guardados
for (let gasto of gastos) {
    imprimirGasto(gasto);
}

// Mostrar empty state si no hay gastos
mostrarEmptyState();

// Calcular el total inicial
actualizarTotal();
