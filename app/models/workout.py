from app import db

class Workout(db.Model):
    __tablename__ = 'workouts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationship to link users to their workouts
    users = db.relationship('User', backref='workouts', lazy=True)

    def __repr__(self):
        return '<Workout {}>'.format(self.title)
