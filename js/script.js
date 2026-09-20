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
// 1.5 AUTENTICACIÓN Y LOGIN
// ---------------------------------------------------------

// Referencias a elementos del formulario de autenticación
const authModal = document.getElementById("auth-modal");
const authOverlay = document.getElementById("auth-overlay");
const closeAuthBtn = document.getElementById("close-auth");
const openAuthBtn = document.getElementById("open-auth-btn");
const logoNormal = document.getElementById("logo-normal");
const logoMenuContainer = document.getElementById("logo-menu-container");
const logoMenuBtn = document.getElementById("logo-menu-btn");
const logoMenu = document.getElementById("logo-menu");
const navNormal = document.getElementById("nav-normal");
const userMenuContainer = document.getElementById("user-menu-container");
const userMenuBtn = document.getElementById("user-menu-btn");
const userMenuName = document.getElementById("user-menu-name");
const userMenu = document.getElementById("user-menu");
const userThemeToggle = document.getElementById("user-theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const userConfig = document.getElementById("user-config");
const userLogout = document.getElementById("user-logout");
const configForm = document.getElementById("config-form");
const configNombre = document.getElementById("config-nombre");
const configEmail = document.getElementById("config-email");
const configPassword = document.getElementById("config-password");
const configTelefono = document.getElementById("config-telefono");
const configCiudad = document.getElementById("config-ciudad");
const configTipoUsuario = document.getElementById("config-tipo-usuario");
const cartToggle = document.getElementById("cart-toggle");
const cartCount = document.getElementById("cart-count");
const userWelcomeMessage = document.getElementById("user-welcome-message");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authSuccess = document.getElementById("auth-success");
const toggleRegisterBtn = document.getElementById("toggle-register");
const toggleLoginBtn = document.getElementById("toggle-login");
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");
const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");
const btnContinue = document.getElementById("btn-continue");
const successMessage = document.getElementById("success-message");
const adminPanel = document.getElementById("admin-panel");
const adminUserForm = document.getElementById("admin-user-form");
const adminUserId = document.getElementById("admin-user-id");
const adminNombre = document.getElementById("admin-nombre");
const adminEmail = document.getElementById("admin-email");
const adminPassword = document.getElementById("admin-password");
const adminTelefono = document.getElementById("admin-telefono");
const adminCiudad = document.getElementById("admin-ciudad");
const adminFechaNacimiento = document.getElementById("admin-fecha-nacimiento");
const adminTipoUsuario = document.getElementById("admin-tipo-usuario");
const adminUsersBody = document.getElementById("admin-users-body");
const adminCancelEdit = document.getElementById("admin-cancel-edit");
const adminResetForm = document.getElementById("admin-reset-form");
const adminSubmitBtn = document.getElementById("admin-submit-btn");
const adminMenuLink = document.getElementById("admin-menu-link");
let usuarioEnEdicionId = null;

// Función para cambiar entre formulario de login y registro
function mostrarLogin() {
  if (loginForm) loginForm.classList.add("active");
  if (registerForm) registerForm.classList.remove("active");
  if (loginForm) loginForm.classList.remove("hidden");
  if (registerForm) registerForm.classList.add("hidden");
  if (authSuccess) authSuccess.classList.add("hidden");
  if (loginError) loginError.classList.add("hidden");
  if (registerError) registerError.classList.add("hidden");
}

function mostrarRegistro() {
  if (registerForm) registerForm.classList.add("active");
  if (loginForm) loginForm.classList.remove("active");
  if (registerForm) registerForm.classList.remove("hidden");
  if (loginForm) loginForm.classList.add("hidden");
  if (authSuccess) authSuccess.classList.add("hidden");
  if (loginError) loginError.classList.add("hidden");
  if (registerError) registerError.classList.add("hidden");
}

function mostrarExito(mensaje) {
  authSuccess.classList.remove("hidden");
  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  successMessage.textContent = mensaje;
}

function cerrarAuthModal() {
  authModal.classList.add("hidden");
  mostrarLogin();
  // Limpiar formularios
  formLogin.reset();
  formRegister.reset();
}

// -----------------------------------------------------------
// Último inicio de sesión (para el mensaje de bienvenida)
// Se guarda en localStorage por correo, así que persiste
// aunque se recargue la página o se cierre el navegador.
// -----------------------------------------------------------
function obtenerUltimoLogin(email) {
  return localStorage.getItem(`ultimoLogin_${email}`);
}

function guardarUltimoLogin(email) {
  localStorage.setItem(`ultimoLogin_${email}`, new Date().toISOString());
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return null;
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
}

// Arma y muestra/oculta el mensaje "Bienvenido, X · Último ingreso: ..."
function actualizarMensajeBienvenida() {
  if (!userWelcomeMessage) return;

  if (usuarioActivo) {
    const fechaAnterior = formatearFecha(usuarioActivo.ultimoLoginAnterior);
    userWelcomeMessage.innerHTML = fechaAnterior
      ? `Bienvenido, <strong>${usuarioActivo.nombre}</strong> · Último ingreso: ${fechaAnterior}`
      : `Bienvenido, <strong>${usuarioActivo.nombre}</strong> · Este es tu primer ingreso`;
    userWelcomeMessage.classList.remove("hidden");
  } else {
    userWelcomeMessage.classList.add("hidden");
    userWelcomeMessage.textContent = "";
  }
}

// Función para actualizar la UI de autenticación
function actualizarUIAutenticacion() {
  const esPaginaAdmin = window.location.pathname.endsWith("admin.html");

  if (usuarioActivo) {
    if (userMenuName) userMenuName.textContent = usuarioActivo.nombre;
    if (openAuthBtn) openAuthBtn.classList.add("hidden");
    if (userMenuContainer) userMenuContainer.classList.remove("hidden");
    if (cartToggle && !esPaginaAdmin) cartToggle.classList.remove("hidden");

    if (!esPaginaAdmin) {
      if (logoNormal) logoNormal.classList.add("hidden");
      if (navNormal) navNormal.classList.add("hidden");
      if (logoMenuContainer) logoMenuContainer.classList.remove("hidden");
      if (logoMenu) logoMenu.classList.add("hidden");
    }
  } else {
    if (openAuthBtn) openAuthBtn.classList.remove("hidden");
    if (userMenuContainer) userMenuContainer.classList.add("hidden");
    if (cartToggle) cartToggle.classList.add("hidden");

    if (!esPaginaAdmin) {
      if (logoNormal) logoNormal.classList.remove("hidden");
      if (navNormal) navNormal.classList.remove("hidden");
      if (logoMenuContainer) logoMenuContainer.classList.add("hidden");
      if (logoMenu) logoMenu.classList.add("hidden");
    }
  }

  actualizarMensajeBienvenida();
  actualizarPanelAdmin();

  if (adminMenuLink) {
    adminMenuLink.classList.toggle("hidden", !esAdministrador(usuarioActivo));
  }
}

// Función de logout
function cerrarSesion() {
  usuarioActivo = null;
  localStorage.removeItem("usuarioActivo");
  actualizarUIAutenticacion();
  userMenu.classList.add("hidden"); // Cerrar el menú
  restablecerFormularioAdmin();
  Swal.fire({
    title: "Sesión cerrada",
    text: "Tu sesión ha sido cerrada exitosamente.",
    icon: "info",
    confirmButtonText: "Aceptar"
  });
}

if (userLogout) userLogout.addEventListener("click", cerrarSesion);

// Eventos del menú del usuario
if (userMenuBtn) userMenuBtn.addEventListener("click", () => {
  if (userMenu) userMenu.classList.toggle("hidden");
});

if (userConfig) userConfig.addEventListener("click", () => {
  if (userMenu) userMenu.classList.add("hidden");
  window.location.href = "configuracion.html";
});

if (adminMenuLink) {
  adminMenuLink.addEventListener("click", (event) => {
    if (!usuarioActivo || !esAdministrador(usuarioActivo)) {
      event.preventDefault();
      Swal.fire({
        title: "Acceso restringido",
        text: "Solo un usuario administrador puede entrar aquí.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  });
}

// Evento de toggle entre login y registro
if (toggleRegisterBtn) toggleRegisterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  mostrarRegistro();
});

if (toggleLoginBtn) toggleLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  mostrarLogin();
});

if (closeAuthBtn) closeAuthBtn.addEventListener("click", cerrarAuthModal);
if (authOverlay) authOverlay.addEventListener("click", cerrarAuthModal);

// Función para calcular la edad a partir de la fecha de nacimiento
// (se define aquí, antes de login y registro, porque ambos la usan)
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();
  
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
}

function esAdministrador(usuario) {
  return !!usuario && String(usuario.tipo_usuario || usuario.rol || "Cliente") === "Administrador";
}

function guardarUsuariosEnStorage() {
  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));
}

