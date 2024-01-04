from app import create_app, db
from app.models.models import Exercise

# Create a Flask application context
app = create_app()
app.app_context().push()

# Define a list of exercise data
exercise_data_list = [
    {
        "name": "Bench Press",
        "description": "The bench press is a weight training exercise in which a barbell is pressed overhead from a supine position.",
        "body_part": "chest",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=I2boB6kRqeU"
    },
    {
        "name": "Incline Dumbbell Press",
        "description": "Incline dumbbell press is a variation of the bench press, targeting the upper chest.",
        "body_part": "chest",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=4tddNt12Pqc"
    },
    {
        "name": "Chest Flies",
        "description": "Chest flies, also known as pec flies, are isolation exercises for the chest muscles.",
        "body_part": "chest",
        "difficulty": "easy",
        "youtube_url": "https://www.youtube.com/watch?v=UiAC_vR5NvY"
    },
    {
        "name": "Tricep Dips",
        "description": "Tricep dips are bodyweight exercises targeting the triceps muscle.",
        "body_part": "triceps",
        "difficulty": "easy",
        "youtube_url": "https://www.youtube.com/watch?v=0326dy_-CzM"
    },
    {
        "name": "Tricep Push Downs",
        "description": "Tricep push downs are a cable machine exercise for the triceps.",
        "body_part": "triceps",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=vgCBkUsD2f0"
    },
    {
        "name": "Skull Crushers",
        "description": "Skull crushers, also known as lying tricep extensions, are weightlifting exercises for the triceps.",
        "body_part": "triceps",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=d_KZxkY_0cM"
    }
]

def insert_dummy_exercises():
    try:
        for exercise_data in exercise_data_list:
            # Query the database to check if the exercise already exists
            existing_exercise = Exercise.query.filter_by(name=exercise_data["name"]).first()

            if not existing_exercise:
                # Create a new Exercise object
                new_exercise = Exercise(**exercise_data)

                # Add the exercise to the database
                db.session.add(new_exercise)
                db.session.commit()
                print(f"'{exercise_data['name']}' exercise data inserted successfully.")
            else:
                print(f"'{exercise_data['name']}' exercise already exists in the database.")
    except Exception as e:
        db.session.rollback()
        print(f"Error inserting exercises data: {str(e)}")
    finally:
        db.session.close()

if __name__ == "__main__":
    insert_dummy_exercises()
