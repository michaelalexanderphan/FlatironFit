from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource, reqparse, abort
from flask_jwt_extended import jwt_required
from app import db
from app.models.models import Exercise
from app.schemas import ExerciseSchema
from marshmallow import ValidationError

exercise_bp = Blueprint('exercise_bp', __name__)
api = Api(exercise_bp)
exercise_schema = ExerciseSchema()
exercises_schema = ExerciseSchema(many=True)

class ExerciseList(Resource):
    @jwt_required()
    def get(self):
        exercises = Exercise.query.all()
        serialized_exercises = exercises_schema.dump(exercises)
        return jsonify(serialized_exercises), 200

    @jwt_required()
    def post(self):
        json_data = request.get_json()
        if not json_data:
            return jsonify({'message': 'No input data provided'}), 400
        try:
            exercise_data = exercise_schema.load(json_data)
            new_exercise = Exercise(**exercise_data)
            db.session.add(new_exercise)
            db.session.commit()
            serialized_exercise = exercise_schema.dump(new_exercise)
            return jsonify(serialized_exercise), 201
        except ValidationError as err:
            return jsonify(err.messages), 422

class ExerciseResource(Resource):
    @jwt_required()
    def get(self, exercise_id):
        exercise = Exercise.query.get(exercise_id)
        if exercise is None:
            return abort(404, message="Exercise not found")
        serialized_exercise = exercise_schema.dump(exercise)
        return jsonify(serialized_exercise), 200

    @jwt_required()
    def put(self, exercise_id):
        exercise = Exercise.query.get(exercise_id)
        if exercise is None:
            return abort(404, message="Exercise not found")
        json_data = request.get_json()
        if not json_data:
            return jsonify({'message': 'No input data provided'}), 400
        try:
            exercise_data = exercise_schema.load(json_data, partial=True)
            for key, value in exercise_data.items():
                setattr(exercise, key, value)
            db.session.commit()
            serialized_exercise = exercise_schema.dump(exercise)
            return jsonify(serialized_exercise), 200
        except ValidationError as err:
            return jsonify(err.messages), 422

    @jwt_required()
    def delete(self, exercise_id):
        exercise = Exercise.query.get(exercise_id)
        if exercise is None:
            return abort(404, message="Exercise not found")
        db.session.delete(exercise)
        db.session.commit()
        return jsonify({'message': 'Exercise deleted successfully'}), 200

api.add_resource(ExerciseList, '/exercises')
api.add_resource(ExerciseResource, '/exercises/<int:exercise_id>')
