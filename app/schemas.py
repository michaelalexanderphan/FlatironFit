from marshmallow import Schema, fields, validate, pre_load, validates, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime
from urllib.parse import urlparse

class ExerciseSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=100))
    description = fields.Str(validate=validate.Length(max=2000))
    body_part = fields.Str(validate=validate.Length(max=100))
    difficulty = fields.Str(validate=validate.Length(max=50))
    youtube_url = fields.Str(validate=validate.Length(max=255))

    @pre_load
    def validate_youtube_url(self, data, **kwargs):
        if 'youtube_url' in data:
            parsed_url = urlparse(data['youtube_url'])
            if not (parsed_url.scheme and parsed_url.netloc and "youtube" in parsed_url.netloc):
                raise ValidationError('Invalid YouTube URL')
        return data

class MessageSchema(Schema):
    id = fields.Int(dump_only=True)
    sender_id = fields.Int(required=True)
    receiver_id = fields.Int(required=True)
    content = fields.Str(required=True)
    timestamp = fields.DateTime(default=datetime.utcnow, dump_only=True)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(max=80))
    email = fields.Email(required=True, validate=validate.Length(max=120))
    password = fields.Str(load_only=True, required=True, validate=validate.Length(min=6))
    role = fields.Str(required=True, validate=validate.OneOf(["trainer", "client"]))
    # profile_image = fields.Str()
    contact_info = fields.Str()
    bio = fields.Str()

    @pre_load
    def process_input(self, data, **kwargs):
        data = data.copy()
        if 'password' in data:
            data['password_hash'] = generate_password_hash(data.pop('password'))
        return data

    @validates('email')
    def validate_email(self, value):
        pattern = r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
        if not re.match(pattern, value, re.IGNORECASE):
            raise ValidationError('Invalid email address')
        return value

class WorkoutSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(max=100))
    description = fields.Str()
    created_by = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True, default=lambda: datetime.utcnow())
    updated_at = fields.DateTime(dump_only=True, default=lambda: datetime.utcnow())
