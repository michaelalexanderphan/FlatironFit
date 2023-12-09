from app import db

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    body_part = db.Column(db.String(100), nullable=True)  # Body part targeted by the exercise
    difficulty = db.Column(db.String(50), nullable=True)  # Difficulty level (e.g., Beginner, Intermediate, Advanced)
    form_explanation = db.Column(db.Text, nullable=True)  # Textual explanation of the proper form
    youtube_url = db.Column(db.String(255), nullable=True)  # URL to a YouTube video demonstrating the exercise
    
    def __repr__(self):
        return f'<Exercise {self.name}>'

    def to_dict(self):
        """Return a dictionary representation of the exercise."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'body_part': self.body_part,
            'difficulty': self.difficulty,
            'form_explanation': self.form_explanation,
            'youtube_url': self.youtube_url
        }
