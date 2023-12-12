from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app import db

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    return jsonify(user.to_dict()), 200

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.json
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    
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
