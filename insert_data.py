from app import create_app, db
from app.models.models import Exercise

app = create_app()
app.app_context().push()

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
    },

    # Add 3 back workouts
    {
        "name": "Deadlift",
        "description": "The deadlift is a compound exercise that works the muscles of the back and legs.",
        "body_part": "back",
        "difficulty": "hard",
        "youtube_url": "https://www.youtube.com/watch?v=I2boB6kRqeU"
    },
    {
        "name": "Pull-Ups",
        "description": "Pull-ups are a bodyweight exercise that targets the upper back and lats.",
        "body_part": "back",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=4tddNt12Pqc"
    },
    {
        "name": "T-Bar Rows",
        "description": "T-bar rows are a compound exercise for building a strong back.",
        "body_part": "back",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=UiAC_vR5NvY"
    },

    # Add 3 bicep workouts
    {
        "name": "Barbell Curls",
        "description": "Barbell curls are a classic bicep exercise for building arm strength.",
        "body_part": "biceps",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=0326dy_-CzM"
    },
    {
        "name": "Hammer Curls",
        "description": "Hammer curls target the biceps and brachialis muscles for arm development.",
        "body_part": "biceps",
        "difficulty": "easy",
        "youtube_url": "https://www.youtube.com/watch?v=vgCBkUsD2f0"
    },
    {
        "name": "Preacher Curls",
        "description": "Preacher curls isolate the biceps for focused strength training.",
        "body_part": "biceps",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=d_KZxkY_0cM"
    },

    # Add 5 leg workouts
    {
        "name": "Squats",
        "description": "Squats are a compound exercise that targets the legs and glutes.",
        "body_part": "legs",
        "difficulty": "hard",
        "youtube_url": "https://www.youtube.com/watch?v=I2boB6kRqeU"
    },
    {
        "name": "Lunges",
        "description": "Lunges are a great leg exercise for building strength and stability.",
        "body_part": "legs",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=4tddNt12Pqc"
    },
    {
        "name": "Leg Press",
        "description": "Leg press machine exercises target the quadriceps and glutes.",
        "body_part": "legs",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=UiAC_vR5NvY"
    },
    {
        "name": "Calf Raises",
        "description": "Calf raises focus on strengthening the calf muscles for lower leg development.",
        "body_part": "legs",
        "difficulty": "easy",
        "youtube_url": "https://www.youtube.com/watch?v=0326dy_-CzM"
    },
    {
        "name": "Deadlift",
        "description": "The deadlift is a compound exercise that works the muscles of the back and legs.",
        "body_part": "legs",
        "difficulty": "hard",
        "youtube_url": "https://www.youtube.com/watch?v=I2boB6kRqeU"
    },

    # Add 3 core exercises
    {
        "name": "Plank",
        "description": "The plank is a core-strengthening exercise that improves stability.",
        "body_part": "core",
        "difficulty": "easy",
        "youtube_url": "https://www.youtube.com/watch?v=vgCBkUsD2f0"
    },
    {
        "name": "Russian Twists",
        "description": "Russian twists work the obliques and help tone the core.",
        "body_part": "core",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=d_KZxkY_0cM"
    },
    {
        "name": "Hanging Leg Raises",
        "description": "Hanging leg raises target the lower abdominal muscles.",
        "body_part": "core",
        "difficulty": "medium",
        "youtube_url": "https://www.youtube.com/watch?v=d_KZxkY_0cM"
    }
]

def insert_dummy_exercises():
    try:
        for exercise_data in exercise_data_list:
            existing_exercise = Exercise.query.filter_by(name=exercise_data["name"]).first()
            if not existing_exercise:
                new_exercise = Exercise(**exercise_data)
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
