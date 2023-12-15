from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    user_data = {
        "username": user.username,
        "email": user.email,
        "contact_info": user.contact_info,
        "bio": user.bio
    }
    return jsonify(user_data), 200

@user_bp.route('/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.contact_info = data.get('contact_info', user.contact_info)
    user.bio = data.get('bio', user.bio)
    db.session.commit()
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "contact_info": user.contact_info,
        "bio": user.bio
    }), 200

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def replace_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    data = request.get_json()
    user.username = data['username']
    user.email = data['email']
    user.contact_info = data['contact_info']
    user.bio = data['bio']
    if 'password' in data:
        user.set_password(data['password'])
    db.session.commit()
    return jsonify(user.to_dict()), 200

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted successfully"}), 200

@user_bp.route('/users/available', methods=['GET'])
@jwt_required()
def get_available_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if current_user.role == 'trainer':
        users = User.query.filter(User.id != current_user_id).all()
    else:
        users = User.query.filter_by(role='trainer').all()
    return jsonify([user.to_dict() for user in users]), 200
