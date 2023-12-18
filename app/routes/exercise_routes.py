from flask import Blueprint, request, jsonify
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

    @jwt_required()
    def post(self):
        json_data = request.get_json()
        if not json_data:
            return jsonify({'message': 'No input data provided'}), 400
        try:
            exercise_data = exercise_schema.load(json_data)
            current_user_id = get_jwt_identity()
            exercise_data['user_id'] = current_user_id
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
        json_data = request.get_json()
        if not json_data:
            return jsonify({'message': 'No input data provided'}), 400
        try:
            exercise_data = exercise_schema.load(json_data, partial=True)
            current_user_id = get_jwt_identity()
            exercise = Exercise.query.filter_by(id=exercise_id, user_id=current_user_id).first_or_404()
            for key, value in exercise_data.items():
                setattr(exercise, key, value)
            db.session.commit()
            serialized_exercise = exercise_schema.dump(exercise)
            return jsonify(serialized_exercise), 200
        except ValidationError as err:
            return jsonify(err.messages), 422

    @jwt_required()
    def delete(self, exercise_id):
        db.session.delete(exercise)
        db.session.commit()
        return jsonify({'message': 'Exercise deleted successfully'}), 200

api.add_resource(ExerciseList, '/exercises')
api.add_resource(ExerciseResource, '/exercises/<int:exercise_id>')
