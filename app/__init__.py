from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Initialize the Flask app
app = Flask(__name__)

# Configurations for your Flask app, such as database URI and secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flatironfit.db'
app.config['SECRET_KEY'] = 'your_secret_key_here'

# Initialize the SQLAlchemy ORM
db = SQLAlchemy(app)

# Import models and routes below the SQLAlchemy instance creation
from app.models.user import User
from app.models.workout import Workout

# Import routes modules and register Blueprints
from app.routes import user_routes, workout_routes

# Registering the user and workout blueprints to handle respective routes
app.register_blueprint(user_routes.user_bp)
app.register_blueprint(workout_routes.workout_bp)
