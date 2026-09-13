/* =========================================================
   PROYECTO: Tienda de Cannabis (educativo)
   Este archivo contiene TODA la lógica de la página:
   - Verificación de edad
   - Renderizado del catálogo de productos
   - Filtros por categoría
   - Carrito de compras (agregar, quitar, total)
   - Formulario de contacto
   Está comentado paso a paso para que sea fácil de seguir
   si estás empezando a programar.
========================================================= */

// ---------------------------------------------------------
// 1. DATOS: lista de productos
// En un proyecto real esto vendría de una base de datos,
// pero aquí usamos un simple arreglo (array) de objetos.
// ---------------------------------------------------------
const productos = [
  {
    id: 1,
    nombre: "Gorila glue exotic 15g",
    categoria: "flores",
    precio: 45000,
    emoji: "🌿",
    descripcion: "Flor de Gorila glue con sabor cítrico, ideal para relajarse y creatividad."
  },
  {
    id: 2,
    nombre: "Flor Purple Kush",
    categoria: "flores",
    precio: 52000,
    emoji: "🌱",
    descripcion: "Variedad índica de efecto relajante y sabor dulce con esencia a naranja."
  },
  {
    id: 3,
    nombre: "Aceite CBD 15%",
    categoria: "aceites THC",
    precio: 78000,
    emoji: "🧴",
    descripcion: "Aceite sublingual, ideal para uso diario con efectos psicorelajantes."
  },
  {
    id: 4,
    nombre: "Aceite Full Spectrum",
    categoria: "aceites",
    precio: 100000,
    emoji: "💧",
    descripcion: "Combina varios cannabinoides para un efecto más completo y retardado al cambio de estado con derivados de LSD."
  },
  {
    id: 5,
    nombre: "Gomitas de CBD",
    categoria: "comestibles",
    precio: 38000,
    emoji: "🍬",
    descripcion: "Paquete de 10 unidades, sabor frutal mango-fresa."
  },
  {
    id: 6,
    nombre: "Chocolate Infusionado",
    categoria: "comestibles",
    precio: 120000,
    emoji: "🍫",
    descripcion: "Barra de chocolate oscuro con dosis de 3.4g de hongos con derivados de THC, efecto retardado con un viaje instrospectivo y creativo."
  }
];

// El carrito empieza vacío. Cada elemento será un objeto
// { producto: {...}, cantidad: n }
let carrito = [];

// ---------------------------------------------------------
// 2. REFERENCIAS A ELEMENTOS DEL HTML
// Guardamos en variables los elementos que vamos a usar
// varias veces, para no tener que buscarlos cada vez.
// ---------------------------------------------------------
const ageModal = document.getElementById("age-modal");
const exitMessage = document.getElementById("exit-message");
const siteContent = document.getElementById("site-content");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");

const productosGrid = document.getElementById("productos-grid");
const filtroBotones = document.querySelectorAll(".filtro-btn");

