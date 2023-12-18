from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.models.exercise import Exercise
from app.schemas import ExerciseSchema
from app import db
from marshmallow import ValidationError

exercise_bp = Blueprint('exercise_bp', __name__)

exercise_schema = ExerciseSchema()
exercises_schema = ExerciseSchema(many=True)

@exercise_bp.route('/exercises', methods=['GET'])
@jwt_required()
def get_exercises():
    exercises = Exercise.query.all()
    return jsonify(exercises_schema.dump(exercises)), 200

@exercise_bp.route('/exercises/<int:exercise_id>', methods=['GET'])
@jwt_required()
def get_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    return jsonify(exercise_schema.dump(exercise)), 200

@exercise_bp.route('/exercises', methods=['POST'])
@jwt_required()
def create_exercise():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    try:
        exercise_data = exercise_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422
    new_exercise = Exercise(**exercise_data)
    db.session.add(new_exercise)
    db.session.commit()
    return jsonify(exercise_schema.dump(new_exercise)), 201

@exercise_bp.route('/exercises/<int:exercise_id>', methods=['PUT'])
@jwt_required()
def update_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    try:
        exercise_data = exercise_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 422
    for key, value in exercise_data.items():
        setattr(exercise, key, value)
    db.session.commit()
    return jsonify(exercise_schema.dump(exercise)), 200

@exercise_bp.route('/exercises/<int:exercise_id>', methods=['DELETE'])
@jwt_required()
def delete_exercise(exercise_id):
    exercise = Exercise.query.get_or_404(exercise_id)
    db.session.delete(exercise)
    db.session.commit()
    return jsonify({'message': 'Exercise deleted successfully'}), 200
