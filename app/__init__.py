from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Initialize the Flask app
app = Flask(__name__)

# Set up SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flatironfit.db'
db = SQLAlchemy(app)

# Set up JWT
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this!
jwt = JWTManager(app)

# Set up Flask-Migrate
migrate = Migrate(app, db)

# Import models
from app.models.user import User
from app.models.workout import Workout

# Import routes modules and register Blueprints
from app.routes import user_routes, workout_routes

app.register_blueprint(user_routes.user_bp)
app.register_blueprint(workout_routes.workout_bp)
