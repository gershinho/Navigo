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








def extract_flight_info(flight):
    ident = flight.get("ident", "N/A")
    # Use gate_destination if available, otherwise gate_origin
    gate = flight.get("gate_origin") or flight.get("gate_destination") or "N/A"
    # Use terminal_destination if available, otherwise terminal_origin
    terminal = flight.get("terminal_origin") or flight.get("terminal_destination") or "N/A"
    return ident, gate, terminal


@app.route('/get_flightData', methods=['GET', 'POST'])

def flightInfo():
    user_flight = request.get_json()
    API_KEY = "CnertNS6srqp8NjSiBW59mpgvWJ1t6Zb"
    AIRPORT = user_flight.get('airport')
    DEPARTURE = user_flight.get('departure')
    start_time = f"{DEPARTURE}T00:00:00Z"
    end_time = f"{DEPARTURE}T23:59:59Z"

    
    
    ident = user_flight.get('ident')
    
    url = f"https://aeroapi.flightaware.com/aeroapi/airports/{AIRPORT}/flights?type=departures&start={start_time}&end={end_time}"
    headers = {"x-apikey": API_KEY}
    response = requests.get(url, headers=headers)
    data = response.json()


    categories = [ "departures","scheduled_departures"]

    # Loop through each category and print the flight info if available
    for category in categories:
        flights = data.get(category, [])
        if flights:  # Only print if there are flights in this category
            print(f"\n--- {category.upper()} ---")
            for flight in flights:
                ident, gate, terminal = extract_flight_info(flight)
                print(ident)
                if ident == user_flight.get('ident'):
                    print(f"✅ Match found for flight {ident}")
                    print(f"Gate: {gate}")
                    print(f"Terminal: {terminal}")
                    return jsonify({'gate': gate,
                            'terminal': terminal})

    return jsonify({
        'error': f"No matching flight found for ident: {ident}"
    }), 404
                


   

   


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

