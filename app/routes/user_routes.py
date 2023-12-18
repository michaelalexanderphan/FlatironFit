from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.models import User
from app.schemas import UserSchema
from marshmallow import ValidationError

user_bp = Blueprint('user_bp', __name__)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    return jsonify(user_schema.dump(user)), 200

@user_bp.route('/users/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    json_data = request.get_json()
    try:
        user_data = user_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 422
    for key, value in user_data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user_schema.dump(user)), 200

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def replace_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if user.id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    json_data = request.get_json()
    try:
        user_data = user_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422
    for key, value in user_data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user_schema.dump(user)), 200

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
    return jsonify(users_schema.dump(users)), 200