const cartToggle = document.getElementById("cart-toggle");
const themeToggle = document.getElementById("theme-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartCheckout = document.getElementById("cart-checkout");

const formContacto = document.getElementById("form-contacto");
const formConfirmacion = document.getElementById("form-confirmacion");
const toastContainer = document.getElementById("toast-container");
const confirmModal = document.getElementById("confirm-modal");
const confirmModalText = document.getElementById("confirm-modal-text");
const confirmDeleteCancel = document.getElementById("confirm-delete-cancel");
const confirmDeleteOk = document.getElementById("confirm-delete-ok");
const purchaseModal = document.getElementById("purchase-modal");
const purchaseModalOk = document.getElementById("purchase-modal-ok");
let productoAEliminarId = null;

function aplicarTema(theme) {
  document.body.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀️ Modo claro" : "🌙 Modo oscuro";
  localStorage.setItem("theme", theme);
}

const temaGuardado = localStorage.getItem("theme");
const temaInicial = temaGuardado || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

aplicarTema(temaInicial);

themeToggle.addEventListener("click", () => {
  const nuevoTema = document.body.dataset.theme === "dark" ? "light" : "dark";
  aplicarTema(nuevoTema);
});


// ---------------------------------------------------------
// 3. VERIFICACIÓN DE EDAD
// ---------------------------------------------------------

// Si el usuario confirma que es mayor de edad:
btnYes.addEventListener("click", () => {
  ageModal.classList.add("hidden");   // ocultamos el modal
  siteContent.classList.remove("hidden"); // mostramos la tienda
});

// Si el usuario indica que NO es mayor de edad:
btnNo.addEventListener("click", () => {
  ageModal.classList.add("hidden");
  exitMessage.classList.remove("hidden");
});


// ---------------------------------------------------------
// 4. RENDERIZAR EL CATÁLOGO DE PRODUCTOS
// Esta función recibe una lista de productos y crea
// dinámicamente el HTML de cada "tarjeta" (card).
// ---------------------------------------------------------
function renderizarProductos(listaProductos) {
  // Limpiamos el contenedor antes de volver a dibujar
  productosGrid.innerHTML = "";

  listaProductos.forEach((producto) => {
    // Creamos un div para cada producto
    const card = document.createElement("div");
    card.className = "producto-card";

    // Usamos "template strings" (comillas invertidas) para
    // insertar variables fácilmente dentro del HTML.
    card.innerHTML = `
      <div class="producto-card__imagen">${producto.emoji}</div>
      <p class="producto-card__categoria">${producto.categoria}</p>
      <h3>${producto.nombre}</h3>
      <p class="descripcion">${producto.descripcion}</p>
      <p class="producto-card__precio">$${producto.precio.toLocaleString("es-CO")}</p>
      <button class="btn btn--primary btn-agregar" data-id="${producto.id}">
        Agregar al carrito
      </button>
    `;

    productosGrid.appendChild(card);
  });

  // Como acabamos de crear los botones "Agregar al carrito"
  // dinámicamente, necesitamos volver a asignarles su evento.
  document.querySelectorAll(".btn-agregar").forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      const id = Number(evento.target.dataset.id); // dataset.id viene del atributo data-id

      boton.classList.remove("animado");
      void boton.offsetWidth; // fuerza reinicio de la animación
      boton.classList.add("animado");

      agregarAlCarrito(id);
    });
  });
}

// Mostramos todos los productos al cargar la página
renderizarProductos(productos);


// ---------------------------------------------------------
// 5. FILTROS POR CATEGORÍA
// ---------------------------------------------------------
filtroBotones.forEach((boton) => {
  boton.addEventListener("click", () => {
    // Quitamos la clase "activo" de todos los botones...
    filtroBotones.forEach((b) => b.classList.remove("activo"));
    // ...y se la ponemos solo al que se acaba de presionar
    boton.classList.add("activo");

    const categoria = boton.dataset.categoria;

    if (categoria === "todas") {
      renderizarProductos(productos);
    } else {
      const filtrados = productos.filter((p) => p.categoria === categoria);
      renderizarProductos(filtrados);
    }
  });
});


// ---------------------------------------------------------
// 6. CARRITO DE COMPRAS
// ---------------------------------------------------------

function agregarAlCarrito(id) {
  // Buscamos el producto completo a partir de su id
  const producto = productos.find((p) => p.id === id);

  // Revisamos si ese producto ya está en el carrito
  const itemExistente = carrito.find((item) => item.producto.id === id);

  if (itemExistente) {
    itemExistente.cantidad += 1; // si ya está, solo sumamos 1
  } else {
    carrito.push({ producto, cantidad: 1 }); // si no está, lo agregamos
  }

  actualizarCarrito();
  mostrarNotificacion(producto);
}

