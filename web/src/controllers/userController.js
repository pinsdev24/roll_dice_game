const { User } = require('../models');

exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ where: { username } });
    
    if (existingUser) {
      req.session.user = existingUser;
      return res.status(409).json({ message: "Ce nom de joueur existe déjà. Est-ce bien la même personne ?" });
    }
    
    const user = await User.create({ username });
    req.session.user = user;

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du joueur", error });
  }
};

exports.createGuestUser = async (req, res) => {
  try {
    const guestName = `Guest_${Math.random().toString(36).substring(7)}`;
    const user = await User.create({ username: guestName, isGuest: true });
    req.session.user = user;
    
    res.status(201).json({username: guestName });
  } catch (error) {
    res.status(400).json({ message: 'Error creating guest user', error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    if (req.session.user){
      req.session.destroy();
      res.status(200).json({'message': 'Déconnecter', 'success': true});
    } else {
      res.status(400).json({ error: 'Aucun utilisateur en cour de session', 'success': false});
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating guest user', error: error.message });
  }
};