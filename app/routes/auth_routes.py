from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)
from app.models.user import User
from app.schemas import UserSchema
from app import db
from datetime import timedelta
from marshmallow import ValidationError

auth_bp = Blueprint('auth_bp', __name__)

user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input data provided"}), 400
    try:
        user_data = user_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422
    if User.query.filter((User.username == user_data['username']) | (User.email == user_data['email'])).first():
        return jsonify({"msg": "Username or email already exists"}), 409
    new_user = User(**user_data)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully", "user": user_schema.dump(new_user)}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "Missing username or password"}), 400
    user = User.query.filter_by(username=json_data.get('username')).first()
    if user and user.check_password(json_data.get('password')):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(days=30))
        response = make_response(jsonify({
            "msg": "Login successful",
            "user": user_schema.dump(user),
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200)
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response
    return jsonify({"msg": "Bad username or password"}), 401

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = make_response(jsonify({"msg": "Logout successful"}), 200)
    unset_jwt_cookies(response)
    return response

@auth_bp.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user, expires_delta=timedelta(hours=1))
    response = make_response(jsonify({"access_token": new_access_token}), 200)
    set_access_cookies(response, new_access_token)
    return response
