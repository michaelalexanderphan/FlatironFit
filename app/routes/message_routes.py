# Import necessary modules
from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.models import Message, User
from app.schemas import MessageSchema
from marshmallow import ValidationError

# Create a Blueprint for message-related routes
message_bp = Blueprint('message_bp', __name__)
api = Api(message_bp)
message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

# Define a Resource for handling message-related operations
class MessageList(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        messages = db.session.query(
            Message.id,
            Message.content,
            Message.timestamp,
            User.username.label('sender_username'),
            User.username.label('receiver_username')
        ).join(User, User.id == Message.sender_id) \
            .filter((Message.sender_id == current_user_id) | (Message.receiver_id == current_user_id)) \
            .all()
        messages_list = [{
            'id': message.id,
            'content': message.content,
            'timestamp': message.timestamp.isoformat(),
            'sender_username': message.sender_username,
            'receiver_username': message.receiver_username
        } for message in messages]

        return messages_list, 200

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        json_data = request.get_json()
        if not json_data:
            return {'message': 'No input data provided'}, 400

        try:
            # Load JSON data without validating sender_id
            message_data = message_schema.load(json_data, partial=('sender_id',))
            # Manually set sender_id
            message_data['sender_id'] = current_user_id
            new_message = Message(**message_data)
            db.session.add(new_message)
            db.session.commit()
            return message_schema.dump(new_message), 201
        except ValidationError as err:
            return err.messages, 422

# Define a Resource for handling single message operations (delete and update)
class SingleMessage(Resource):
    @jwt_required()
    def delete(self, message_id):
        current_user_id = get_jwt_identity()
        message = Message.query.get_or_404(message_id)
        if message.sender_id != current_user_id:
            return {'message': 'Unauthorized'}, 403
        db.session.delete(message)
        db.session.commit()
        return {'message': 'Message deleted successfully'}, 200

    @jwt_required()
    def put(self, message_id):
        current_user_id = get_jwt_identity()
        message = Message.query.get_or_404(message_id)
        if message.sender_id != current_user_id:
            return {'message': 'Unauthorized'}, 403
        json_data = request.get_json()
        try:
            message_data = message_schema.load(json_data, partial=True)
            for key, value in message_data.items():
                setattr(message, key, value)
            db.session.commit()
            return message_schema.dump(message), 200
        except ValidationError as err:
            return err.messages, 422

# Define a Resource for handling available users based on user role
class UserResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get_or_404(current_user_id)

        if current_user.role == 'trainer':
            # Trainers can get all users
            users = User.query.all()
        elif current_user.role == 'client':
            # Clients can only get trainers
            users = User.query.filter_by(role='trainer').all()
        else:
            # Handle other roles or permissions as needed
            return {'message': 'Unauthorized'}, 403

        users_list = [{
            'id': user.id,
            'username': user.username,
            'role': user.role,
            # Add other user attributes as needed
        } for user in users]

        return users_list, 200

# Add the MessageList, SingleMessage, and UserResource to the API
api.add_resource(MessageList, '/messages')
api.add_resource(SingleMessage, '/messages/<int:message_id>')
api.add_resource(UserResource, '/users/available')