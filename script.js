const WHATSAPP = "573205810086";

const productos = [
    {
        id: 1,
        nombre: "Cuaderno 5 materias",
        categoria: "cuadernos",
        precio: 15500,
        imagen: "cuaderno 1.jpeg",
        emoji: "📓",
        descripcion: "Cuaderno universitario."
    },
    {
        id: 2,
        nombre: "Cuaderno argollados",
        categoria: "cuadernos",
        precio: 8000,
        imagen: "cuaderno 2.jpeg",
        emoji: "📒",
        descripcion: "Ideal para matemáticas."
    },
    {
        id: 3,
        nombre: "cuaderno cuadriculado",
        categoria: "cuadernos",
        precio: 5000,
        imagen: "cuaderno 3.jpeg",
        emoji: "📔",
        descripcion: " cuadernos cosidos de 100 hojas."
    },
    {
        id: 4,
        nombre: "Diccionario escolar",
        categoria: "libros",
        precio: 25000,
        imagen: "diccionario.jpeg",
        emoji: "📕",
        descripcion: "Descubre nuevas palabras."
    },
    {
        id: 5,
        nombre: "Libros de cuentos",
        categoria: "libros",
        precio: 18000,
        imagen: "libros 1.jpeg",
        emoji: "📖",
        descripcion: "Historias para imaginar."
    },
    {
        id: 6,
        nombre: "Atlas geográfico",
        categoria: "libros",
        precio: 22000,
        imagen: "atlas.jpeg",
        emoji: "🌎",
        descripcion: "Explora el mundo."
    },
    {
        id: 7,
        nombre: "Caja de colores",
        categoria: "papeleria",
        precio: 10500,
        imagen: "colores.jpeg",
        emoji: "🖍️",
        descripcion: "Colores para crear."
    },
    {
        id: 8,
        nombre: "Lápices",
        categoria: "papeleria",
        precio: 2000,
        imagen: "lapices.jpeg",
        emoji: "✏️",
        descripcion: "de todo tipo."
    },
    {
        id: 9,
        nombre: "Marcadores",
        categoria: "papeleria",
        precio: 15000,
        imagen: "marcadores.jpeg",
        emoji: "🖊️",
        descripcion: "Marcadores de colores."
    },
    {
        id: 10,
        nombre: "Calculadora científica",
        categoria: "tecnologia",
        precio: 35000,
        imagen: "calculadora.jpeg",
        emoji: "🧮",
        descripcion: "Para operaciones matemáticas."
    },
    {
        id: 11,
        nombre: "Memoria USB 32 GB",
        categoria: "tecnologia",
        precio: 17000,
        imagen: "memoria.jpeg",
        emoji: "💾",
        descripcion: "Guarda tus archivos."
    },
    {
        id: 12,
        nombre: "Audífonos escolares",
        categoria: "tecnologia",
        precio: 20000,
        imagen: "audifonos.jpeg",
        emoji: "🎧",
        descripcion: "Para contenido educativo."
    }
];

const categorias = {
    cuadernos: "Cuadernos",
    libros: "Libros",
    papeleria: "Papelería",
    tecnologia: "Tecnología"
};

const dinero = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
});

const productosDOM = document.getElementById("productos");
const buscador = document.getElementById("buscador");
const filtro = document.getElementById("filtroCategoria");
const listaDOM = document.getElementById("listaCompras");
const totalDOM = document.getElementById("total");
const cantidadDOM = document.getElementById("cantidadLista");

let carrito = cargarCarrito();

function cargarCarrito() {
    try {
        const datos = JSON.parse(localStorage.getItem("elSaberCarrito"));

        if (!Array.isArray(datos)) return [];

        return datos.filter(item =>
            productos.some(p => p.id === item.id) &&
            Number.isInteger(item.cantidad) &&
            item.cantidad > 0
        );
    } catch {
        return [];
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem("elSaberCarrito", JSON.stringify(carrito));
    } catch {
        console.warn("No se pudo guardar la lista en este navegador.");
    }
}

