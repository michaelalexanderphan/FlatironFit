from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    # Define the tablename if you want it to be different from the class name
    __tablename__ = 'users'

    # Database fields
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    # Include additional fields such as email, profile image, etc.

    # Method to set user's password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Method to check user's password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Representation method for the model
    def __repr__(self):
        return f'<User {self.username}>'
