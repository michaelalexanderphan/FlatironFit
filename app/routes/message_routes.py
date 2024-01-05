from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.models import Message, User
from app.schemas import MessageSchema
from marshmallow import ValidationError

message_bp = Blueprint('message_bp', __name__)
api = Api(message_bp)
message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

class MessageList(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        messages = db.session.query(
            Message.id,
            Message.content,
            Message.timestamp,
            Message.is_read,  # Include is_read in the query
            User.username.label('sender_username'),
            User.username.label('receiver_username')
        ).join(User, User.id == Message.sender_id) \
            .filter((Message.sender_id == current_user_id) | (Message.receiver_id == current_user_id)) \
            .all()
        messages_list = [{
            'id': message.id,
            'content': message.content,
            'timestamp': message.timestamp.isoformat(),
            'is_read': message.is_read,  # Include is_read in the response
            'sender_username': message.sender_username,
            'receiver_username': message.receiver_username
        } for message in messages]

        return messages_list, 200
class UnreadMessageCount(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        count = Message.query.filter_by(receiver_id=current_user_id, is_read=False).count()
        return {'unread_count': count}, 200

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        json_data = request.get_json()
        if not json_data:
            return {'message': 'No input data provided'}, 400

        try:
            message_data = message_schema.load(json_data, partial=('sender_id',))
            message_data['sender_id'] = current_user_id
            new_message = Message(**message_data)
            db.session.add(new_message)
            db.session.commit()
            return message_schema.dump(new_message), 201
        except ValidationError as err:
            return err.messages, 422

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
    @jwt_required()
    def patch(self, message_id):
        current_user_id = get_jwt_identity()
        message = Message.query.get_or_404(message_id)
        if message.receiver_id != current_user_id:
            return {'message': 'Unauthorized'}, 403
        message.is_read = True
        db.session.commit()
        return {'message': 'Message marked as read'}, 200

class UserResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get_or_404(current_user_id)
        if current_user.role == 'trainer':
            users = User.query.all()
        elif current_user.role == 'client':
            users = User.query.filter_by(role='trainer').all()
        else:
            return {'message': 'Unauthorized'}, 403

        users_list = [{
            'id': user.id,
            'username': user.username,
            'role': user.role,
        } for user in users]

        return users_list, 200
class MessageCreate(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        json_data = request.get_json()
        if not json_data:
            return {'message': 'No input data provided'}, 400

        try:
            # Assuming the sender_id is set to current_user_id by default
            message_data = message_schema.load(json_data, partial=('sender_id',))
            message_data['sender_id'] = current_user_id
            new_message = Message(**message_data)
            db.session.add(new_message)
            db.session.commit()
            return message_schema.dump(new_message), 201
        except ValidationError as err:
            return err.messages, 422


api.add_resource(MessageList, '/messages')
api.add_resource(SingleMessage, '/messages/<int:message_id>')
api.add_resource(UserResource, '/users/available')
api.add_resource(UnreadMessageCount, '/messages/unread/count')
api.add_resource(MessageCreate, '/messages/create')

