from flask import Flask

app = Flask(__name__)

# Import routes to register them
from app import routes
