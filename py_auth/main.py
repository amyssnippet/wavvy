from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pyotp

# Simulated in-memory database
user_data = {}

# FastAPI app instance
app = FastAPI()

# Models for request validation
class OTPRequest(BaseModel):
    phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str

# Generate a unique OTP secret for each phone number
def get_or_create_otp_secret(phone_number: str) -> str:
    if phone_number not in user_data:
        user_data[phone_number] = {"otp_secret": pyotp.random_base32()}
    return user_data[phone_number]["otp_secret"]

@app.post("/send-otp/")
async def send_otp(request: OTPRequest):
    phone_number = request.phone_number.strip()  # Clean up the input

    if not phone_number.startswith("+"):
        raise HTTPException(
            status_code=400,
            detail="Phone number must include the country code (e.g., +91)."
        )

    # Get or create an OTP secret
    otp_secret = get_or_create_otp_secret(phone_number)
    totp = pyotp.TOTP(otp_secret)
    otp = totp.now()  # Generate current OTP

    # Simulate OTP sending (print it to the console for testing)
    print(f"Generated OTP for {phone_number}: {otp}")

    return {"message": f"OTP sent to {phone_number}"}

@app.post("/verify-otp/")
async def verify_otp(request: VerifyOTPRequest):
    phone_number = request.phone_number.strip()
    otp = request.otp.strip()

    # Check if phone number exists in our database
    if phone_number not in user_data:
        raise HTTPException(status_code=404, detail="Phone number not registered.")

    otp_secret = user_data[phone_number]["otp_secret"]
    totp = pyotp.TOTP(otp_secret)

    # Verify the OTP
    if totp.verify(otp):
        return {"message": "OTP verified successfully!"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP or OTP expired.")
