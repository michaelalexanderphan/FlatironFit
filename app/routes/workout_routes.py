from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.workout import Workout
from app import db

workout_bp = Blueprint('workout_bp', __name__)

@workout_bp.route('/workouts', methods=['GET'])
@jwt_required()
def get_workouts():
    workouts = Workout.query.all()
    return jsonify([workout.to_dict() for workout in workouts]), 200

@workout_bp.route('/workouts', methods=['POST'])
@jwt_required()
def create_workout():
    current_user_id = get_jwt_identity()
    data = request.json
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({"msg": "Title is required"}), 400

    new_workout = Workout(title=title, description=description, created_by=current_user_id)
    db.session.add(new_workout)
    db.session.commit()

    return jsonify(new_workout.to_dict()), 201

@workout_bp.route('/workouts/<int:workout_id>', methods=['PUT'])
@jwt_required()
def update_workout(workout_id):
    current_user_id = get_jwt_identity()
    workout = Workout.query.get(workout_id)
    if not workout or workout.created_by != current_user_id:
        return jsonify({"msg": "Unauthorized or Workout not found"}), 403

    data = request.json
    workout.title = data.get('title', workout.title)
    workout.description = data.get('description', workout.description)

    db.session.commit()
    return jsonify(workout.to_dict()), 200

@workout_bp.route('/workouts/<int:workout_id>', methods=['DELETE'])
@jwt_required()
def delete_workout(workout_id):
    current_user_id = get_jwt_identity()
    workout = Workout.query.get(workout_id)
    if not workout or workout.created_by != current_user_id:
        return jsonify({"msg": "Unauthorized or Workout not found"}), 403

    db.session.delete(workout)
    db.session.commit()
    return jsonify({"msg": "Workout deleted successfully"}), 200
