from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.message import Message
from app.models.user import User  # Don't forget to import User
from app import db

message_bp = Blueprint('message_bp', __name__)

@message_bp.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    current_user_id = get_jwt_identity()
    messages = Message.query.filter((Message.sender_id == current_user_id) | (Message.receiver_id == current_user_id)).all()
    return jsonify([message.to_dict() for message in messages]), 200

@message_bp.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)  
    receiver_id = request.json.get('receiver_id')
    content = request.json.get('content')

    if not receiver_id or not content:
        return jsonify({"msg": "Receiver and content are required"}), 400
   
    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({"msg": "Receiver not found"}), 404

    if current_user.role == 'client' and receiver.role != 'trainer':
        return jsonify({"msg": "Clients can only send messages to trainers"}), 403

    new_message = Message(sender_id=current_user_id, receiver_id=receiver_id, content=content)
    db.session.add(new_message)
    db.session.commit()

    return jsonify(new_message.to_dict()), 201

@message_bp.route('/messages/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    current_user_id = get_jwt_identity()
    message = Message.query.get(message_id)

    if not message or message.sender_id != current_user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    db.session.delete(message)
    db.session.commit()
    return jsonify({"msg": "Message deleted successfully"}), 200
