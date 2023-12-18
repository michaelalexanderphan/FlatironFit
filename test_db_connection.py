from app.models.exercise import Exercise
from app.models.message import Message
from app.models.models import User
from app.models.workout import Workout

try:
    # Attempt to import and print the database models
    print("Importing database models...")

    print("Exercise model:", Exercise)
    print("Message model:", Message)
    print("User model:", User)
    print("Workout model:", Workout)

    print("Database models imported successfully.")

except ImportError as e:
    print("Error importing database models:", e)
