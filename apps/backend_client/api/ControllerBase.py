from flask import Flask, jsonify, request

class BaseController:
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        pass

    def get(self, *args, **kwargs):
        return jsonify(message='GET method not implemented'), 501

    def post(self, *args, **kwargs):
        return jsonify(message='POST method not implemented'), 501

    def put(self, *args, **kwargs):
        return jsonify(message='PUT method not implemented'), 501

    def delete(self, *args, **kwargs):
        return jsonify(message='DELETE method not implemented'), 501

app = Flask(__name__)

class SampleController(BaseController):
    def get(self, *args, **kwargs):
        return jsonify(message='GET request handled successfully')


@app.route('/sample', methods=['GET'])
def sample_route():
    return sample_controller.get()

# Initialize the SampleController with the Flask app
sample_controller = SampleController(app)

if __name__ == '__main__':
    app.run(debug=True)
