from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()
# Replace this with your actual database URI
database_uri = 'sqlite:////home/michaelphan/Development/code/Final-Project/FlatironFit/instance/flatironfit.db'

engine = create_engine(database_uri)
connection = engine.connect()
print("Connected to database successfully!")
connection.close()


# Print environment variables
print("SECRET_KEY:", os.getenv('SECRET_KEY'))
print("DATABASE_URL:", os.getenv('DATABASE_URL'))
# Add other environment variables as needed
flask_env = os.environ.get('FLASK_ENV')

if flask_env is not None:
    if flask_env == 'development':
        print("FLASK_ENV is set to 'development'. It's correctly configured.")
    else:
        print(f"FLASK_ENV is set to '{flask_env}', but it should be set to 'development'.")
else:
    print("FLASK_ENV is not set. Please make sure to set it to 'development'.")
