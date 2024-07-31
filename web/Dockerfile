# Utiliser une image Node.js officielle comme image de base
FROM node:latest

# Définir le répertoire de travail dans le conteneur
WORKDIR /app/web

# Copier package.json et package-lock.json dans le répertoire de travail
COPY /web/package*.json ./

# Installer les dépendances de l'application
RUN npm install

RUN npm install sequelize sequelize-cli cross-env --save-dev

# Copier le reste de l'application dans le répertoire de travail
COPY /web/ .

# Exposer le port que l'application utilisera
EXPOSE 4000

# Définir la commande pour démarrer l'application
CMD ["npm", "run", "start"]
