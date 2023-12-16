from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.workout import Workout
from app.schemas import WorkoutSchema
from app import db
from marshmallow import ValidationError

workout_bp = Blueprint('workout_bp', __name__)

workout_schema = WorkoutSchema()
workouts_schema = WorkoutSchema(many=True)

@workout_bp.route('/workouts', methods=['GET'])
@jwt_required()
def get_workouts():
    workouts = Workout.query.all()
    return jsonify(workouts_schema.dump(workouts)), 200

@workout_bp.route('/workouts', methods=['POST'])
@jwt_required()
def create_workout():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400
    try:
        workout_data = workout_schema.load(json_data)
        workout_data['created_by'] = get_jwt_identity()
    except ValidationError as err:
        return jsonify(err.messages), 422
    new_workout = Workout(**workout_data)
    db.session.add(new_workout)
    db.session.commit()
    return jsonify(workout_schema.dump(new_workout)), 201

@workout_bp.route('/workouts/<int:workout_id>', methods=['PUT'])
@jwt_required()
def update_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    if workout.created_by != get_jwt_identity():
        return jsonify({'message': 'Unauthorized'}), 403
    json_data = request.get_json()
    try:
        workout_data = workout_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 422
    for key, value in workout_data.items():
        setattr(workout, key, value)
    db.session.commit()
    return jsonify(workout_schema.dump(workout)), 200

@workout_bp.route('/workouts/<int:workout_id>', methods=['DELETE'])
@jwt_required()
def delete_workout(workout_id):
    workout = Workout.query.get_or_404(workout_id)
    if workout.created_by != get_jwt_identity():
        return jsonify({'message': 'Unauthorized'}), 403
    db.session.delete(workout)
    db.session.commit()
    return jsonify({'message': 'Workout deleted successfully'}), 200
