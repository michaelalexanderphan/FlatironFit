from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.models.exercise import Exercise
from app import db

exercise_bp = Blueprint('exercise_bp', __name__)

@exercise_bp.route('/exercises', methods=['GET'])
@jwt_required()
def get_exercises():
    exercises = Exercise.query.all()
    return jsonify([exercise.to_dict() for exercise in exercises]), 200

@exercise_bp.route('/exercises', methods=['POST'])
@jwt_required()
def create_exercise():
    current_user_id = get_jwt_identity()  # Assuming only certain users can create exercises
    # Add role check if needed, e.g., only trainers can create exercises

    data = request.json
    name = data.get('name')
    description = data.get('description')
    type = data.get('type')
    duration = data.get('duration')
    intensity_level = data.get('intensity_level')

    if not name:
        return jsonify({"msg": "Exercise name is required"}), 400

    new_exercise = Exercise(name=name, description=description, type=type, duration=duration, intensity_level=intensity_level)
    db.session.add(new_exercise)
    db.session.commit()

    return jsonify(new_exercise.to_dict()), 201

@exercise_bp.route('/exercises/<int:exercise_id>', methods=['PUT'])
@jwt_required()
def update_exercise(exercise_id):
    current_user_id = get_jwt_identity()  # Add role check if needed
    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({"msg": "Exercise not found"}), 404

    data = request.json
    exercise.name = data.get('name', exercise.name)
    exercise.description = data.get('description', exercise.description)
    exercise.type = data.get('type', exercise.type)
    exercise.duration = data.get('duration', exercise.duration)
    exercise.intensity_level = data.get('intensity_level', exercise.intensity_level)

    db.session.commit()
    return jsonify(exercise.to_dict()), 200

@exercise_bp.route('/exercises/<int:exercise_id>', methods=['DELETE'])
@jwt_required()
def delete_exercise(exercise_id):
    current_user_id = get_jwt_identity()  # Add role check if needed
    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({"msg": "Exercise not found"}), 404

    db.session.delete(exercise)
    db.session.commit()
    return jsonify({"msg": "Exercise deleted successfully"}), 200
