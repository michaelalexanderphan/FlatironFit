from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.models import Workout
from app.schemas import WorkoutSchema
from marshmallow import ValidationError

workout_bp = Blueprint('workout_bp', __name__)
api = Api(workout_bp)
workout_schema = WorkoutSchema()
workouts_schema = WorkoutSchema(many=True)

class WorkoutList(Resource):
    @jwt_required()
    def get(self):
        workouts = Workout.query.all()
        return workouts_schema.dump(workouts), 200

    @jwt_required()
    def post(self):
        json_data = request.get_json()
        try:
            workout_data = workout_schema.load(json_data)
            workout_data['created_by'] = get_jwt_identity()
            new_workout = Workout(**workout_data)
            db.session.add(new_workout)
            db.session.commit()
            return workout_schema.dump(new_workout), 201
        except ValidationError as err:
            return err.messages, 422

class SingleWorkout(Resource):
    @jwt_required()
    def put(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        json_data = request.get_json()
        try:
            workout_data = workout_schema.load(json_data, partial=True)
            for key, value in workout_data.items():
                setattr(workout, key, value)
            db.session.commit()
            return workout_schema.dump(workout), 200
        except ValidationError as err:
            return err.messages, 422

    @jwt_required()
    def delete(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        db.session.delete(workout)
        db.session.commit()
        return {'message': 'Workout deleted successfully'}, 200

api.add_resource(WorkoutList, '/workouts')
api.add_resource(SingleWorkout, '/workouts/<int:workout_id>')