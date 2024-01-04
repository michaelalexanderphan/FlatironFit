from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_cors import CORS  
from app import db
from app.models.models import User
from app.schemas import UserSchema

user_bp = Blueprint('user_bp', __name__)
api = Api(user_bp)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

CORS(user_bp)

class UserResource(Resource):
    @jwt_required()
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return user_schema.dump(user), 200

    @jwt_required()
    def patch(self, user_id):
        user = User.query.get_or_404(user_id)
        json_data = request.get_json()
        user_data = user_schema.load(json_data, partial=True)
        for key, value in user_data.items():
            setattr(user, key, value)
        db.session.commit()
        return user_schema.dump(user), 200

    @jwt_required()
    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        json_data = request.get_json()
        user_data = user_schema.load(json_data)
        for key, value in user_data.items():
            setattr(user, key, value)
        db.session.commit()
        return user_schema.dump(user), 200

    @jwt_required()
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"msg": "User deleted successfully"}, 200

class AvailableUsers(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        
        if current_user.role == 'trainer':
            # Trainer can see all users
            users = User.query.filter(User.id != current_user_id).all()
        else:
            
            users = User.query.filter_by(role='trainer').all()

        return users_schema.dump(users), 200

api.add_resource(UserResource, '/users/<int:user_id>')
api.add_resource(AvailableUsers, '/users/available')
