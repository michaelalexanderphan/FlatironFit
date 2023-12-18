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
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope="module")
def client(app):
    return app.test_client()

@pytest.fixture(scope="module")
def init_database():
    hashed_password = generate_password_hash('testpassword')
    user = User(username='testuser', email='test@test.com', password_hash=hashed_password, role='client')

    db.session.add(user)
    db.session.commit()

    yield db

    db.session.remove()
    db.drop_all()

def test_register(client, init_database):
    response = client.post('/api/auth/register', json={
        'username': 'newuser',
        'email': 'newuser@test.com',
        'password': 'newpassword',
        'role': 'client'
    })
    assert response.status_code == 201

def test_login(client, init_database):
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 200

def get_auth_token(client):
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    return response.json['access_token']

def test_logout(client, init_database):
    token = get_auth_token(client)
    response = client.post('/api/auth/logout', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_token_refresh(client, init_database):
    token = get_auth_token(client)
    refresh_token = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    }).json['refresh_token']
    response = client.post('/api/auth/token/refresh', headers={'Authorization': f'Bearer {refresh_token}'})
    assert response.status_code == 200

def test_get_exercise_list(client, init_database):
    token = get_auth_token(client)
    response = client.get('/api/exercises', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_create_exercise(client, init_database):
    token = get_auth_token(client)
    response = client.post('/api/exercises/exercises', json={
        'name': 'Squat',
        'description': 'A basic squat exercise',
        'body_part': 'legs',
        'difficulty': 'medium',
        'youtube_url': 'https://www.youtube.com/watch?v=aclHkVaku9U'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201

def test_get_single_exercise(client, init_database):
    token = get_auth_token(client)
    response = client.get('/api/exercises/exercises/1', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_update_exercise(client, init_database):
    token = get_auth_token(client)
    response = client.put('/api/exercises/exercises/1', json={
        'name': 'Updated Squat',
        'description': 'An updated basic squat exercise'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_delete_exercise(client, init_database):
    token = get_auth_token(client)
    response = client.delete('/api/exercises/exercises/1', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_get_message_list(client, init_database):
    token = get_auth_token(client)
    response = client.get('/api/messages/messages', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_post_message(client, init_database):
    token = get_auth_token(client)
    response = client.post('/api/messages/messages', json={
        'sender_id': 1,
        'receiver_id': 2,
        'content': 'Hello World'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201

def test_delete_message(client, init_database):
    token = get_auth_token(client)
    response = client.delete('/api/messages/messages/1', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_update_message(client, init_database):
    token = get_auth_token(client)
    response = client.put('/api/messages/messages/1', json={
        'content': 'Updated Message'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_get_user(client, init_database):
    token = get_auth_token(client)
    response = client.get('/api/users/users/1', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_update_user(client, init_database):
    token = get_auth_token(client)
    response = client.patch('/api/users/users/1', json={
        'username': 'updateduser',
        'email': 'updateduser@test.com'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_delete_user(client, init_database):
    token = get_auth_token(client)
    response = client.delete('/api/users/users/1', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_get_workout_list(client, init_database):
    token = get_auth_token(client)
    response = client.get('/api/workouts/workouts', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_create_workout(client, init_database):
    token = get_auth_token(client)
    response = client.post('/api/workouts/workouts', json={
        'title': 'Leg Day',
        'description': 'A series of exercises focused on legs'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 201

def test_update_workout(client, init_database):
    token = get_auth_token(client)
    response = client.put('/api/workouts/workouts/1', json={
        'title': 'Updated Leg Day',
        'description': 'An updated series of exercises focused on legs'
    }, headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200

def test_delete_workout(client, init_database):
    token = get_auth_token(client)
    response = client.delete('/api/workouts/workouts/1', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
