import requests

API_KEY = "CnertNS6srqp8NjSiBW59mpgvWJ1t6Zb"
AIRPORT = "JFK"
TODAY = "2025-03-25"

# Define the UTC window for just today
start_time = f"{TODAY}T00:00:00Z"
end_time = f"{TODAY}T23:59:59Z"

url = f"https://aeroapi.flightaware.com/aeroapi/airports/{AIRPORT}/flights?type=departures&start={start_time}&end={end_time}"
headers = {"x-apikey": API_KEY}
response = requests.get(url, headers=headers)

# Convert to JSON
data = response.json()

# Function to extract flight ident, gate, and terminal
def extract_flight_info(flight):
    ident = flight.get("ident", "N/A")
    # Use gate_destination if available, otherwise gate_origin
    gate = flight.get("gate_destination") or flight.get("gate_origin") or "N/A"
    # Use terminal_destination if available, otherwise terminal_origin
    terminal = flight.get("terminal_destination") or flight.get("terminal_origin") or "N/A"
    return ident, gate, terminal

# Define the flight categories to check
categories = [ "departures","scheduled_departures"]

# Loop through each category and print the flight info if available
for category in categories:
    flights = data.get(category, [])
    if flights:  # Only print if there are flights in this category
        print(f"\n--- {category.upper()} ---")
        for flight in flights:
            ident, gate, terminal = extract_flight_info(flight)
            print(f"Flight {ident} - Gate: {gate}, Terminal: {terminal}")
