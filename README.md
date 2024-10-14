# Manos Expertas

**Manos Expertas** es una aplicación móvil desarrollada para el Banco de Alimentos de México. Su propósito es ayudar a los profesionistas que reciben apoyo del banco (como pintores, albañiles, plomeros, entre otros) a encontrar oportunidades laborales, conectándolos con el público en general. La app ofrece un catálogo de trabajadores, mostrando sus habilidades, calificaciones y permite a los usuarios reservar sus servicios.

## Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Instalación](#instalación)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Descripción del Proyecto

"Manos Expertas" tiene como objetivo ofrecer una plataforma accesible para que profesionistas muestren sus habilidades y se conecten con personas interesadas en sus servicios. La aplicación permite que los usuarios vean perfiles de trabajadores, lean reseñas y calificaciones, y reserven sus servicios directamente desde la app.

## Funcionalidades

- **Perfiles de Profesionistas**: Los perfiles son creados y dados de alta por el Banco de Alimentos mediante el uso de perfiles admin.
  - Nombre, apellido, profesión y descripción de sus habilidades.
  - Imágenes de sus trabajos anteriores.
  - Calificaciones y reseñas dejadas por otros usuarios.
  - Información de contacto.
- **Usuarios**: Los usuarios pueden buscar trabajadores en el catálogo, ver sus perfiles y reservar citas para recibir servicios.
- **Calificación y Reseñas**: Los usuarios pueden calificar y dejar reseñas una vez completado el trabajo.
- **Búsqueda y Filtrado**: Búsqueda de trabajadores por habilidades, profesión o calificación.
- **Reserva de Citas**: Los usuarios seleccionan la disponibilidad del trabajador a través de un calendario.
- **Interfaz Amigable**: La aplicación ofrece una interfaz intuitiva y envía notificaciones sobre las citas y estados de las mismas.

## Tecnologías Utilizadas

### Frontend
- **Framework**: Expo y React Native.
- **Componentes Clave**: 
  - `WorkerDetail`, `CalendarAvailability`, `TimeAvailability`, `BookingSuccess`, `AllBookedAppointments`, `BookingDetails`.
  - Componentes reutilizables como `appTextInput`, `ButtonCarousel`, `footer`, `WorkerCard`.
- **Navegación**: `index.tsx` maneja la navegación entre pantallas.
- **Estilos y Constantes**: Definidos en `styles/` y `constants/`.
- **Utilidades**: Funcionalidades auxiliares como validación de inputs y gestión de notificaciones.

### Backend
- **Framework**: Node.js con Express.js.
- **Base de Datos**: MongoDB.
- **Modelos**: `Booking`, `Review`, `User`, `Worker`.
- **Rutas CRUD**: `bookingRoutes`, `reviewRoutes`, `uploadRoutes`, `userRoutes`, `workerRoutes`.
- **Seguridad**:
  - Hashing de contraseñas con **bcrypt**.
  - Protección contra ataques de fuerza bruta y consultas maliciosas con **express-rate-limit**, **express-mongo-sanitize**, y **express-slow-down**.

## Estructura del Proyecto

### Frontend
```
frontend/
  |- app/
      |- adminHome.tsx
      |- BookingDetails.tsx
      |- login.tsx
      |- register.tsx
      |- home.tsx
      |- ...
  |- components/
      |- appTextInput.tsx
      |- ButtonCarousel.tsx
      |- footer.tsx
      |- WorkerCard.tsx
  |- constants/
      |- fonts.ts
      |- icons.ts
      |- layout.ts
  |- navigation/
      |- index.tsx
  |- styles/
      |- (Archivos de estilos)
  |- utils/
      |- apiHelper.ts
      |- inputValidation.ts
      |- notificationService.ts
```

### Backend
```
backend/
  |- src/
      |- models/
          |- Booking.ts
          |- Review.ts
          |- User.ts
          |- Worker.ts
      |- routes/
          |- bookingRoutes.ts
          |- reviewRoutes.ts
          |- uploadRoutes.ts
          |- userRoutes.ts
          |- workerRoutes.ts
      |- types/
          |- react-native-calendars.d.ts
      |- index.ts
  |- .env
  |- package.json
  |- ...
```

## Instalación

### Requisitos Previos

- Node.js
- Expo CLI
- MongoDB

### Instrucciones

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/v3gaaa/Manos-Expertas--Mobile-App.git
   ```

2. Configurar el backend:
   ```bash
   cd Manos-Expertas--Mobile-App/backend
   npm install --force
   ```
   Crear un archivo `.env` con las variables necesarias como la URL de MongoDB.

3. Iniciar el servidor:
   ```bash
   npm start
   ```

4. Configurar el frontend:
   ```bash
   cd ../frontend
   npm install
   ```

5. Iniciar la aplicación:
   ```bash
   npm start
   ```
