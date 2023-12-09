from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(80), nullable=False)  # 'trainer' or 'client'
    
    # Additional fields
    profile_image = db.Column(db.String(255))  # URL to the profile image
    contact_info = db.Column(db.String(255))  # Contact information
    bio = db.Column(db.Text)  # Short biography or description

    # Relationships with other models (if any)
    # For example, a relationship with a Workout or Message model

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Return a dictionary representation of the user."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'profile_image': self.profile_image,
            'contact_info': self.contact_info,
            'bio': self.bio
        }

    def __repr__(self):
        return f'<User {self.username}>'
