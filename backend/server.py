from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

@app.route('/api/data')
def get_data():
    return jsonify({'message': 'Data from Flask!'})

if __name__ == '__main__':
    app.run(debug=True)