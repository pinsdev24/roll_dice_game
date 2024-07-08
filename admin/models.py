from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    isGuest = db.Column(db.Integer, unique=False, nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, username, isGuest, createdAt)-> None:
        self.username = username
        self.isGuest = isGuest
        self.createdAt = createdAt

    def serialize(self):
        date = ""
        if self.createdAt:
            date = self.createdAt.strftime('%Y-%m-%d %H:%M:%S')
        return {
            'id': self.id,
            'username': self.username,
            'is_guest': self.isGuest,
            'created_at': date
        }

class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True)
    startTime = db.Column(db.DateTime, nullable=False)
    endTime = db.Column(db.DateTime)
    creatorId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    UserId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    players = db.relationship('User', secondary='sessionPlayers', backref=db.backref('sessions', lazy=True))

    def __init__(self, startIme, endTime, creatorId, UserId)-> None:
        self.startTime = startIme
        self.endTime= endTime
        self.UserId = UserId
        self.creatorId = creatorId

    def serialize(self):
        start = ""
        end = ""
        if self.start_date:
            start = self.startTime.strftime('%Y-%m-%d %H:%M:%S')
        if self.end_date:
            end = self.endTime.strftime('%Y-%m-%d %H:%M:%S')
        return {
            'id': self.id,
            'creator_id': self.creator_id,
            'start_date': start,
            'end_date': end
        }

class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    startTime = db.Column(db.DateTime, nullable=False)
    endTime = db.Column(db.DateTime)
    score = db.Column(db.Integer, nullable=False)
    SessionId = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    UserId = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, startTime, endTime, score, SessionId, UserId)-> None:
        self.startTime = startTime
        self.endTime = endTime
        self.score = score
        self.SessionId = SessionId
        self.UserId = UserId

    def serialize(self):
        start = ""
        end = ""
        if self.startTime:
            start = self.startTime.strftime('%Y-%m-%d %H:%M:%S')
        if self.endTime:
            end = self.endTime.strftime('%Y-%m-%d %H:%M:%S')
        return {
            'id': self.id,
            'session_id': self.SessionId,
            'player_id': self.UserId,
            'score': self.score,
            'start_date': start,
            'end_date': end
        }

session_players = db.Table('sessionPlayers',
    db.Column('SessionId', db.Integer, db.ForeignKey('sessions.id'), primary_key=True),
    db.Column('UserId', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class Configuration(db.Model):
    __tablename__ = 'configurations'

    id = db.Column(db.Integer, primary_key=True)
    playerCount = db.Column(db.Integer, nullable=False)
    diceCount = db.Column(db.Integer, nullable=False)
    gameCount = db.Column(db.Integer, nullable=False)
    waitTime = db.Column(db.Integer, nullable=False)
    SessionId = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, playerCount, diceCount, gameCount,waitTime,SessionId, createdAt, updatedAt)-> None:
        self.playerCount = playerCount
        self.diceCount = diceCount
        self.gameCount = gameCount
        self.waitTime = waitTime
        self.updatedAt = updatedAt
        self.createdAt = createdAt

    def serialize(self):
        return {
            'id': self.id,
            'player_count': self.playerCount,
            'default_dice_count': self.diceCount,
            'max_games_per_session': self.gameCount,
            'waitime': self.waitTime,
            'updated_at': self.updatedAt,
            'created_at': self.createdAt
        }