# Utiliza una imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de tu proyecto al directorio de trabajo en el contenedor
COPY package.json package-lock.json /app/
COPY index.js queue.js /app/
COPY src /app/src
COPY .env /app/.env

# Instala las dependencias del proyecto
RUN npm install
RUN npm install pm2@latest -g

# Copia el archivo de configuración de PM2
COPY pm2.config.js /app/pm2.config.js

# Inicia ambos procesos usando PM2
CMD ["pm2-runtime", "start", "/app/pm2.config.js"]




