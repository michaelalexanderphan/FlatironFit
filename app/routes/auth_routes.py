from flask import Blueprint, jsonify, request, make_response
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    get_jwt_identity, set_access_cookies, set_refresh_cookies, unset_jwt_cookies
)
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app import db
from datetime import timedelta
from flask_cors import CORS

auth_bp = Blueprint('auth_bp', __name__)
CORS(auth_bp)

@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    role = request.form.get('role', 'client')
    secret_code = request.form.get('secret_code', 'trainer')
    contact_info = request.form.get('contactInfo', '')
    bio = request.form.get('bio', '')

    if not username or not email or not password:
        return jsonify({"msg": "Missing username, email, or password"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"msg": "Username or email already exists"}), 409

    if role == 'trainer' and secret_code != 'trainer':
        return jsonify({"msg": "Invalid secret code for trainer role"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        username=username, email=email, role=role,
        password_hash=hashed_password,
        contact_info=contact_info, bio=bio
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(days=30))

        user_data = user.to_dict()  # Convert user data to dict

        response = make_response(jsonify({
            "msg": "Login successful",
            "user": user_data,
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