function restaurarUsuariosDesdeStorage() {
  const usuariosGuardados = localStorage.getItem("usuariosRegistrados");

  if (!usuariosGuardados) {
    guardarUsuariosEnStorage();
    return;
  }

  try {
    const datos = JSON.parse(usuariosGuardados);
    if (Array.isArray(datos) && datos.length) {
      usuariosRegistrados.length = 0;
      datos.forEach((usuario) => usuariosRegistrados.push(usuario));
    }
  } catch (error) {
    console.warn("No se pudieron restaurar los usuarios guardados.", error);
  }
}

function restablecerFormularioAdmin() {
  usuarioEnEdicionId = null;
  if (adminUserId) adminUserId.value = "";
  if (adminNombre) adminNombre.value = "";
  if (adminEmail) adminEmail.value = "";
  if (adminPassword) adminPassword.value = "";
  if (adminTelefono) adminTelefono.value = "";
  if (adminCiudad) adminCiudad.value = "";
  if (adminFechaNacimiento) adminFechaNacimiento.value = "";
  if (adminTipoUsuario) adminTipoUsuario.value = "Cliente";
  if (adminCancelEdit) adminCancelEdit.classList.add("hidden");
  if (adminSubmitBtn) adminSubmitBtn.textContent = "Guardar usuario";
}

