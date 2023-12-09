from app import db

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Add fields for exercise details like type, difficulty, etc.
    
    def __repr__(self):
        return '<Exercise {}>'.format(self.name)
