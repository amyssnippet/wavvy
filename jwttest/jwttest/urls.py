from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('myapp.urls')),
]

"""
i want to intgrate jwt in a mobile otp auth we are using twilio but its services are paid for testing otps on real mobile so i want the otp in harcoded form in terminal and when i verify it then it should route me to another page else stop me at otp verification page, im giving you the ui design of the frontend and the backend code of the project, you have to integrate jwt in the project and make the otp hardcoded in terminal and verify it and route to another page if verified else stop at otp verification page
"""