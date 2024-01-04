from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.orm import validates
from urllib.parse import urlparse
import bcrypt
import re

UserWorkout = db.Table('user_workouts',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('workout_id', db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
)

class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercises'
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), primary_key=True)
    reps = db.Column(db.String(10))
    sets = db.Column(db.Integer)
    rest = db.Column(db.String(10))

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(80), nullable=False)
    contact_info = db.Column(db.String(255))
    bio = db.Column(db.Text)
    workouts = db.relationship('Workout', secondary=UserWorkout, lazy='dynamic')
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id')
    messages_received = db.relationship('Message', foreign_keys='Message.receiver_id')
    secret_code = db.Column(db.String(255))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @validates('username', 'email')
    def validate(self, key, value):
        if key == 'username':
            if not (3 <= len(value) <= 80):
                raise ValueError('Username must be between 3 and 80 characters')
        if key == 'email':
            if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
                raise ValueError('Invalid email address')
        return value

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    exercises = db.relationship('WorkoutExercise', backref='workout', lazy='dynamic')

class Exercise(db.Model):
    __tablename__ = 'exercises'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    body_part = db.Column(db.String(100), nullable=True)
    difficulty = db.Column(db.String(50), nullable=True)
    youtube_url = db.Column(db.String(255), nullable=True)
    workout_exercises = db.relationship('WorkoutExercise', backref='exercise', lazy='dynamic')

    def is_valid_youtube_url(self):
        parsed_url = urlparse(self.youtube_url)
        return all([parsed_url.scheme, parsed_url.netloc, "youtube" in parsed_url.netloc])

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
