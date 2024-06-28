const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

async function initializeDatabase() {
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

  // Créer une connexion sans spécifier de base de données
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });

  try {
    // Vérifier si la base de données existe
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${DB_NAME}'`);

    if (rows.length === 0) {
      // Si la base de données n'existe pas, la créer
      console.log(`La base de données ${DB_NAME} n'existe pas. Création en cours...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
      console.log(`Base de données ${DB_NAME} créée avec succès.`);
    } else {
      console.log(`La base de données ${DB_NAME} existe déjà.`);
    }

  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base de données:", error);
    throw error;
  } finally {
    await connection.end();
  }

  // Initialiser Sequelize avec la base de données créée
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
  });

  try {
    // Vérifier la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');

    // Synchroniser les modèles avec la base de données
    await sequelize.sync();
    console.log('Modèles synchronisés avec la base de données.');

  } catch (error) {
    console.error('Impossible de se connecter à la base de données:', error);
    throw error;
  }

  return sequelize;
}

module.exports = initializeDatabase;