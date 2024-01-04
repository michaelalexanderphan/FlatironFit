from flask import Blueprint, request
from flask_restful import Api, Resource
from flask_jwt_extended import jwt_required
from app import db
from app.models.models import Exercise
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
    def delete(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        db.session.delete(exercise)
        db.session.commit()
        return {'message': 'Exercise deleted successfully'}, 200

api.add_resource(ExerciseList, '/exercises')
api.add_resource(ExerciseResource, '/exercises/<int:exercise_id>')
