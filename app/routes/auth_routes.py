from flask import Blueprint, request, jsonify, make_response
from app import db
from app.models.models import User
from app.schemas import UserSchema
from werkzeug.security import generate_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from datetime import timedelta
from marshmallow import ValidationError
from flask_restful import Api, Resource

auth_bp = Blueprint('auth_bp', __name__)
api = Api(auth_bp)
user_schema = UserSchema()

class Register(Resource):
    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"msg": "No input data provided"}, 400
        existing_user = User.query.filter((User.username == json_data.get('username')) | (User.email == json_data.get('email'))).first()
        if existing_user:
            return {"msg": "Username or email already exists"}, 409
        try:
            # Hash the password
            password = json_data.pop('password')
            password_hash = generate_password_hash(password)

            user_data = json_data
            user_data['password_hash'] = password_hash

            new_user = User(**user_data)
            db.session.add(new_user)
            db.session.commit()
            return {"msg": "User registered successfully", "user": user_schema.dump(new_user)}, 201
        except ValidationError as err:
            print("Validation Error:", err.messages)  # Add this line for debugging
            return err.messages, 422


api.add_resource(Register, '/register')

class Login(Resource):
    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"msg": "Missing username or password"}, 400
        user = User.query.filter_by(username=json_data.get('username')).first()
        if user and user.check_password(json_data.get('password')):
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
            refresh_token = create_refresh_token(identity=user.id, expires_delta=timedelta(days=30))
            response_data = {
                "msg": "Login successful",
                "user": user_schema.dump(user),
                "access_token": access_token,
                "refresh_token": refresh_token
            }
            response = make_response(jsonify(response_data), 200)
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            return response
        return {"msg": "Bad username or password"}, 401

class Logout(Resource):
    @jwt_required()
    def post(self):
        response = make_response({"msg": "Logout successful"}, 200)
        unset_jwt_cookies(response)
        return response

class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user, expires_delta=timedelta(hours=1))
        response_data = {"access_token": new_access_token}
        response = make_response(jsonify(response_data), 200)
        set_access_cookies(response, new_access_token)
        return response

api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(TokenRefresh, '/token/refresh')
