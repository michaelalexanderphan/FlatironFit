from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    load_dotenv()

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///flatironfit.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback_secret_key')

    # Initialize extensions with app context
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Import models
    from app.models.user import User
    from app.models.workout import Workout
    from app.models.exercise import Exercise
    from app.models.message import Message

    # Import and register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.workout_routes import workout_bp
    from app.routes.exercise_routes import exercise_bp
    from app.routes.message_routes import message_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workout_bp, url_prefix='/api/workouts')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(message_bp, url_prefix='/api/messages')

    return app
