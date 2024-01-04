from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy.orm import validates
from urllib.parse import urlparse
import re

class UserWorkout(db.Model):
    __tablename__ = 'user_workouts'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
    user = db.relationship("User", back_populates="user_workouts")
    workout = db.relationship("Workout", back_populates="workout_users")
class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercises'
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercises.id'), primary_key=True)
    reps = db.Column(db.String(10))
    sets = db.Column(db.Integer)
    rest = db.Column(db.String(10))
    workout = db.relationship("Workout", back_populates="workout_exercises")
    exercise = db.relationship("Exercise", back_populates="exercise_workouts")

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(80), nullable=False)
    contact_info = db.Column(db.String(255))
    bio = db.Column(db.Text)
    secret_code = db.Column(db.String(255))
    user_workouts = db.relationship("UserWorkout", back_populates="user")
    workouts_created = db.relationship('Workout', foreign_keys='Workout.created_by', backref='creator', lazy='dynamic')
    workouts_assigned = db.relationship('Workout', foreign_keys='Workout.client_id', backref='client', lazy='dynamic')
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy='dynamic')
    messages_received = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy='dynamic')

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
    workout_users = db.relationship("UserWorkout", back_populates="workout")
    workout_exercises = db.relationship("WorkoutExercise", back_populates="workout")
    clients = db.relationship('User', secondary='user_workouts', backref=db.backref('workouts', lazy='dynamic'), lazy='dynamic')

class Exercise(db.Model):
    __tablename__ = 'exercises'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    body_part = db.Column(db.String(100), nullable=True)
    difficulty = db.Column(db.String(50), nullable=True)
    youtube_url = db.Column(db.String(255), nullable=True)
    exercise_workouts = db.relationship("WorkoutExercise", back_populates="exercise")

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
