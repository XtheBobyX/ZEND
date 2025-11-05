# ZEND

**Zend** es una aplicación de microblogging moderna que permite a los usuarios compartir y descubrir contenido en tiempo real. Los usuarios pueden publicar texto, imágenes, emojis y encuestas, así como interactuar mediante "likes", comentarios, re-posts, guardados y compartidos. Además cuenta con un sistema de seguimiento de usuarios y un timeline en vivo.

![foto home](https://res.cloudinary.com/dcauxh61z/image/upload/v1762383348/home.png)
![foto perfil](https://res.cloudinary.com/dcauxh61z/image/upload/v1762383349/perfil.png)
![foto explorar](https://res.cloudinary.com/dcauxh61z/image/upload/v1762383348/explorar.png)
![foto mensaje](https://res.cloudinary.com/dcauxh61z/image/upload/v1762383347/mensaje.png)

# Tabla de Contenidos

[✨ Características](#-características)

[🛠️ Tecnologías](#️-tecnologías)

[⚙️ Instalación](#️-instalación-local)

[⚙️ Variables de Entorno](#variables-de-entorno)

[📁 Estructura del Proyecto](#estructura-del-proyecto)

[🚀 Despliegue](#-despliegue)

[🧩 Futuras Mejoras](#-futuras-mejoras)

---

## ✨ Características

- 🔐 Autenticación completa: Registro e inicio de sesión con JWT.
- 📝 CRUD de publicaciones: Crear, editar, eliminar y listar posts.
- 💬 Interacciones sociales: Likes, comentarios, re-posts, guardados y compartidos.
- 🧵 Feed en tiempo real: Actualización dinámica mediante Socket.IO.
- 👤 Perfiles personalizados: Avatar, portada y biografía de usuario.
- 👥 Sistema de seguidores: Ver y seguir a otros usuarios.
- 🌐 API RESTful: Separación clara entre frontend y backend.
- 📱 Interfaz moderna: Construida con React, TypeScript y TailwindCSS.
- 💾 Base de datos relacional: Gestión eficiente de datos con MySQL y Sequelize.

---

## 🛠️ Tecnologías

### Frontend

⚛️ React + TypeScript

🧭 React Router

🎨 Tailwind CSS

### Backend

🟢 Node.js + TypeScript

🚀 Express

🗄️ MySQL + Sequelize ORM

🔐 JSON Web Tokens (JWT)

⚡ Socket.IO (tiempo real)

---

## 🚀 Despliegue

https://zendv2.vercel.app

## ⚙️ Instalación (Local)

Clona el repositorio y configura el entorno:

```bash
git clone https://github.com/XtheBobyX/ZEND
cd zend

```

### Backend

```bash

cd backend
npm install
npm run dev
```

### Frontend

crea un archivo .env.local en /frontend

```bash
VITE_API_URL = 'http://localhost:3000'
```

```bash

cd frontend
npm install
npm run dev
```

## Variables de entorno

crea un archivo .env en /backend

```bash

DB_NAME=zend
DB_USER=root
DB_PASS=root
DB_HOST=localhost
SECRET_KEY=your_secret_key
PORT=3000
DB_PORT=3306
CLOUDINARY_NAME="<cloud_name>"
CLOUDINARY_APIKEY="<api_key>"
CLOUDINARY_APISECRET="<api_secret>"

```

## Estructura del Proyecto

```text
zend/
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── App.tsx
│ └── index.html
│
└── backend/
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── server.ts
```

# 🧩 Futuras Mejoras

Aquí algunas ideas de evolución del proyecto:

🔔 Notificaciones en tiempo real

🧑‍💼 Panel de administración

🎥 Soporte para video/audio

🔄 Scroll infinito y paginación

🌙 Modo oscuro personalizable

# 📄 Licencia

Este proyecto está bajo la licencia MIT.
