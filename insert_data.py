from app import create_app, db
from app.models.models import Exercise

exercise_data = {
    "name": "Push Up",
    "description": "A push-up is a common calisthenics exercise beginning from the prone position.",
    "body_part": "chest",
    "difficulty": "easy",
    "youtube_url": "https://www.youtube.com/watch?v=IODxDxX7oi4"
}

def insert_exercise():
    try:
        new_exercise = Exercise(**exercise_data)
        db.session.add(new_exercise)
        db.session.commit()
        print("Exercise data inserted successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error inserting exercise data: {str(e)}")
    finally:
        db.session.close()
