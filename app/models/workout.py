from app import db

class Workout(db.Model):
    __tablename__ = 'workouts'

    # Database fields
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    # Include additional fields like duration, difficulty, etc.

    # Representation method for the model
    def __repr__(self):
        return f'<Workout {self.title}>'
