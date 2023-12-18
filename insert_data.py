from app import create_app, db
from app.models.models import Exercise

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

def insert_exercise():
    try:
        # Create a new Exercise object and add it to the database
        new_exercise = Exercise(**exercise_data)
        db.session.add(new_exercise)
        db.session.commit()
        print("Exercise data inserted successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error inserting exercise data: {str(e)}")
    finally:
        db.session.close()

if __name__ == "__main__":
    insert_exercise()
