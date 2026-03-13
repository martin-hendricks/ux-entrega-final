# UX Fitness App - Entrega Final

Aplicación web de planificación de entrenamiento deportivo desarrollada con Angular 19 y Angular Material.

##  Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18.x o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js) o **yarn**
- **Git** - [Descargar aquí](https://git-scm.com/)

Para verificar las versiones instaladas:
```bash
node --version
npm --version
```

##  Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ux-web-entrega-final
```

### 2. Navegar a la carpeta del proyecto Angular

```bash
cd ux-fitness-app
```

### 3. Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias listadas en `package.json`, incluyendo:
- Angular 19
- Angular Material
- Angular CDK
- RxJS

> ⏱ **Nota:** La instalación puede tomar varios minutos dependiendo de tu conexión a internet.

##  Ejecutar la Aplicación

Una vez instaladas las dependencias, ejecuta:

```bash
npm start
```

O alternativamente:

```bash
ng serve
```

La aplicación se iniciará en modo desarrollo y podrás acceder a ella en:

 **http://localhost:4200**

La aplicación se recargará automáticamente si realizas cambios en los archivos fuente.

##  Comandos Disponibles

- **`npm start`**: Inicia el servidor de desarrollo
- **`npm run build`**: Compila el proyecto para producción en la carpeta `dist/`
- **`npm test`**: Ejecuta las pruebas unitarias con Karma
- **`npm run watch`**: Compila en modo observación para desarrollo

## Funcionalidades de la Aplicación

- **Login**: Inicio de sesión
- **Dashboard**: Vista general con estadísticas de entrenamiento
- **Plan Semanal**: Calendario con sesiones programadas
- **Crear Sesión**: Formulario para planificar nuevas sesiones de entrenamiento
- **Detección de Conflictos**: Sistema de alertas cuando hay solapamiento de eventos
- **Resolución de Conflictos**: Interfaz para reorganizar sesiones conflictivas

## Acceso a la Aplicación

Para acceder a la aplicación, utiliza las siguientes credenciales de prueba:

- **Usuario**: `demo@fitness.com` (o cualquier email)
- **Contraseña**: (cualquier contraseña)

>  **Nota**: Actualmente la autenticación es simulada para propósitos de demostración.

##  Navegación

Una vez dentro, puedes navegar a:

- `/dashboard` - Panel principal con estadísticas
- `/plan-semanal` - Vista del calendario semanal

## Solución de Problemas

### Error: Puerto 4200 ocupado

Si el puerto 4200 está en uso, puedes:

1. Detener el proceso que está usando el puerto
2. O ejecutar en un puerto diferente:
   ```bash
   ng serve --port 4300
   ```

### Error de permisos en Windows

Si encuentras errores de permisos al instalar dependencias, ejecuta PowerShell como administrador.

### Errores de compilación

Si encuentras errores después de clonar:

1. Elimina la carpeta `node_modules`:
   ```bash
   rm -rf node_modules
   ```
2. Elimina `package-lock.json`:
   ```bash
   rm package-lock.json
   ```
3. Reinstala dependencias:
   ```bash
   npm install
   ```

##  Estructura del Proyecto

```
ux-fitness-app/
├── src/
│   ├── app/
│   │   ├── core/              # Servicios, guards, data
│   │   ├── features/          # Componentes de funcionalidades
│   │   │   ├── auth/          # Login
│   │   │   ├── dashboard/     # Panel principal
│   │   │   └── calendar/      # Plan semanal y diálogos
│   │   ├── models/            # Interfaces TypeScript
│   │   └── shared/            # Componentes compartidos
│   ├── styles/                # Estilos globales y variables
│   └── index.html             # HTML principal
├── angular.json               # Configuración Angular
└── package.json               # Dependencias del proyecto
```

## Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **Angular Material**: Componentes UI
- **TypeScript**: Lenguaje de programación
- **SCSS**: Preprocesador CSS
- **RxJS**: Programación reactiva

##  Licencia

Este proyecto es parte de una entrega académica para el curso de UX.

---

