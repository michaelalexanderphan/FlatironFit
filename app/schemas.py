from marshmallow import Schema, fields, validate, pre_load, validates, ValidationError
from werkzeug.security import generate_password_hash
from urllib.parse import urlparse
import re

class ExerciseSchema(Schema):
    id = fields.Int()
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
    id = fields.Int()
    sender_id = fields.Int(required=True)
    receiver_id = fields.Int(required=True)
    content = fields.Str(required=True)
    timestamp = fields.DateTime()

class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str(required=True, validate=validate.Length(max=80))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    role = fields.Str(required=True, validate=validate.OneOf(["trainer", "client"]))
    contact_info = fields.Str()
    bio = fields.Str()
    password_hash = fields.Str(dump_only=True)

    @validates('email')
    def validate_email(self, value):
        pattern = r'^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$'
        if not re.match(pattern, value, re.IGNORECASE):
            raise ValidationError('Invalid email address')


class WorkoutSchema(Schema):
    id = fields.Int()
    title = fields.Str(required=True, validate=validate.Length(max=100))
    description = fields.Str()
    created_by = fields.Int()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
