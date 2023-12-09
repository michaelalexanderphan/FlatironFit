from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flatironfit.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to a random secret key

    # Initialize extensions with app instance
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Import models
    from app.models import user, workout, exercise, message

    # Import routes
    from app.routes import user_routes, workout_routes, exercise_routes, message_routes

    # Register Blueprints
    app.register_blueprint(user_routes.user_bp, url_prefix='/api')
    app.register_blueprint(workout_routes.workout_bp, url_prefix='/api')
    app.register_blueprint(exercise_routes.exercise_bp, url_prefix='/api')
    app.register_blueprint(message_routes.message_bp, url_prefix='/api')

    return app
