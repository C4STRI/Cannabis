/* =========================================================
   DATOS DE USUARIOS DE PRUEBA
   Estos son usuarios de ejemplo para pruebas locales.
   Contraseñas están en texto plano (SOLO PARA PRUEBAS).

   NOTA: se agregó "fechaNacimiento" (formato YYYY-MM-DD)
   porque ahora el login vuelve a calcular la edad de la
   persona cada vez que inicia sesión. Si algún usuario no
   tiene "fechaNacimiento" o resulta ser menor de 18 años,
   el acceso se bloquea automáticamente sin importar que el
   correo y la contraseña sean correctos.
========================================================= */

const usuariosRegistrados = [
  {
    id: 1,
    nombre: "Ricardo Omcy",
    email: "ricardo@example.com",
    password: "password123",
    telefono: "123456789",
    ciudad: "La Habana",
    fechaNacimiento: "1990-05-14",
    tipo_usuario: "Administrador"
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    email: "juan@example.com",
    password: "password456",
    telefono: "987654321",
    ciudad: "Santiago",
    fechaNacimiento: "2000-01-20",
    tipo_usuario: "Cliente"
  },
  {
    id: 3,
    nombre: "María García",
    email: "maria@example.com",
    password: "password789",
    telefono: "555555555",
    ciudad: "Varadero",
    fechaNacimiento: "1985-11-02",
    tipo_usuario: "Cliente"
  },
  {
    id: 4,
    nombre: "Carlos López",
    email: "carlos@example.com",
    password: "pass1234",
    telefono: "777777777",
    ciudad: "Matanzas",
    fechaNacimiento: "1995-07-30",
    tipo_usuario: "Administrador"
  }
];

// Usuario actualmente autenticado
let usuarioActivo = null;