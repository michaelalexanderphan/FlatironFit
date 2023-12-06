from flask import Blueprint, jsonify, request
from app import db
from app.models.user import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    # Logic to retrieve all users
    users = User.query.all()
    return jsonify([user.username for user in users]), 200

@user_bp.route('/users', methods=['POST'])
def create_user():
    # Logic to create a new user
    pass

# Add more user-related routes such as login, profile update, etc.
