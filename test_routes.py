import pytest
from flask_testing import TestCase
from app import create_app, db
from app.models.models import User, Workout, Exercise, Message, UserWorkout
from werkzeug.security import generate_password_hash

class TestBase(TestCase):
    def create_app(self):
        app = create_app()
        app.config.update(
            SQLALCHEMY_DATABASE_URI='sqlite:///:memory:',
            TESTING=True,
            WTF_CSRF_ENABLED=False,
            SECRET_KEY='testsecret'
        )
        return app

    def setUp(self):
        db.create_all()
        hashed_password = generate_password_hash('testpassword')  # Hash the test password here
        user = User(username='testuser', email='test@test.com', password_hash=hashed_password, role='client')
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

class TestAuthRoutes(TestBase):
    def login(self):
        return self.client.post('/api/auth/login', json={
            'username': 'testuser',
            'password': 'testpassword'
        })

    def test_register(self):
        response = self.client.post('/api/auth/register', json={
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'newpassword',
            'role': 'client'
        })
        assert response.status_code == 201

    def test_login(self):
        response = self.login()
        assert response.status_code == 200

    def test_logout(self):
        login_response = self.login()
        token = login_response.json['access_token']
        response = self.client.post('/api/auth/logout', headers={'Authorization': f'Bearer {token}'})
        assert response.status_code == 200

    def test_token_refresh(self):
        login_response = self.login()
        refresh_token = login_response.json['refresh_token']
        response = self.client.post('/api/auth/token/refresh', headers={'Authorization': f'Bearer {refresh_token}'})
        assert response.status_code == 200

class TestExerciseRoutes(TestBase):
    def test_get_exercise_list(self):
        response = self.client.get('/api/exercises')
        assert response.status_code == 200

    def test_create_exercise(self):
        response = self.client.post('/api/exercises', json={
            'name': 'Squat',
            'description': 'A basic squat exercise',
            'body_part': 'legs',
            'difficulty': 'medium',
            'youtube_url': 'https://www.youtube.com/watch?v=aclHkVaku9U'
        })
        assert response.status_code == 201

    def test_get_single_exercise(self):
        response = self.client.get('/api/exercises/1')
        assert response.status_code == 200

    def test_update_exercise(self):
        response = self.client.put('/api/exercises/1', json={
            'name': 'Updated Squat',
            'description': 'An updated basic squat exercise'
        })
        assert response.status_code == 200

    def test_delete_exercise(self):
        response = self.client.delete('/api/exercises/1')
        assert response.status_code == 200

class TestMessageRoutes(TestBase):
    def test_get_message_list(self):
        response = self.client.get('/api/messages')
        assert response.status_code == 200

    def test_post_message(self):
        response = self.client.post('/api/messages', json={
            'sender_id': 1,
            'receiver_id': 2,
            'content': 'Hello World'
        })
        assert response.status_code == 201

    def test_delete_message(self):
        response = self.client.delete('/api/messages/1')
        assert response.status_code == 200

    def test_update_message(self):
        response = self.client.put('/api/messages/1', json={
            'content': 'Updated Message'
        })
        assert response.status_code == 200

class TestUserRoutes(TestBase):
    def test_get_user(self):
        response = self.client.get('/api/users/1')
        assert response.status_code == 200

    def test_update_user(self):
        response = self.client.patch('/api/users/1', json={
            'username': 'updateduser',
            'email': 'updateduser@test.com'
        })
        assert response.status_code == 200

    def test_delete_user(self):
        response = self.client.delete('/api/users/1')
        assert response.status_code == 200

class TestWorkoutRoutes(TestBase):
    def test_get_workout_list(self):
        response = self.client.get('/api/workouts')
        assert response.status_code == 200

    def test_create_workout(self):
        response = self.client.post('/api/workouts', json={
            'title': 'Leg Day',
            'description': 'A series of exercises focused on legs'
        })
        assert response.status_code == 201

    def test_update_workout(self):
        response = self.client.put('/api/workouts/1', json={
            'title': 'Updated Leg Day',
            'description': 'An updated series of exercises focused on legs'
        })
        assert response.status_code == 200

    def test_delete_workout(self):
        response = self.client.delete('/api/workouts/1')
        assert response.status_code == 200
