from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import (
    Business, Client, Services, TeamMember, Appointment, ServiceCategory, OTP
)
from .serializers import (
    BusinessSerializer, ClientSerializer, ServicesSerializer,
    TeamMemberSerializer, AppointmentSerializer, ServiceCategorySerializer,
    PhoneVerifySerializer, OTPVerifySerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView

# ---------------- Services Views ---------------- #
class ServicesListCreateView(generics.ListCreateAPIView):
    serializer_class = ServicesSerializer
    queryset = Services.objects.all()
    parser_classes = [MultiPartParser, FormParser]


class ServicesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Services.objects.all()
    serializer_class = ServicesSerializer


# ---------------- Service Categories Views ---------------- #
class ServiceCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceCategorySerializer

    def get_queryset(self):
        business_id = self.request.query_params.get('business')
        if business_id:
            return ServiceCategory.objects.filter(business__id=business_id)
        return ServiceCategory.objects.all()


class ServiceCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer


# ---------------- Business Views ---------------- #
class BusinessListCreateView(generics.ListCreateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class BusinessDetailView(generics.RetrieveAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

    def get_object(self):
        try:
            return Business.objects.get(id=self.kwargs["business_id"])
        except Business.DoesNotExist:
            raise NotFound("Business not found.")


# ---------------- Client Views ---------------- #
class ClientListCreateView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class ClientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


# ---------------- Team Member Views ---------------- #
class TeamMemberListCreateView(generics.ListCreateAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


class TeamMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer


# ---------------- Appointment Views ---------------- #
class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        business_id = self.request.query_params.get('business')
        if business_id:
            return Appointment.objects.filter(business__id=business_id)
        return Appointment.objects.all()

    def perform_create(self, serializer):
        business_id = self.request.data.get('business')
        if not business_id:
            raise PermissionDenied("Business ID is required to create an appointment.")
        business = Business.objects.filter(id=business_id).first()
        if not business:
            raise PermissionDenied("Invalid Business ID.")
        serializer.save(business=business)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer


# ---------------- Authentication Views ---------------- #

class VerifyPhoneNumberView(APIView):
    def post(self, request):
        serializer = PhoneVerifySerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            business = Business.objects.filter(phone_number=phone_number).first()
            if business:
                return Response({"exists": True, "redirect": "/dashboard"}, status=status.HTTP_200_OK)
            else:
                return Response({"exists": False, "redirect": "/register"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SendOTPView(APIView):
    permission_classes = [AllowAny]  # No authentication required

    def post(self, request):
        serializer = PhoneVerifySerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            otp_entry, created = OTP.objects.get_or_create(phone_number=phone_number)
            otp_entry.generate_otp()
            otp_entry.save()
            print(f"Generated OTP for {phone_number}: {otp_entry.otp}")
            return Response({"message": "OTP sent successfully.", "otp": otp_entry.otp}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import OTP, Business

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')

        try:
            otp_instance = OTP.objects.get(phone_number=phone_number, otp=otp)

            if otp_instance.is_used:
                return Response({"message": "OTP already used."}, status=status.HTTP_400_BAD_REQUEST)

            # Mark OTP as used
            otp_instance.is_used = True
            otp_instance.save()

            # Check if the user exists; if not, create a new one
            user, created = User.objects.get_or_create(username=phone_number)

            # Generate tokens for the user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Check if the business exists for the given phone number
            business = Business.objects.filter(phone_number=phone_number).first()

            if business:
                return Response({
                    "message": "OTP verified successfully.",
                    "access": access_token,
                    "refresh": str(refresh),
                    "business_exists": True,
                    "business": business.salon_name
                })
            else:
                return Response({
                    "message": "OTP verified successfully.",
                    "access": access_token,
                    "refresh": str(refresh),
                    "business_exists": False
                })

        except OTP.DoesNotExist:
            return Response({"message": "Invalid OTP or phone number."}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Business

class CheckBusinessView(APIView):
    # AllowAny permission will ensure no authentication is needed
    permission_classes = [AllowAny]

    def post(self, request):
        phone_number = request.data.get('phone_number')

        # Check if the business exists for the given phone number
        business = Business.objects.filter(phone_number=phone_number).first()

        if business:
            return Response({
                "exists": True,
                "business": {
                    "salon_name": business.salon_name,
                    "owner_name": business.owner_name,
                }
            })
        else:
            return Response({
                "exists": False,
                "message": "No business found for the given phone number."
            })

