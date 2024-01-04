from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.models import Workout, User, Exercise, WorkoutExercise
from app.schemas import WorkoutSchema, UserSchema

workout_bp = Blueprint('workout_bp', __name__)
api = Api(workout_bp)

class WorkoutList(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        workouts = Workout.query.filter((Workout.created_by == user.id) | (Workout.client_id == user.id)).all()
        return WorkoutSchema(many=True).dump(workouts), 200

    @jwt_required()
    def post(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        json_data = request.get_json()
        workout = Workout(title=json_data['title'], description=json_data['description'], created_by=user.id)
        db.session.add(workout)
        db.session.flush()
        for ex_data in json_data.get('exercises', []):
            exercise = Exercise.query.get(ex_data['exercise_id'])
            workout_exercise = WorkoutExercise(workout=workout, exercise=exercise, reps=ex_data['reps'], sets=ex_data['sets'], rest=ex_data['rest_duration'])  # Fix 'rest' to 'rest_duration'
            db.session.add(workout_exercise)
        db.session.commit()
        return WorkoutSchema().dump(workout), 201

class WorkoutResource(Resource):
    @jwt_required()
    def get(self, workout_id):
        current_user = get_jwt_identity()
        workout = Workout.query.get_or_404(workout_id)
        return WorkoutSchema().dump(workout), 200

    @jwt_required()
    def put(self, workout_id):
        current_user = get_jwt_identity()
        workout = Workout.query.get_or_404(workout_id)
        json_data = request.get_json()
        workout.title = json_data['title']
        workout.description = json_data['description']
        db.session.query(WorkoutExercise).filter(WorkoutExercise.workout_id == workout.id).delete()
        for ex_data in json_data.get('exercises', []):
            exercise = Exercise.query.get(ex_data['exercise_id'])
            workout_exercise = WorkoutExercise(workout=workout, exercise=exercise, reps=ex_data['reps'], sets=ex_data['sets'], rest=ex_data['rest_duration'])  # Fix 'rest' to 'rest_duration'
            db.session.add(workout_exercise)
        db.session.commit()
        return WorkoutSchema().dump(workout), 200

    @jwt_required()
    def delete(self, workout_id):
        current_user = get_jwt_identity()
        workout = Workout.query.get_or_404(workout_id)
        
        # Delete associated WorkoutExercise records
        db.session.query(WorkoutExercise).filter(WorkoutExercise.workout_id == workout.id).delete()

        # Now delete the Workout instance
        db.session.delete(workout)
        db.session.commit()
        return {'message': 'Workout deleted successfully'}, 200

class AssignWorkout(Resource):
    @jwt_required()
    def post(self, workout_id):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        workout = Workout.query.get(workout_id)
        json_data = request.get_json()
        workout.client_id = json_data.get('client_id')
        db.session.commit()
        return {'message': f'Workout {workout_id} assigned to client {workout.client_id}'}, 200

class ClientList(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user)
        clients = User.query.filter_by(role='client').all()
        return UserSchema(many=True).dump(clients), 200

class WorkoutExercises(Resource):
    @jwt_required()
    def get(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        workout_exercises = WorkoutExercise.query.filter_by(workout_id=workout.id).all()
        exercises_data = []
        for we in workout_exercises:
            exercise = Exercise.query.get(we.exercise_id)
            if exercise:
                exercises_data.append({
                    'exercise_id': we.exercise_id,
                    'name': exercise.name,
                    'reps': we.reps,
                    'sets': we.sets,
                    'rest_duration': we.rest  # Fix 'rest' to 'rest_duration'
                })
            else:
                exercises_data.append({
                    'exercise_id': we.exercise_id,
                    'name': 'Unknown Exercise',
                    'reps': we.reps,
                    'sets': we.sets,
                    'rest_duration': we.rest  # Fix 'rest' to 'rest_duration'
                })
        return exercises_data, 200

api.add_resource(WorkoutList, '/workouts')
api.add_resource(WorkoutResource, '/workouts/<int:workout_id>')
api.add_resource(AssignWorkout, '/workouts/<int:workout_id>/assign')
api.add_resource(ClientList, '/clients')
api.add_resource(WorkoutExercises, '/workouts/<int:workout_id>/exercises')
