from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.message import Message
from app.models.user import User
from app.schemas import MessageSchema
from app import db
from marshmallow import ValidationError

message_bp = Blueprint('message_bp', __name__)

message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)

@message_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    current_user_id = get_jwt_identity()
    messages = Message.query.filter((Message.sender_id == current_user_id) | (Message.receiver_id == current_user_id)).all()
    return jsonify(messages_schema.dump(messages)), 200

@message_bp.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    try:
        message_data = message_schema.load(json_data)
        message_data['sender_id'] = current_user_id
    except ValidationError as err:
        return jsonify(err.messages), 422
    new_message = Message(**message_data)
    db.session.add(new_message)
    db.session.commit()
    return jsonify(message_schema.dump(new_message)), 201

@message_bp.route('/messages/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    current_user_id = get_jwt_identity()
    message = Message.query.get_or_404(message_id)
    if message.sender_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403
    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Message deleted successfully'}), 200
