# Dice Game Application

## Sommaire
1. [Description](#description)
2. [Environnement](#environnement)
3. [Langages](#langages)
4. [Prérequis](#prérequis)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Exécution](#exécution)
8. [Utilisation](#utilisation)
9. [Tests](#tests)
10. [Dépannage](#dépannage)

## Description
Cette application est un jeu de dés composé de deux parties : une interface web et une interface d'administration. L'interface web permet aux utilisateurs de jouer au jeu de dés, tandis que l'interface d'administration permet de gérer les utilisateurs, les sessions de jeu et les configurations.

## Environnement
L'application utilise Docker pour la conteneurisation. Les services sont définis dans un fichier `docker-compose.yml`.

## Langages
- Interface Web : JavaScript (Node.js, Sequelize)
- Interface d'Administration : Python (Flask, SQLAlchemy)
- Base de données : MySQL

## Prérequis
- Docker
- Docker Compose

## Installation

1. Clonez le dépôt :
    ```sh
    git clone https://github.com/votre-utilisateur/dice-game.git
    cd dice-game
    ```

2. Créez les fichiers de configuration nécessaires (si nécessaire) :
    - `.env` (pour les variables d'environnement)

## Configuration
Assurez-vous que le fichier `docker-compose.yml` contient les bonnes informations de configuration. Vous pouvez adapter les valeurs selon vos besoins.

### Exemple de `docker-compose.yml` :
```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: ./web/Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=dice_game
      - DB_NAME_TEST=dice_game_test
      - DB_HOST=db
    depends_on:
      - db
  
  admin:
    build:
      context: .
      dockerfile: ./admin/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:password@db/dice_game
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: dice_game
      MYSQL_DATABASE_TEST: dice_game_test
    ports:
      - "3306:3306"
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

## Exécution
1. Démarrez les conteneurs Docker :

```
docker-compose up --build
```

2. Accédez à l'application :

- Interface Web : http://localhost:4000
- Interface d'Administration : http://localhost:5000

## Utilisation

1. Interface Web
Les utilisateurs peuvent jouer au jeu de dés en accédant à l'interface web. Ils peuvent créer un compte, rejoindre une session de jeu et commencer à jouer.

2. Interface d'Administration
Les administrateurs peuvent gérer les utilisateurs, les sessions de jeu et les configurations via l'interface d'administration.

## Tests

- Pour exécuter les tests unitaires pour l'interface web :

```
cd web
npm test
```