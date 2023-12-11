from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv


db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
s
    load_dotenv()

    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flatironfit.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')

    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    
    from app.models.user import User
    from app.models.workout import Workout
    from app.models.exercise import Exercise
    from app.models.message import Message

    from app.routes.user_routes import user_bp
    from app.routes.workout_routes import workout_bp
    from app.routes.exercise_routes import exercise_bp
    from app.routes.message_routes import message_bp

    
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(workout_bp, url_prefix='/api/workouts')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(message_bp, url_prefix='/api/messages')

    return app