function actualizarFormularioConfiguracion() {
  if (!configForm || !usuarioActivo) return;

  if (configNombre) configNombre.value = usuarioActivo.nombre || "";
  if (configEmail) configEmail.value = usuarioActivo.email || "";
  if (configTelefono) configTelefono.value = usuarioActivo.telefono || "";
  if (configCiudad) configCiudad.value = usuarioActivo.ciudad || "";
  if (configTipoUsuario) configTipoUsuario.value = usuarioActivo.tipo_usuario || "Cliente";
  if (configPassword) configPassword.value = usuarioActivo.password || "";
}

if (configForm) {
  configForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!usuarioActivo) {
      window.location.href = "index.html";
      return;
    }

    const nombre = (configNombre?.value || "").trim();
    const email = (configEmail?.value || "").trim().toLowerCase();
    const password = (configPassword?.value || "").trim();
    const telefono = (configTelefono?.value || "").trim();
    const ciudad = (configCiudad?.value || "").trim();

    if (!nombre || !email) {
      Swal.fire({
        title: "Datos incompletos",
        text: "Nombre y correo son obligatorios.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    if (password && password.length < 6) {
      Swal.fire({
        title: "Contraseña inválida",
        text: "La contraseña debe tener al menos 6 caracteres.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    const emailDuplicado = usuariosRegistrados.find(
      (usuario) => usuario.email.toLowerCase() === email && usuario.id !== usuarioActivo.id
    );

    if (emailDuplicado) {
      Swal.fire({
        title: "Correo duplicado",
        text: "Ya existe otro usuario con ese correo.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    const usuarioActualizado = usuariosRegistrados.find((usuario) => usuario.id === usuarioActivo.id);
    if (!usuarioActualizado) return;

    usuarioActualizado.nombre = nombre;
    usuarioActualizado.email = email;
    usuarioActualizado.telefono = telefono;
    usuarioActualizado.ciudad = ciudad;
    usuarioActualizado.tipo_usuario = configTipoUsuario?.value || usuarioActualizado.tipo_usuario || "Cliente";
    if (password) usuarioActualizado.password = password;

    usuarioActivo = { ...usuarioActivo, ...usuarioActualizado };
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
    guardarUsuariosEnStorage();

    Swal.fire({
      title: "Configuración guardada",
      text: "Tu perfil se actualizó correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar"
    });
  });
}

function renderizarUsuariosAdmin() {
  if (!adminUsersBody) return;

  const esAdmin = !!(usuarioActivo && esAdministrador(usuarioActivo));
  if (!esAdmin && window.location.pathname.endsWith("admin.html")) {
    adminUsersBody.innerHTML = "";
    return;
  }

  if (!usuariosRegistrados.length) {
    adminUsersBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--texto-claro); padding: 24px;">No hay usuarios registrados.</td>
      </tr>
    `;
    return;
  }

  adminUsersBody.innerHTML = usuariosRegistrados.map((usuario) => `
    <tr>
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.email}</td>
      <td>${usuario.tipo_usuario || "Cliente"}</td>
      <td>${usuario.ciudad || "—"}</td>
      <td>
        <div class="admin-user-actions">
          <button type="button" class="edit-btn" data-admin-action="edit" data-user-id="${usuario.id}">Editar</button>
          <button type="button" class="delete-btn" data-admin-action="delete" data-user-id="${usuario.id}">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join("");
}

function actualizarPanelAdmin() {
  if (!adminPanel) return;

  const puedeVerPanel = !!(usuarioActivo && esAdministrador(usuarioActivo));
  adminPanel.classList.toggle("hidden", !puedeVerPanel);

  if (puedeVerPanel) {
    renderizarUsuariosAdmin();
  }
}

if (adminResetForm) {
  adminResetForm.addEventListener("click", () => {
    restablecerFormularioAdmin();
    if (adminNombre) adminNombre.focus();
  });
}

if (adminCancelEdit) {
  adminCancelEdit.addEventListener("click", () => {
    restablecerFormularioAdmin();
  });
}

if (adminUserForm) {
  adminUserForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = (adminNombre?.value || "").trim();
    const email = (adminEmail?.value || "").trim().toLowerCase();
    const password = (adminPassword?.value || "").trim();
    const telefono = (adminTelefono?.value || "").trim();
    const ciudad = (adminCiudad?.value || "").trim();
    const fechaNacimiento = adminFechaNacimiento?.value || "";
    const tipoUsuario = adminTipoUsuario?.value || "Cliente";

    if (!nombre || !email || !fechaNacimiento) {
      Swal.fire({
        title: "Faltan datos",
        text: "Completa nombre, correo y fecha de nacimiento antes de guardar.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    if (!usuarioEnEdicionId && !password) {
      Swal.fire({
        title: "Contraseña requerida",
        text: "La contraseña es obligatoria para crear un nuevo usuario.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    if (password && password.length < 6) {
      Swal.fire({
        title: "Contraseña inválida",
        text: "La contraseña debe tener al menos 6 caracteres.",
        icon: "warning",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    const emailDuplicado = usuariosRegistrados.find(
      (usuario) => usuario.email.toLowerCase() === email && usuario.id !== usuarioEnEdicionId
    );

    if (emailDuplicado) {
      Swal.fire({
        title: "Correo duplicado",
        text: "Este correo ya existe en la lista de usuarios.",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
      return;
    }

    if (usuarioEnEdicionId) {
      const usuarioEditar = usuariosRegistrados.find((usuario) => usuario.id === Number(usuarioEnEdicionId));
      if (!usuarioEditar) return;

      usuarioEditar.nombre = nombre;
      usuarioEditar.email = email;
      usuarioEditar.telefono = telefono;
      usuarioEditar.ciudad = ciudad;
      usuarioEditar.fechaNacimiento = fechaNacimiento;
      usuarioEditar.tipo_usuario = tipoUsuario;

      if (password) {
        usuarioEditar.password = password;
      }

      if (usuarioActivo && usuarioActivo.id === usuarioEditar.id) {
        usuarioActivo = { ...usuarioActivo, ...usuarioEditar };
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
      }
    } else {
      const nuevoUsuario = {
        id: usuariosRegistrados.length ? Math.max(...usuariosRegistrados.map((usuario) => usuario.id)) + 1 : 1,
        nombre,
        email,
        password,
        telefono,
        ciudad,
        fechaNacimiento,
        tipo_usuario: tipoUsuario,
        edad: calcularEdad(fechaNacimiento)
      };

      usuariosRegistrados.push(nuevoUsuario);
    }

    guardarUsuariosEnStorage();
    renderizarUsuariosAdmin();
    restablecerFormularioAdmin();

    Swal.fire({
      title: "Usuario guardado",
      text: "Los cambios se actualizaron correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar"
    });
  });
}

if (adminUsersBody) {
  adminUsersBody.addEventListener("click", (event) => {
    const boton = event.target.closest("button[data-admin-action]");
    if (!boton) return;

    const accion = boton.dataset.adminAction;
    const userId = Number(boton.dataset.userId);
    const usuarioSeleccionado = usuariosRegistrados.find((usuario) => usuario.id === userId);

    if (!usuarioSeleccionado) return;

    if (accion === "edit") {
      usuarioEnEdicionId = userId;
      if (adminUserId) adminUserId.value = String(userId);
      if (adminNombre) adminNombre.value = usuarioSeleccionado.nombre || "";
      if (adminEmail) adminEmail.value = usuarioSeleccionado.email || "";
      if (adminPassword) adminPassword.value = usuarioSeleccionado.password || "";
      if (adminTelefono) adminTelefono.value = usuarioSeleccionado.telefono || "";
      if (adminCiudad) adminCiudad.value = usuarioSeleccionado.ciudad || "";
      if (adminFechaNacimiento) adminFechaNacimiento.value = usuarioSeleccionado.fechaNacimiento || "";
      if (adminTipoUsuario) adminTipoUsuario.value = usuarioSeleccionado.tipo_usuario || "Cliente";
      if (adminCancelEdit) adminCancelEdit.classList.remove("hidden");
      if (adminSubmitBtn) adminSubmitBtn.textContent = "Actualizar usuario";
      adminNombre.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (accion === "delete") {
      if (usuarioActivo && usuarioActivo.id === userId) {
        Swal.fire({
          title: "Acción no permitida",
          text: "No puedes eliminar tu propia cuenta desde el panel administrativo.",
          icon: "info",
          confirmButtonText: "Aceptar"
        });
        return;
      }

      Swal.fire({
        title: "¿Eliminar usuario?",
        text: `Se va a quitar a ${usuarioSeleccionado.nombre} de la lista de usuarios.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then((resultado) => {
        if (!resultado.isConfirmed) return;

        const indice = usuariosRegistrados.findIndex((usuario) => usuario.id === userId);
        if (indice !== -1) {
          usuariosRegistrados.splice(indice, 1);
          guardarUsuariosEnStorage();
          renderizarUsuariosAdmin();
        }
      });
    }
  });
}

// Función de LOGIN
if (formLogin) formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (loginError) loginError.classList.add("hidden");

  const usuarioEncontrado = usuariosRegistrados.find(
    u => u.email === email && u.password === password
  );

  if (usuarioEncontrado) {
    if (!usuarioEncontrado.fechaNacimiento) {
      if (loginError) {
        loginError.textContent = "❌ No se pudo verificar tu edad. Contacta al soporte.";
        loginError.classList.remove("hidden");
      }
      return;
    }

    const edadActual = calcularEdad(usuarioEncontrado.fechaNacimiento);

    if (edadActual < 18) {
      if (loginError) {
        loginError.textContent = "❌ Acceso denegado. Debes ser mayor de 18 años para ingresar a esta página.";
        loginError.classList.remove("hidden");
      }
      return;
    }

    const loginAnterior = obtenerUltimoLogin(usuarioEncontrado.email);
    guardarUltimoLogin(usuarioEncontrado.email);
    usuarioEncontrado.ultimoLoginAnterior = loginAnterior;
    usuarioEncontrado.tipo_usuario = usuarioEncontrado.tipo_usuario || "Cliente";

    usuarioActivo = usuarioEncontrado;
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
    actualizarUIAutenticacion();

    mostrarExito(`¡Bienvenido, ${usuarioEncontrado.nombre}! Tu sesión se ha iniciado correctamente.`);

    setTimeout(() => {
      cerrarAuthModal();
    }, 2000);
  } else {
    if (loginError) {
      loginError.textContent = "❌ Correo o contraseña incorrectos. Intenta de nuevo.";
      loginError.classList.remove("hidden");
    }
  }
});

// Función de REGISTRO
if (formRegister) formRegister.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("register-nombre").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value;
  const passwordConfirm = document.getElementById("register-password-confirm").value;
  const telefono = document.getElementById("register-telefono").value.trim();
  const ciudad = document.getElementById("register-ciudad").value.trim();
  const fechaNacimiento = document.getElementById("register-fecha-nacimiento").value;

  if (registerError) registerError.classList.add("hidden");

  if (password !== passwordConfirm) {
    if (registerError) {
      registerError.textContent = "❌ Las contraseñas no coinciden.";
      registerError.classList.remove("hidden");
    }
    return;
  }

  if (password.length < 6) {
    if (registerError) {
      registerError.textContent = "❌ La contraseña debe tener al menos 6 caracteres.";
      registerError.classList.remove("hidden");
    }
    return;
  }

  if (!fechaNacimiento) {
    if (registerError) {
      registerError.textContent = "❌ Debes proporcionar tu fecha de nacimiento.";
      registerError.classList.remove("hidden");
    }
    return;
  }

  const edad = calcularEdad(fechaNacimiento);
  if (edad < 18) {
    if (registerError) {
      registerError.textContent = `❌ Debes ser mayor de 18 años. Tienes ${edad} años.`;
      registerError.classList.remove("hidden");
    }
    return;
  }

  const emailExistente = usuariosRegistrados.find(u => u.email === email);

  if (emailExistente) {
    if (registerError) {
      registerError.textContent = "❌ Este correo electrónico ya está registrado.";
      registerError.classList.remove("hidden");
    }
    return;
  }

  const nuevoUsuario = {
    id: usuariosRegistrados.length + 1,
    nombre,
    email,
    password,
    telefono,
    ciudad,
    fechaNacimiento,
    edad,
    tipo_usuario: "Cliente"
  };

  guardarUsuariosEnStorage();

  usuariosRegistrados.push(nuevoUsuario);

  mostrarExito(`¡Cuenta creada exitosamente, ${nombre}! 🎉\n\nAhora por favor inicia sesión con tus credenciales.`);
  formRegister.reset();

  setTimeout(() => {
    cerrarAuthModal();
  }, 3000);
});

// Botón continuar en mensaje de éxito
if (btnContinue) btnContinue.addEventListener("click", cerrarAuthModal);

// Función para abrir el modal de autenticación
function abrirAuthModal() {
  if (authModal) authModal.classList.remove("hidden");
  mostrarLogin(); // por defecto mostrar login
}

// Botón para abrir el modal de login
if (openAuthBtn) openAuthBtn.addEventListener("click", abrirAuthModal);

// Eventos del menú dropdown del logo (cuando hay sesión)
if (logoMenuBtn) logoMenuBtn.addEventListener("click", () => {
  if (logoMenu) logoMenu.classList.toggle("hidden");
  if (userMenu) userMenu.classList.add("hidden"); // Cerrar menú de usuario si estaba abierto
});

// Cerrar menú del logo cuando se hace clic en una opción
document.querySelectorAll(".logo-menu-item").forEach(item => {
  item.addEventListener("click", () => {
    if (logoMenu) logoMenu.classList.add("hidden");
  });
});

// Cerrar menús cuando se hace clic fuera
document.addEventListener("click", (e) => {
  // Cerrar menú del logo
  if (logoMenuContainer && logoMenu && !logoMenuContainer.contains(e.target) && !logoMenu.classList.contains("hidden")) {
    logoMenu.classList.add("hidden");
  }
  // Cerrar menú del usuario
  if (userMenuContainer && userMenu && !userMenuContainer.contains(e.target) && !userMenu.classList.contains("hidden")) {
    userMenu.classList.add("hidden");
  }
});

// -----------------------------------------------------------
// Verificar si hay usuario activo al cargar la página.
// IMPORTANTE: no confiamos ciegamente en lo guardado en
// localStorage. Volvemos a calcular la edad a partir de la
// fecha de nacimiento; si por cualquier motivo la persona
// resulta ser menor de 18 años (o falta el dato), se cierra
// la sesión automáticamente y nunca se restaura.
// -----------------------------------------------------------
const usuarioGuardado = localStorage.getItem("usuarioActivo");
if (usuarioGuardado) {
  const usuarioParseado = JSON.parse(usuarioGuardado);
  const edadRestaurada = usuarioParseado.fechaNacimiento
    ? calcularEdad(usuarioParseado.fechaNacimiento)
    : -1; // -1 fuerza el bloqueo si no hay fecha de nacimiento

  if (edadRestaurada >= 18) {
    usuarioActivo = usuarioParseado;
  } else {
    localStorage.removeItem("usuarioActivo");
    usuarioActivo = null;
  }
}

if (window.location.pathname.endsWith("admin.html") && (!usuarioActivo || !esAdministrador(usuarioActivo))) {
  window.location.href = "index.html";
}

if (window.location.pathname.endsWith("configuracion.html") && !usuarioActivo) {
  window.location.href = "index.html";
}

restaurarUsuariosDesdeStorage();

if (adminUsersBody) {
  renderizarUsuariosAdmin();
}

if (window.location.pathname.endsWith("configuracion.html")) {
  actualizarFormularioConfiguracion();
}

// Actualizar la UI basada en si hay usuario logeado
actualizarUIAutenticacion();

// El modal de login NO se abre automáticamente
// Solo se abre cuando el usuario hace clic en el botón "Iniciar Sesión"

// ---------------------------------------------------------
// 2. REFERENCIAS A ELEMENTOS DEL HTML
// Guardamos en variables los elementos que vamos a usar
// varias veces, para no tener que buscarlos cada vez.
// ---------------------------------------------------------
const productosGrid = document.getElementById("productos-grid");
const filtroBotones = document.querySelectorAll(".filtro-btn");

const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
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

  if (userThemeToggle) {
    const esTemaOscuro = theme === "dark";
    const textoTema = esTemaOscuro ? "Modo claro" : "Modo oscuro";
    const iconoTema = esTemaOscuro ? "☀️" : "🌙";
    userThemeToggle.innerHTML = `<span id="theme-icon">${iconoTema}</span> ${textoTema}`;
  }

  localStorage.setItem("theme", theme);
}

const temaGuardado = localStorage.getItem("theme");
const temaInicial = temaGuardado || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

aplicarTema(temaInicial);

// Evento para cambiar tema desde el menú del usuario
if (userThemeToggle) {
  userThemeToggle.addEventListener("click", () => {
    const nuevoTema = document.body.dataset.theme === "dark" ? "light" : "dark";
    aplicarTema(nuevoTema);
  });
}


// ---------------------------------------------------------
// 4. RENDERIZAR EL CATÁLOGO DE PRODUCTOS
// Esta función recibe una lista de productos y crea
// dinámicamente el HTML de cada "tarjeta" (card).
// ---------------------------------------------------------
function renderizarProductos(listaProductos) {
  if (!productosGrid) return; // Si no existe el elemento, salir
  
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

// Mostramos todos los productos al cargar la página (solo si existe el elemento)
if (productosGrid) {
  renderizarProductos(productos);
}


// ---------------------------------------------------------
// 5. FILTROS POR CATEGORÍA
// ---------------------------------------------------------
if (filtroBotones.length > 0) {
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
}


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
  if (!cartItemsContainer) return; // Si no existe el elemento, salir
  
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

  if (cartCount) cartCount.textContent = totalUnidades;
  if (cartTotal) cartTotal.textContent = `$${totalPrecio.toLocaleString("es-CO")}`;
}

// Abrir / cerrar el panel del carrito
function abrirCarrito() {
  if (cartPanel) {
    cartPanel.classList.add("abierto");
  }
  if (cartOverlay) {
    cartOverlay.classList.remove("hidden");
  }
}
function cerrarCarrito() {
  if (cartPanel) {
    cartPanel.classList.remove("abierto");
  }
  if (cartOverlay) {
    cartOverlay.classList.add("hidden");
  }
}

// Asignar eventos solo si los elementos existen
if (cartToggle) cartToggle.addEventListener("click", abrirCarrito);
if (cartClose) cartClose.addEventListener("click", cerrarCarrito);
if (cartOverlay) cartOverlay.addEventListener("click", cerrarCarrito);
if (confirmDeleteCancel) confirmDeleteCancel.addEventListener("click", cerrarConfirmacionEliminar);
if (confirmDeleteOk) confirmDeleteOk.addEventListener("click", () => {
  if (productoAEliminarId !== null) {
    quitarDelCarrito(productoAEliminarId);
  }
});

// Botón "Finalizar compra" (aquí solo mostramos una alerta de ejemplo,
// en un proyecto real esto llevaría a una pasarela de pago)
if (cartCheckout) {
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
}


// ---------------------------------------------------------
// 7. FORMULARIO DE CONTACTO
// ---------------------------------------------------------
if (formContacto) {
  formContacto.addEventListener("submit", (evento) => {
    evento.preventDefault(); // evita que la página se recargue al enviar el formulario

    // Mostramos un mensaje de confirmación simple
    if (formConfirmacion) {
      formConfirmacion.textContent = "¡Gracias! Tu mensaje fue enviado (simulación).";
      formConfirmacion.classList.remove("hidden");
    }

    formContacto.reset(); // limpiamos los campos del formulario
  });
}