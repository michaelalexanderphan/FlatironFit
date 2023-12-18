from app import db

UserWorkout = db.Table('user_workouts',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('workout_id', db.Integer, db.ForeignKey('workouts.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(80), nullable=False)
    profile_image = db.Column(db.String(255))
    contact_info = db.Column(db.String(255))
    bio = db.Column(db.Text)
    
    # Relationship for many-to-many
    workouts = db.relationship('Workout', secondary=UserWorkout, backref=db.backref('users', lazy='dynamic'))
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'
