# Sesiones

Este proyecto contiene un ejemplo básico de inicio de sesión utilizando Node.js, sesiones y MongoDB. Incluye una página de login desarrollada con Bootstrap y una página de bienvenida tras la autenticación.

## Estructura

- `server.js` – servidor Express con manejo de sesiones almacenadas en MongoDB.
- `public/login.html` – formulario de inicio de sesión.
- `public/store.html` – tienda de juegos mostrada tras autenticarse.
- `public/store.js` y `public/styles.css` – lógica y estilos de la tienda
- `public/index.html` – tienda de juegos mostrada tras autenticarse.
- `public/store.js` y `public/styles.css` – lógica y estilos de la tienda.
- `public/welcome.html` – página mostrada al iniciar sesión correctamente.


## Uso

1. Instalar las dependencias (`npm install`).
2. Asegurar que MongoDB esté disponible en `mongodb://localhost:27017/Sesiones` o ajustar la variable `MONGO_URI`.
3. Crear un usuario en la colección `users` con los campos `username` y `password`.
4. Ejecutar el servidor con `npm start` y abrir `http://localhost:3000/` en el navegador. Se mostrará la pantalla de inicio de sesión y, tras autenticarse, se redirigirá a `/store`.
