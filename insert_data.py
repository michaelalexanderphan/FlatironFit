from app import create_app, db
from app.models.models import Workout, Exercise, User

# Create a Flask application context
app = create_app()
app.app_context().push()

# Define the exercise data
exercise_data = {
    "name": "Push Up",
    "description": "A push-up is a common calisthenics exercise beginning from the prone position.",
    "body_part": "chest",
    "difficulty": "easy",
    "youtube_url": "https://www.youtube.com/watch?v=IODxDxX7oi4"
}

# Define the workout data
workout_data = {
    "title": "Push Up Workout",
    "description": "A workout plan focused on Push Ups.",
    "created_by": 3,  # Set the created_by user ID to 3
}

def insert_push_up_workout():
    try:
        # Query the database to get the "Push Up" exercise
        push_up_exercise = Exercise.query.filter_by(name="Push Up").first()

        # Query the database to get the user with ID 3
        user = User.query.get(3)

        if push_up_exercise and user:
            # Create a new Workout object
            new_workout = Workout(**workout_data)

            # Add the "Push Up" exercise to the workout
            new_workout.exercises.append(push_up_exercise)

            # Set the created_by user for the workout
            new_workout.created_by = user.id

            # Add the workout to the database
            db.session.add(new_workout)
            db.session.commit()
            print("Push Up Workout data inserted successfully.")
        else:
            print("Push Up exercise or user with ID 3 not found in the database.")
    except Exception as e:
        db.session.rollback()
        print(f"Error inserting Push Up Workout data: {str(e)}")
    finally:
        db.session.close()

if __name__ == "__main__":
    insert_push_up_workout()
