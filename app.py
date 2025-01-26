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
    
#ADD THESE PARAMETERS LATER: mode -> walking, language -> choose based on user
@app.route('/directions', methods = ['GET'])
def get_terminal_directions():

    if request.method == 'GET':
        print(f"Request args: {request.args}")
        terminal = request.args.get('terminal')
        if not terminal:
            return jsonify({"error": "Missing 'terminal' query parameter"}), 400


        _, location_data = get_location()

        #latitude = data['location']['lat']
        #longitude = data['location']['lng']
    
        latitude = 41.97750594826151
        longitude = -87.9055705049776
        destination = "Terminal:" + terminal +  "O'Hare International Airport"
        DIRECTIONS_URL = f'https://maps.googleapis.com/maps/api/directions/json?destination={destination}&origin={latitude},{longitude}&mode=car&key=AIzaSyDaTHaEQ1jwYb-FZSwk-NVJgP9c0PzjS7E'
        try:
            headers = {
                'Content-Type': 'application/json' 
            }
            
            
            response = requests.get(  
                DIRECTIONS_URL,
                headers=headers,
            )
            if response.status_code == 200: 
                data = response.json()
                steps = data['routes'][0]['legs'][0]['steps']
                print(steps[0])
                return data

                
            
            else: 
                error_message = response.json().get('error', {}).get('message', 'Unknown error')
                return jsonify({
                    "error": f"Google Directions API error: {error_message}"
                }), response.status_code
            
        except Exception as e: 
            return jsonify({
                "error": str(e)
            }), 500
        
    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

