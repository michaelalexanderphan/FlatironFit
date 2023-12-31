from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required
from app import db
from app.models.models import Exercise, WorkoutExercise
from app.schemas import ExerciseSchema

exercise_bp = Blueprint('exercise_bp', __name__)
api = Api(exercise_bp)
exercise_schema = ExerciseSchema()
exercises_schema = ExerciseSchema(many=True)

class ExerciseList(Resource):
    @jwt_required()
    def get(self):
        exercises = Exercise.query.all()
        return exercises_schema.dump(exercises), 200

    @jwt_required()
    def post(self):
        json_data = request.get_json()
        try:
            exercise_data = exercise_schema.load(json_data)
            new_exercise = Exercise(**exercise_data)
            db.session.add(new_exercise)
            db.session.commit()
            return exercise_schema.dump(new_exercise), 201
        except Exception as err:
            return err.messages, 422

class ExerciseResource(Resource):
    @jwt_required()
    def put(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        json_data = request.get_json()
        try:
            exercise_data = exercise_schema.load(json_data, partial=True)
            for key, value in exercise_data.items():
                setattr(exercise, key, value)
            db.session.commit()
            return exercise_schema.dump(exercise), 200
        except Exception as err:
            return err.messages, 422
    @jwt_required()
    def get(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        return exercise_schema.dump(exercise), 200

    @jwt_required()
    def delete(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        WorkoutExercise.query.filter_by(exercise_id=exercise_id).delete()
        db.session.delete(exercise)
        db.session.commit()
        return {'message': 'Exercise deleted successfully'}, 200
    
    @jwt_required()
    def patch(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        json_data = request.get_json()

        # Check and update each field in the Exercise model
        if 'name' in json_data:
            exercise.name = json_data['name']
        if 'description' in json_data:
            exercise.description = json_data['description']
        if 'difficulty' in json_data:
            exercise.difficulty = json_data['difficulty']
        if 'body_part' in json_data:
            exercise.body_part = json_data['body_part']
        if 'youtube_url' in json_data:
            exercise.youtube_url = json_data['youtube_url']

        db.session.commit()
        return exercise_schema.dump(exercise), 200

api.add_resource(ExerciseList, '/exercises')
api.add_resource(ExerciseResource, '/exercises/<int:exercise_id>')