function renderProductos() {
    const texto = buscador.value.trim().toLocaleLowerCase("es");
    const categoria = filtro.value;

    const encontrados = productos.filter(p =>
        p.nombre.toLocaleLowerCase("es").includes(texto) &&
        (categoria === "todos" || p.categoria === categoria)
    );

    if (encontrados.length === 0) {
        productosDOM.innerHTML =
            '<div class="sin-resultados">🔎 No encontramos productos.</div>';
        return;
    }

    productosDOM.innerHTML = encontrados.map(p => `
        <article class="producto">
            <div class="producto-imagen">
                <img
                    src="${p.imagen}"
                    alt="${p.nombre}"
                    loading="lazy"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
                <span class="emoji-respaldo" style="display:none">${p.emoji}</span>
            </div>

            <div class="producto-info">
                <span class="categoria">${categorias[p.categoria]}</span>
                <h3>${p.nombre}</h3>
                <p>${p.descripcion}</p>
                <div class="precio">${dinero.format(p.precio)}</div>
                <button class="boton-agregar" data-agregar="${p.id}" type="button">
                    🛒 Agregar a mi lista
                </button>
            </div>
        </article>
    `).join("");
}

function agregarProducto(id) {
    const item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({ id, cantidad: 1 });
    }

    guardarCarrito();
    renderLista();
}

function renderLista() {
    const seleccionados = carrito.map(item => {
        const p = productos.find(producto => producto.id === item.id);

        return {
            ...p,
            cantidad: item.cantidad,
            subtotal: p.precio * item.cantidad
        };
    });

    const cantidad = seleccionados.reduce(
        (suma, p) => suma + p.cantidad, 0
    );

    const total = seleccionados.reduce(
        (suma, p) => suma + p.subtotal, 0
    );

    cantidadDOM.textContent =
        `${cantidad} ${cantidad === 1 ? "artículo" : "artículos"}`;

    totalDOM.textContent = dinero.format(total);

    if (seleccionados.length === 0) {
        listaDOM.innerHTML =
            '<p class="vacio">¡Agrega tus productos favoritos! 💜</p>';
        return;
    }

    listaDOM.innerHTML = seleccionados.map(p => `
        <article class="item-lista">
            <div>
                <h4>${p.emoji} ${p.nombre}</h4>
                <p>
                    ${p.cantidad} × ${dinero.format(p.precio)}
                    = ${dinero.format(p.subtotal)}
                </p>
            </div>

            <button class="boton-eliminar"
                    type="button"
                    data-eliminar="${p.id}">
                🗑️ Eliminar
            </button>
        </article>
    `).join("");
}

productosDOM.addEventListener("click", event => {
    const boton = event.target.closest("[data-agregar]");

    if (boton) {
        agregarProducto(Number(boton.dataset.agregar));
    }
});

listaDOM.addEventListener("click", event => {
    const boton = event.target.closest("[data-eliminar]");

    if (!boton) return;

    carrito = carrito.filter(
        p => p.id !== Number(boton.dataset.eliminar)
    );

    guardarCarrito();
    renderLista();
});

buscador.addEventListener("input", renderProductos);
filtro.addEventListener("change", renderProductos);

document.getElementById("vaciarLista").addEventListener("click", () => {
    if (carrito.length === 0) return;

    if (confirm("¿Quieres vaciar tu lista de compras?")) {
        carrito = [];
        guardarCarrito();
        renderLista();
    }
});

document.getElementById("enviarWhatsApp").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Primero agrega productos a tu lista.");
        return;
    }

    const seleccionados = carrito.map(item => {
        const p = productos.find(producto => producto.id === item.id);

        return {
            ...p,
            cantidad: item.cantidad,
            subtotal: p.precio * item.cantidad
        };
    });

    const total = seleccionados.reduce(
        (suma, p) => suma + p.subtotal, 0
    );

    let mensaje = "¡Hola, Librería El Saber! 📚✨\n\n";
    mensaje += "Quiero consultar esta lista de compras:\n\n";

    seleccionados.forEach(p => {
        mensaje += `📌 ${p.nombre}\n`;
        mensaje += `Cantidad: ${p.cantidad}\n`;
        mensaje += `Subtotal: ${dinero.format(p.subtotal)}\n\n`;
    });

    mensaje += `TOTAL ESTIMADO: ${dinero.format(total)}\n\n`;
    mensaje += "¿Me confirman disponibilidad y precios? ¡Gracias! 💜";

    const url = "https://wa.me/" + WHATSAPP +
        "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank");
});

renderProductos();
renderLista();