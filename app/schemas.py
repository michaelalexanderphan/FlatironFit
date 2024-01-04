from marshmallow import Schema, fields, validate, validates, ValidationError
from app.models.models import User
from urllib.parse import urlparse
import re

class ExerciseSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=100))
    description = fields.Str(validate=validate.Length(max=2000))
    body_part = fields.Str(validate=validate.Length(max=100))
    difficulty = fields.Str(validate=validate.Length(max=50))
    youtube_url = fields.Str(validate=validate.Length(max=255))

    @validates('youtube_url')
    def validate_youtube_url(self, value):
        if value:
            parsed_url = urlparse(value)
            if not (parsed_url.scheme and parsed_url.netloc and "youtube" in parsed_url.netloc):
                raise ValidationError('Invalid YouTube URL')

class MessageSchema(Schema):
    id = fields.Int(dump_only=True)
    sender_id = fields.Int(required=True)
    receiver_id = fields.Int(required=True)
    content = fields.Str(required=True, validate=validate.Length(min=1))
    timestamp = fields.DateTime(dump_only=True)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True, validate=validate.Length(min=6))
    role = fields.Str(required=True, validate=validate.OneOf(["trainer", "client"]))
    contact_info = fields.Str()
    bio = fields.Str()
    password_hash = fields.Str(dump_only=True)
    secret_code = fields.Str(load_only=True)

    @validates('username')
    def validate_username(self, value):
        if not re.match(r'^\w+$', value):
            raise ValidationError('Username must contain only alphanumeric characters and underscores.')

    @validates('email')
    def validate_email(self, value):
        pattern = r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
        if not re.match(pattern, value, re.IGNORECASE):
            raise ValidationError('Invalid email address')

class WorkoutSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(max=100))
    description = fields.Str(validate=validate.Length(max=2000))
    created_by = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    exercise_name = fields.Str()
    reps = fields.Int()
    sets = fields.Int()
    rest_duration = fields.Int()
    client_id = fields.Int()

    @validates('exercise_name')
    def validate_exercise_name(self, value):
        if not value.strip():
            raise ValidationError('Exercise name must not be blank.')

    @validates('reps')
    def validate_reps(self, value):
        if value <= 0:
            raise ValidationError('Reps must be a positive integer.')

    @validates('sets')
    def validate_sets(self, value):
        if value <= 0:
            raise ValidationError('Sets must be a positive integer.')

    @validates('rest_duration')
    def validate_rest_duration(self, value):
        if value < 0:
            raise ValidationError('Rest duration must be a non-negative integer.')

    @validates('client_id')
    def validate_client_id(self, value):
        user = User.query.get(value)
        if not user or user.role != 'client':
            raise ValidationError('Invalid client ID.')
