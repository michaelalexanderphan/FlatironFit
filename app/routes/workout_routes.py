from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.models import Workout, User
from app.schemas import WorkoutSchema
from marshmallow import ValidationError

workout_bp = Blueprint('workout_bp', __name__)
api = Api(workout_bp)
workout_schema = WorkoutSchema()
workouts_schema = WorkoutSchema(many=True)

class WorkoutList(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        if user.role == 'trainer':
            workouts = Workout.query.filter_by(creator_id=user.id).all()
        elif user.role == 'client':
            workouts = Workout.query.filter_by(client_id=user.id).all()
        return workouts_schema.dump(workouts), 200

    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        if user.role != 'trainer':
            return {'message': 'Only trainers can create workouts'}, 403
        json_data = request.get_json()
        try:
            workout_data = workout_schema.load(json_data)
            workout = Workout(creator_id=user.id, **workout_data)
            db.session.add(workout)
            db.session.commit()
            return workout_schema.dump(workout), 201
        except ValidationError as err:
            return err.messages, 422

class WorkoutResource(Resource):
    @jwt_required()
    def put(self, workout_id):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        workout = Workout.query.get_or_404(workout_id)
        if workout.creator_id != user.id:
            return {'message': 'Unauthorized to modify this workout'}, 403
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
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        workout = Workout.query.get_or_404(workout_id)
        if workout.creator_id != user.id:
            return {'message': 'Unauthorized to delete this workout'}, 403
        db.session.delete(workout)
        db.session.commit()
        return {'message': 'Workout deleted successfully'}, 200

class AssignWorkout(Resource):
    @jwt_required()
    def post(self, workout_id):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        workout = Workout.query.get_or_404(workout_id)
        if workout.creator_id != user.id:
            return {'message': 'Unauthorized to assign this workout'}, 403
        json_data = request.get_json()
        client_id = json_data.get('client_id')
        client = User.query.get(client_id)
        if not client or client.role != 'client':
            return {'message': 'Invalid client ID'}, 404
        workout.client_id = client_id
        db.session.commit()
        return {'message': f'Workout {workout_id} assigned to client {client_id}'}, 200

api.add_resource(WorkoutList, '/workouts')
api.add_resource(WorkoutResource, '/workouts/<int:workout_id>')
api.add_resource(AssignWorkout, '/workouts/<int:workout_id>/assign')
