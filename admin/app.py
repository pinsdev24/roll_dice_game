from flask import Flask, render_template, request, redirect
from flask_restful import Api, Resource
from models import db, User, Game, Configuration
from resources import PlayerResource, SessionResource, GameResource, ConfigurationResource
from swagger import swagger_ui_blueprint, SWAGGER_URL
from flask_migrate import Migrate
import os
from datetime import datetime

app = Flask(__name__, static_url_path='/static')

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'mysql+pymysql://root:@localhost/dice_game')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

# Add resources to the API
api.add_resource(PlayerResource, '/api/players', '/api/players/<int:player_id>')
api.add_resource(SessionResource, '/api/sessions', '/api/sessions/<int:session_id>')
api.add_resource(GameResource, '/api/games', '/api/games/<int:game_id>')
api.add_resource(ConfigurationResource, '/api/configuration', '/api/configuration/<int:id>')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/players')
def players():
    players = User.query.all()
    data= [player.serialize() for player in players]
    
    return render_template('players.html', data=data)

@app.route('/games')
def games():
    games = Game.query.all()
    data= [game.serialize() for game in games]
    
    return render_template('games.html', data=data)

@app.route('/settings')
def settings():
    config = Configuration.query.first()
    data=  config.serialize()
    return render_template('settings.html', data=data)

@app.route('/configuration/<int:id>', methods=['GET'])
def configuration(id):
    if (id):
        config = Configuration.query.get(id)
        if config is None:
            return render_template('pages-error-404.html')
        return render_template('settings.html', data = config.serialize())

@app.route('/configuration/<int:id>', methods=['POST'])
def config_session(id):
    if request.form.get('_method') == 'PUT':
        data = request.form
        if (id):
            config = Configuration.query.get(id)
            if config is None:
                return {"message": "No configuration found"}, 404
            config.diceCount = data['default_dice_count']
            config.gameCount = data['max_games_per_session']
            config.playerCount = data['player_count']
            config.updated_at = datetime.utcnow()
            db.session.commit()
            return redirect('http://localhost:4000/game'), 200


@app.errorhandler(404)
def page_not_found(e):
    return render_template('pages-error-404.html'), 404

# Register the Swagger UI blueprint
app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

if __name__ == '__main__':
    app.run(debug=True)
