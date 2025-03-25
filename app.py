from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from urllib.parse import quote


app = Flask(__name__)
CORS(app) #allows requests requests from different servers

key = "AIzaSyDaTHaEQ1jwYb-FZSwk-NVJgP9c0PzjS7E"
GEOLOCATION_URL = 'https://www.googleapis.com/geolocation/v1/geolocate'


#when /get_location is accesed, POST requests is sent to Geoloc API, data is extracted, info is returned as JSON response

@app.route('/get_location', methods=['GET'])
def get_location():
    #Google API requires header telling server we sending JSON and a payload to infer location w IP ady
    #you can name headers and payload something different(just common lang)
    try:
        headers = {
            'Content-Type': 'application/json' #spec    ify body is in JSON format
        }
        
        payload = { # payload just means body of the request
            'considerIp': 'true'  #tells API to infer locatio based on IP addy if no other data
        }
        
        response = requests.post(  #post request to geolocation url
            f'{GEOLOCATION_URL}?key={key}',
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200: #check if API request is succesful
            data = response.json() #make data the response in JSON format
            
            return jsonify({
                "latitude": data['location']['lat'],
                "longitude": data['location']['lng'],
                "accuracy": data['accuracy']  # Accuracy radius in meters
            }), data 
        else: #if API has response has error..
            error_message = response.json().get('error', {}).get('message', 'Unknown error')
            return jsonify({
                "error": f"Google Geolocation API error: {error_message}"
            }), response.status_code
            
    #handle unexpected excpetions         
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

