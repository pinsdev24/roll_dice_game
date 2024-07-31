require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
var bodyParser = require('body-parser')
const routes = require('./routes');
const { sequelize, Configuration, User, Session } = require('./models');
const logger = require('./logger'); 

const app = express();

app.use(express.static(path.join(__dirname, '../public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'ADS654$564ad54ASD654asfa',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30*60*1000
  }
}));

// Middleware to log each request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', routes);

// Frontend routes
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const user = req.session.user
  res.render('index', {user});
});

app.get('/login', (req, res) => res.render('login'));

app.get('/game', async (req, res) => {
  if (!req.session.user || !req.session.sessionId) {
    return res.redirect('/');
  }

  const sessionId = req.session.sessionId;
  const user = req.session.user;

  const configuration = await Configuration.findOne({where: {SessionId: sessionId}})

  const session = await Session.findByPk(sessionId, {
    include: [
      {
        model: User,
        as: 'players',
        through: {
          attributes: [] // exclude attributes from the join table if not needed
        }
      }
    ]
  });

  const players = session.players.map(player => player.dataValues);

  // Convert players to JSON string
  const playersJson = JSON.stringify(players);

  if (configuration){
    res.render('game', {sessionId, user, configuration, players: playersJson})
  } else {
    res.render('game', {sessionId, user, players: playersJson})
  }
});

app.get('/leaderboard', (req, res) => res.render('leaderboard'));

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Démarrer le serveur
    if (process.env.NODE_ENV != 'test'){
      sequelize.sync().then(() => {
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      });
    }
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; // Pour les tests