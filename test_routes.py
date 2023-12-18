import pytest
from app import create_app, db
from werkzeug.security import generate_password_hash
from app.models.models import User

@pytest.fixture(scope="module")
def app():
    app = create_app()
    app.config.update({
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'TESTING': True,
        'WTF_CSRF_ENABLED': False,
        'SECRET_KEY': 'testsecret'
    })
    with app.app_context():
        db.create_all()

