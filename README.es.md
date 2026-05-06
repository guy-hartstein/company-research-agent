 [![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.md)
[![zh](https://img.shields.io/badge/lang-zh-green.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.zh.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.fr.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.es.md)
[![jp](https://img.shields.io/badge/lang-jp-orange.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.jp.md)
[![kr](https://img.shields.io/badge/lang-ko-purple.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.kr.md)

# Investigador de Empresas 🔍

![interfaz web](<static/ui-1.png>)

Una herramienta multi-agente que genera informes de investigación exhaustivos sobre empresas. La plataforma utiliza un sistema de agentes de IA para recopilar, seleccionar y sintetizar información sobre cualquier empresa.

✨¡Pruébalo en línea! https://companyresearcher.tavily.com ✨

https://github.com/user-attachments/assets/0e373146-26a7-4391-b973-224ded3182a9

## Características

- **Investigación Multi-Fuente**: Recopila datos de diversas fuentes, incluyendo sitios web de empresas, artículos de noticias, informes financieros y análisis sectoriales
- **Filtrado de Contenido Impulsado por IA**: Utiliza la puntuación de relevancia de Tavily para la selección de contenido
- **Procesamiento Asíncrono**: Arquitectura eficiente basada en polling para rastrear el progreso de la investigación
- **Arquitectura de Modelo Dual**:
  - Gemini 2.5 Flash para síntesis de investigación de alto contexto
  - GPT-5.1 para formato preciso y edición de informes
- **Frontend Moderno en React**: Interfaz de usuario receptiva con seguimiento de progreso y opciones de descarga
- **Arquitectura Modular**: Construido utilizando un sistema de nodos de investigación y procesamiento especializados

## Marco de Agentes

### Sistema de Investigación

La plataforma sigue un marco basado en agentes con nodos especializados que procesan datos secuencialmente:

1. **Nodos de Investigación**:
   - `CompanyAnalyzer`: Investiga información básica del negocio
   - `IndustryAnalyzer`: Analiza posición de mercado y tendencias
   - `FinancialAnalyst`: Recopila métricas financieras y datos de rendimiento
   - `NewsScanner`: Recopila noticias y desarrollos recientes

2. **Nodos de Procesamiento**:
   - `Collector`: Agrega datos de investigación de todos los analizadores
   - `Curator`: Implementa filtrado de contenido y puntuación de relevancia
   - `Briefing`: Genera resúmenes específicos por categoría utilizando Gemini 2.5 Flash
   - `Editor`: Compila y formatea los resúmenes en un informe final utilizando GPT-5.1

   ![interfaz web](<static/agent-flow.png>)

### Arquitectura de Generación de Contenido

La plataforma aprovecha modelos separados para un rendimiento óptimo:

1. **Gemini 2.5 Flash** (`briefing.py`):
   - Maneja tareas de síntesis de investigación de alto contexto
   - Sobresale en el procesamiento y resumen de grandes volúmenes de datos
   - Utilizado para generar resúmenes iniciales por categoría
   - Eficiente en mantener el contexto a través de múltiples documentos

2. **GPT-5.1** (`editor.py`):
   - Se especializa en tareas precisas de formato y edición
   - Maneja la estructura y consistencia en markdown
   - Superior en seguir instrucciones exactas de formato
   - Utilizado para:
     - Compilación final del informe
     - Eliminación de duplicados de contenido
     - Formateo en markdown
     - Transmisión de informes en tiempo real

Este enfoque combina la fortaleza de Gemini en el manejo de ventanas de contexto grandes con la precisión de GPT-5.1 en seguir instrucciones específicas de formato.

### Sistema de Selección de Contenido

La plataforma utiliza un sistema de filtrado de contenido en `curator.py`:

1. **Puntuación de Relevancia**:
   - Los documentos son puntuados por la búsqueda potenciada por IA de Tavily
   - Se requiere un umbral mínimo (predeterminado 0.4) para proceder
   - Las puntuaciones reflejan la relevancia para la consulta de investigación específica
   - Puntuaciones más altas indican mejores coincidencias con la intención de la investigación

2. **Procesamiento de Documentos**:
   - El contenido se normaliza y limpia
   - Las URLs se desduplicaron y estandarizaron
   - Los documentos se ordenan por puntuaciones de relevancia
   - La investigación se ejecuta de forma asíncrona en segundo plano

### Arquitectura del Backend

La plataforma implementa un sistema de comunicación simple basado en polling:

![interfaz web](<static/ui-2.png>)

1. **Implementación Backend**:
   - Utiliza FastAPI con soporte asíncrono
   - Las tareas de investigación se ejecutan en segundo plano
   - Los resultados se almacenan y acceden mediante endpoints REST
   - Seguimiento simple del estado del trabajo
   
2. **Integración Frontend**:
   - El frontend React envía solicitudes de investigación
   - Recibe job_id para seguimiento
   - Realiza polling al endpoint `/research/{job_id}/report`
   - Muestra el informe final cuando está completo

3. **Endpoints de la API**:
   - `POST /research`: Enviar nueva solicitud de investigación
   - `GET /research/{job_id}/report`: Polling para informe completado
   - `POST /generate-pdf`: Generar PDF del contenido del informe

## Instalación

### Instalación Rápida (Recomendada)

La forma más sencilla de comenzar es utilizando el script de instalación, que detecta automáticamente y usa `uv` para una instalación más rápida de paquetes Python cuando está disponible:

1. Clonar el repositorio:
```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. Hacer que el script de instalación sea ejecutable y ejecutarlo:
```bash
chmod +x setup.sh
./setup.sh
```

El script de instalación hará lo siguiente:

- Detectar y usar `uv` para una instalación más rápida de paquetes Python (si está disponible)
- Verificar las versiones requeridas de Python y Node.js
- Opcionalmente crear un entorno virtual de Python (recomendado)
- Instalar todas las dependencias (Python y Node.js)
- Guiarte a través de la configuración de tus variables de entorno
- Opcionalmente iniciar los servidores de backend y frontend

> **💡 Consejo Pro**: Instala [uv](https://github.com/astral-sh/uv) para una instalación significativamente más rápida de paquetes Python:
>
> ```bash
> curl -LsSf https://astral.sh/uv/install.sh | sh
> ```

Necesitarás tener listas las siguientes claves API:
- Clave API de Tavily
- Clave API de Google Gemini
- Clave API de OpenAI
- Clave API de Google Maps
- URI de MongoDB (opcional)

### Instalación Manual

Si prefieres realizar la instalación manualmente, sigue estos pasos:

1. Clonar el repositorio:
```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. Instalar dependencias de backend:
```bash
# Opcional: Crear y activar entorno virtual
# Con uv (más rápido - recomendado si está disponible):
uv venv .venv
source .venv/bin/activate

# O con Python estándar:
# python -m venv .venv
# source .venv/bin/activate

# Instalar dependencias de Python
# Con uv (más rápido):
uv pip install -r requirements.txt

# O con pip:
# pip install -r requirements.txt
```

3. Instalar dependencias de frontend:
```bash
cd ui
npm install
```

4. **Configurar Variables de Entorno**:

Este proyecto requiere dos archivos `.env` separados para el backend y el frontend.

**Configuración del Backend:**

Crea un archivo `.env` en el directorio raíz del proyecto y añade tus claves API del backend:

```env
TAVILY_API_KEY=tu_clave_tavily
GEMINI_API_KEY=tu_clave_gemini
OPENAI_API_KEY=tu_clave_openai

# Opcional: Habilitar persistencia en MongoDB
# MONGODB_URI=tu_cadena_de_conexion_mongodb
```

**Configuración del Frontend:**

Crea un archivo `.env` dentro del directorio `ui`. Puedes copiar primero el archivo de ejemplo:

```bash
cp ui/.env.development.example ui/.env
```

Luego, abre `ui/.env` y añade tus variables de entorno del frontend:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=tu_clave_google_maps_aqui
```

### Instalación con Docker

La aplicación puede ejecutarse utilizando Docker y Docker Compose:

1. Clonar el repositorio:
```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. **Configurar Variables de Entorno**:

La configuración de Docker utiliza dos archivos `.env` separados.

**Configuración del Backend:**

Crea un archivo `.env` en el directorio raíz del proyecto con tus claves API del backend:

```env
TAVILY_API_KEY=tu_clave_tavily
GEMINI_API_KEY=tu_clave_gemini
OPENAI_API_KEY=tu_clave_openai

# Opcional: Habilitar persistencia en MongoDB
# MONGODB_URI=tu_cadena_de_conexion_mongodb
```

**Configuración del Frontend:**

Crea un archivo `.env` dentro del directorio `ui`. Puedes copiar primero el archivo de ejemplo:

```bash
cp ui/.env.development.example ui/.env
```

Luego, abre `ui/.env` y añade tus variables de entorno del frontend:

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=tu_clave_google_maps_aqui
```

3. Construir e iniciar los contenedores:
```bash
docker compose up --build
```

Esto iniciará los servicios de backend y frontend:
- La API de backend estará disponible en `http://localhost:8000`
- El frontend estará disponible en `http://localhost:5174`

Para detener los servicios:
```bash
docker compose down
```

Nota: Al actualizar las variables de entorno en `.env`, necesitarás reiniciar los contenedores:
```bash
docker compose down && docker compose up
```

### Ejecutando la Aplicación

1. Iniciar el servidor de backend (elige una opción):
```bash
# Opción 1: Módulo Python Directo
python -m application.py

# Opción 2: FastAPI con Uvicorn
uvicorn application:app --reload --port 8000
```

2. En una nueva terminal, iniciar el frontend:
```bash
cd ui
npm run dev
```

3. Acceder a la aplicación en `http://localhost:5173`

## Uso

### Desarrollo Local

1. Iniciar el servidor de backend (elige una opción):

   **Opción 1: Módulo Python Directo**
   ```bash
   python -m application.py
   ```

   **Opción 2: FastAPI con Uvicorn**
   ```bash
   # Instalar uvicorn si aún no está instalado
   # Con uv (más rápido):
   uv pip install uvicorn
   # O con pip:
   # pip install uvicorn

   # Ejecutar la aplicación FastAPI con recarga automática
   uvicorn application:app --reload --port 8000
   ```

   El backend estará disponible en:
   - Punto de conexión API: `http://localhost:8000`

2. Iniciar el servidor de desarrollo del frontend:
   ```bash
   cd ui
   npm run dev
   ```

3. Acceder a la aplicación en `http://localhost:5173`

> **⚡ Nota de Rendimiento**: Si usaste `uv` durante la instalación, te beneficiarás de una instalación de paquetes y resolución de dependencias significativamente más rápida. `uv` es un gestor de paquetes Python moderno escrito en Rust que puede ser 10-100x más rápido que pip.

### Opciones de Despliegue

La aplicación puede desplegarse en varias plataformas en la nube. Aquí hay algunas opciones comunes:

#### AWS Elastic Beanstalk

1. Instalar el EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Inicializar la aplicación EB:
   ```bash
   eb init -p python-3.11 tavily-research
   ```

3. Crear y desplegar:
   ```bash
   eb create tavily-research-prod
   ```

#### Otras Opciones de Despliegue

- **Docker**: La aplicación incluye un Dockerfile para despliegue en contenedores
- **Heroku**: Despliegue directamente desde GitHub con el buildpack de Python
- **Google Cloud Run**: Adecuado para despliegue en contenedores con escalado automático

Elige la plataforma que mejor se adapte a tus necesidades. La aplicación es independiente de la plataforma y puede alojarse en cualquier lugar que admita aplicaciones web Python.

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama de características (`git checkout -b feature/caracteristica-increible`)
3. Haz commit de tus cambios (`git commit -m 'Añadir característica increíble'`)
4. Haz push a la rama (`git push origin feature/caracteristica-increible`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Agradecimientos

- [Tavily](https://tavily.com/) por la API de investigación
- Todas las demás bibliotecas de código abierto y sus contribuyentes

## Star History

<a href="https://www.star-history.com/?repos=guy-hartstein%2Fcompany-research-agent&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=guy-hartstein/company-research-agent&type=date&theme=dark&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=guy-hartstein/company-research-agent&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=guy-hartstein/company-research-agent&type=date&legend=bottom-right" />
 </picture>
</a>
