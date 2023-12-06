from flask import Blueprint, jsonify, request
from app import db
from app.models.workout import Workout

workout_bp = Blueprint('workout_bp', __name__)

@workout_bp.route('/workouts', methods=['GET'])
def get_workouts():
    # Logic to retrieve all workouts
    workouts = Workout.query.all()
    return jsonify([workout.title for workout in workouts]), 200

# Add routes for creating, updating, and deleting workouts
