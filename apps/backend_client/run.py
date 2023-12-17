"""

Run file for orchestrating the back-end of tuna-service.

"""
from api.ControllerBase import BaseController
from flask import Flask, jsonify
from service.dataAccessServices.SightingAccessService import SightingAccessService
import sqlite3
from sqlite3 import Connection, Cursor, Error

__db_file = r"./pythonsqlite.db"
def create_connection():
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(__db_file)
        return conn
    except Error as e:
        print(e)

    return conn


app = Flask(__name__)

class SampleController(BaseController):
    def get(self, *args, **kwargs):
        conn = create_connection()
        sightingAccessService = SightingAccessService(conn)
        result = str(sightingAccessService.getAllSightings())
        conn.close()
        return jsonify(message=result)


@app.route('/sample', methods=['GET'])
def sample_route():
    return sample_controller.get()

# Initialize the SampleController with the Flask app
sample_controller = SampleController(app)


if __name__ == '__main__':
    app.run(debug=True)

