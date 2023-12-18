from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
import os
from config import DevelopmentConfig, ProductionConfig, TestingConfig

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    env = os.getenv('FLASK_ENV', 'development')
    
    if env == 'production':
        app.config.from_object(ProductionConfig)
    elif env == 'testing':
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)
    
    # Add this line to specify the config class directly
    # app.config.from_object('config.DevelopmentConfig')

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Import the association table for many-to-many relationship between Users and Workouts
    from app.models.user import User, UserWorkout
    from app.models.workout import Workout
    from app.models.exercise import Exercise
    from app.models.message import Message

    from app.routes.auth_routes import auth_bp
    from app.routes.workout_routes import workout_bp
    from app.routes.exercise_routes import exercise_bp
    from app.routes.message_routes import message_bp
    from app.routes.user_routes import user_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(workout_bp, url_prefix='/api/workouts')
    app.register_blueprint(exercise_bp, url_prefix='/api/exercises')
    app.register_blueprint(message_bp, url_prefix='/api/messages')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    return app
