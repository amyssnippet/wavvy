# views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Business, OTP, ServiceCategory, Services, Client, TeamMember, Appointment, Packages
from .serializers import BusinessSerializer, OTPSerializer, ServiceCategorySerializer, ServicesSerializer, ClientSerializer, TeamMemberSerializer, AppointmentSerializer, PackagesSerializer
import random
from django.utils import timezone
from datetime import timedelta
from rest_framework.permissions import AllowAny

class SendOTPView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new OTP record
        otp = OTP(phone_number=phone_number)
        otp.generate_otp()
        otp.save()
        
        # Here you would send the OTP to the user's phone number
        # For now, we'll just print it to the console
        print(f"OTP for {phone_number} is {otp.otp}")
        
        return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request):
        phone_number = request.data.get('phone_number')
        otp = request.data.get('otp')
        
        if not phone_number or not otp:
            return Response({'error': 'Phone number and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch the most recent OTP record for the given phone number
        otp_record = OTP.objects.filter(phone_number=phone_number).order_by('-created_at').first()
        
        if not otp_record:
            return Response({'error': 'No OTP found for this phone number'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Debugging: Print OTP creation time and current time
        print(f"OTP created at: {otp_record.created_at}")
        print(f"Current time: {timezone.now()}")
        
        # Check if the OTP matches
        if otp_record.otp != otp:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the OTP is expired
        if otp_record.created_at < timezone.now() - timedelta(minutes=5):
            return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark the OTP as verified
        otp_record.is_verified = True
        otp_record.save()
        
        # Store the verified phone number in the session
        request.session['verified_phone_number'] = phone_number
        request.session.save()
        
        return Response({'message': 'OTP verified successfully'}, status=status.HTTP_200_OK)

class SetPasswordView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request):
        phone_number = request.session.get('verified_phone_number')
        password = request.data.get('password')
        
        if not phone_number:
            return Response({'error': 'Phone number not verified'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            business = Business.objects.get(phone_number=phone_number)
        except Business.DoesNotExist:
            return Response({'error': 'Business not found'}, status=status.HTTP_404_NOT_FOUND)
        
        business.set_password(password)
        business.save()
        
        # Clear the session after setting the password
        request.session.flush()
        
        return Response({'message': 'Password set successfully'}, status=status.HTTP_200_OK)

class CheckBusinessView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def post(self, request):
        phone_number = request.data.get('phone_number')
        if not phone_number:
            return Response({'error': 'Phone number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            business = Business.objects.get(phone_number=phone_number)
            return Response({'exists': True, 'redirect': '/dashboard', 'business_id': business.id}, status=status.HTTP_200_OK)
        except Business.DoesNotExist:
            return Response({'exists': False}, status=status.HTTP_200_OK)

# CRUD Views for Business
class BusinessListCreateView(generics.ListCreateAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

class BusinessDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    lookup_field = 'id'
    permission_classes = [AllowAny]  # Allow unauthenticated access

# CRUD Views for other models (ServiceCategory, Services, Client, TeamMember, Appointment)
class ServiceCategoryListCreateView(generics.ListCreateAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        business_id = self.request.query_params.get('business_id')
        if business_id:
            return ServiceCategory.objects.filter(business_id=business_id)
        return ServiceCategory.objects.all()

class ServiceCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

class ServicesListCreateView(generics.ListCreateAPIView):
    queryset = Services.objects.all()
    serializer_class = ServicesSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        business_id = self.request.query_params.get('business_id')
        if business_id:
            return Services.objects.filter(business_id=business_id)
        return Services.objects.all() 

class ServicesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Services.objects.all()
    serializer_class = ServicesSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
class PackagesListCreateView(generics.ListCreateAPIView):
    queryset = Packages.objects.all()
    serializer_class = PackagesSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        business_id = self.request.query_params.get('business_id')
        if business_id:
            return Packages.objects.filter(business_id=business_id)
        return Packages.objects.all()

class PackagesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Packages.objects.all()
    serializer_class = PackagesSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

class ClientListCreateView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        business_id = self.request.query_params.get('business_id')
        if business_id:
            return Client.objects.filter(business_id=business_id)
        return Client.objects.all()

class ClientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

class TeamMemberListCreateView(generics.ListCreateAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access
    
    def get_queryset(self):
        # Filter team members based on the business_id provided in the query parameters
        business_id = self.request.query_params.get('business_id')
        if business_id:
            return TeamMember.objects.filter(business_id=business_id)
        return TeamMember.objects.all()

class TeamMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access

class AppointmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        business_id = self.request.query_params.get('business_id')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        queryset = Appointment.objects.all()
        if business_id:
            queryset = queryset.filter(business_id=business_id)
        if start_date and end_date:
            queryset = queryset.filter(
                appointment_date__range=[start_date, end_date]
            )
        return queryset


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access