function mostrarNotificacion(producto) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div class="toast__content">
      <p>${producto.nombre} fue agregado al carrito.</p>
    </div>
    <button class="toast__btn" type="button">Ver carrito</button>
  `;

  const botonVerCarrito = toast.querySelector(".toast__btn");

  botonVerCarrito.addEventListener("click", () => {
    abrirCarrito();
    cerrarToast(toast);
  });

  toastContainer.appendChild(toast);

  setTimeout(() => {
    cerrarToast(toast);
  }, 3000);
}

function cerrarToast(toast) {
  if (!toast || !toast.parentNode) return;

  toast.classList.add("toast--closing");

  setTimeout(() => {
    toast.remove();
  }, 200);
}

function quitarDelCarrito(id) {
  // filter() crea un nuevo arreglo sin el elemento que coincide con el id
  carrito = carrito.filter((item) => item.producto.id !== id);
  actualizarCarrito();
  cerrarConfirmacionEliminar();
}

function mostrarConfirmacionEliminar(id) {
  const item = carrito.find((item) => item.producto.id === id);

  if (!item) return;

  productoAEliminarId = id;
  confirmModalText.textContent = `¿Estás seguro de que quieres eliminar "${item.producto.nombre}" del carrito?`;
  confirmModal.classList.remove("hidden");
}

function cerrarConfirmacionEliminar() {
  confirmModal.classList.add("hidden");
  productoAEliminarId = null;
}

// Esta función redibuja el panel del carrito cada vez que cambia
function actualizarCarrito() {
  // Si el carrito está vacío, mostramos el mensaje por defecto
  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
  } else {
    cartItemsContainer.innerHTML = ""; // limpiamos antes de redibujar

    carrito.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item__info">
          <h4>${item.producto.nombre}</h4>
          <span>Cantidad: ${item.cantidad} · $${(item.producto.precio * item.cantidad).toLocaleString("es-CO")}</span>
        </div>
        <button class="cart-item__quitar" data-id="${item.producto.id}">Quitar</button>
      `;
      cartItemsContainer.appendChild(div);
    });

    // Asignamos el evento a cada botón "Quitar" recién creado
    document.querySelectorAll(".cart-item__quitar").forEach((boton) => {
      boton.addEventListener("click", (evento) => {
        const id = Number(evento.target.dataset.id);
        mostrarConfirmacionEliminar(id);
      });
    });
  }

  // Calculamos el total de unidades y el total en dinero
  const totalUnidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const totalPrecio = carrito.reduce(
    (suma, item) => suma + item.producto.precio * item.cantidad,
    0
  );

  cartCount.textContent = totalUnidades;
  cartTotal.textContent = `$${totalPrecio.toLocaleString("es-CO")}`;
}

// Abrir / cerrar el panel del carrito
function abrirCarrito() {
  cartPanel.classList.add("abierto");
  cartOverlay.classList.remove("hidden");
}
function cerrarCarrito() {
  cartPanel.classList.remove("abierto");
  cartOverlay.classList.add("hidden");
}

cartToggle.addEventListener("click", abrirCarrito);
cartClose.addEventListener("click", cerrarCarrito);
cartOverlay.addEventListener("click", cerrarCarrito); // clic afuera también cierra
confirmDeleteCancel.addEventListener("click", cerrarConfirmacionEliminar);
confirmDeleteOk.addEventListener("click", () => {
  if (productoAEliminarId !== null) {
    quitarDelCarrito(productoAEliminarId);
  }
});

// Botón "Finalizar compra" (aquí solo mostramos una alerta de ejemplo,
// en un proyecto real esto llevaría a una pasarela de pago)
cartCheckout.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire({
      title: "Tu carrito está vacío",
      text: "Agrega algunos productos antes de finalizar tu compra.",
      icon: "warning",
      confirmButtonText: "Aceptar"
    });
    return;
  }

  Swal.fire({
    title: "¡Compra realizada!",
    text: "Gracias por tu compra. (Esto es una simulación de ejemplo).",
    icon: "success",
    confirmButtonText: "Aceptar"
  });

  carrito = [];
  actualizarCarrito();
  cerrarCarrito();
});


// ---------------------------------------------------------
// 7. FORMULARIO DE CONTACTO
// ---------------------------------------------------------
formContacto.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que la página se recargue al enviar el formulario

  // Mostramos un mensaje de confirmación simple
  formConfirmacion.textContent = "¡Gracias! Tu mensaje fue enviado (simulación).";
  formConfirmacion.classList.remove("hidden");

  formContacto.reset(); // limpiamos los campos del formulario
});
