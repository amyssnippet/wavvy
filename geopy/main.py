from fastapi import FastAPI
from pydantic import BaseModel
from geopy.geocoders import Nominatim

app = FastAPI()
geolocator = Nominatim(user_agent="business_locator_app")

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

@app.post("/store-location/")
async def store_location(request: LocationRequest):
    try:
        location = geolocator.reverse((request.latitude, request.longitude), language="en")
        address = location.address if location else "Address not found"
        return {"latitude": request.latitude, "longitude": request.longitude, "address": address}
    except Exception as e:
        return {"error": str(e)}
