from app import db

class Exercise(db.Model):
    __tablename__ = 'exercises'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    body_part = db.Column(db.String(100), nullable=True)  
    difficulty = db.Column(db.String(50), nullable=True)  
    youtube_url = db.Column(db.String(255), nullable=True) 
    
    def is_valid_youtube_url(self):
        parsed_url = urlparse(self.youtube_url)
        return all([parsed_url.scheme, parsed_url.netloc, "youtube" in parsed_url.netloc])

    def __repr__(self):
        return f'<Exercise {self.name}>'
