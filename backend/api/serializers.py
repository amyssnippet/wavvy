from rest_framework import serializers
from .models import (
    Business,
    ServiceCategory,
    Services,
    Client,
    TeamMember,
    Appointment,
    OTP
)
from rest_framework_simplejwt.tokens import RefreshToken


# Your existing BusinessSerializer
class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = '__all__'


# Your existing ServiceCategorySerializer
class ServiceCategorySerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)
    business_id = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), write_only=True)

    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "description", "business", "business_id"]

    def create(self, validated_data):
        business = validated_data.pop("business_id", None)
        service_category = ServiceCategory.objects.create(**validated_data, business=business)
        return service_category

    def update(self, instance, validated_data):
        business = validated_data.pop("business_id", None)
        if business:
            instance.business = business
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.save()
        return instance


# Your existing ServicesSerializer
class ServicesSerializer(serializers.ModelSerializer):
    category = ServiceCategorySerializer(read_only=True)
    business = BusinessSerializer(read_only=True)
    business_id = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), write_only=True)

    class Meta:
        model = Services
        fields = ["id", "name", "description", "price", "category", "business", "business_id"]

    def create(self, validated_data):
        business = validated_data.pop("business_id", None)
        service = Services.objects.create(**validated_data, business=business)
        return service

    def update(self, instance, validated_data):
        business = validated_data.pop("business_id", None)
        if business:
            instance.business = business
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.price = validated_data.get("price", instance.price)
        instance.category = validated_data.get("category", instance.category)
        instance.save()
        return instance


# Your existing ClientSerializer
class ClientSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)
    business_id = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), write_only=True)

    class Meta:
        model = Client
        fields = ["id", "first_name", "last_name", "phone_number", "email", "business", "business_id"]

    def create(self, validated_data):
        business = validated_data.pop("business_id", None)
        client = Client.objects.create(**validated_data, business=business)
        return client

    def update(self, instance, validated_data):
        business = validated_data.pop("business_id", None)
        if business:
            instance.business = business
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.phone_number = validated_data.get("phone_number", instance.phone_number)
        instance.email = validated_data.get("email", instance.email)
        instance.save()
        return instance


# Your existing TeamMemberSerializer
class TeamMemberSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)
    business_id = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all(), write_only=True)

    class Meta:
        model = TeamMember
        fields = [
            "id", "first_name", "last_name", "phone_number", "member_email",
            "date_of_joining", "access_type", "is_available", "business", "business_id"
        ]

    def create(self, validated_data):
        business = validated_data.pop("business_id", None)
        team_member = TeamMember.objects.create(**validated_data, business=business)
        return team_member

    def update(self, instance, validated_data):
        business = validated_data.pop("business_id", None)
        if business:
            instance.business = business
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.phone_number = validated_data.get("phone_number", instance.phone_number)
        instance.member_email = validated_data.get("member_email", instance.member_email)
        instance.date_of_joining = validated_data.get("date_of_joining", instance.date_of_joining)
        instance.access_type = validated_data.get("access_type", instance.access_type)
        instance.is_available = validated_data.get("is_available", instance.is_available)
        instance.save()
        return instance


# Your existing AppointmentSerializer
class AppointmentSerializer(serializers.ModelSerializer):
    services = ServicesSerializer(many=True, read_only=True)
    staff = serializers.PrimaryKeyRelatedField(queryset=TeamMember.objects.all())
    client_appointments = serializers.PrimaryKeyRelatedField(queryset=Client.objects.all())
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all())

    class Meta:
        model = Appointment
        fields = [
            "id", "services", "staff", "client_appointments",
            "appointment_date", "appointment_time", "pay_mode", "business"
        ]
    
    def create(self, validated_data):
        business = validated_data.get('business', None)
        staff = validated_data.get('staff', None)
        client = validated_data.get('client_appointments', None)
        
        if business and staff:
            if staff.business != business:
                raise serializers.ValidationError("The selected staff member does not belong to this business.")
        
        if business and client:
            if client.business != business:
                raise serializers.ValidationError("The selected client does not belong to this business.")
        
        appointment = Appointment.objects.create(**validated_data)
        return appointment

    def update(self, instance, validated_data):
        business = validated_data.get('business', None)
        staff = validated_data.get('staff', None)
        client = validated_data.get('client_appointments', None)

        if business and staff:
            if staff.business != business:
                raise serializers.ValidationError("The selected staff member does not belong to this business.")
        
        if business and client:
            if client.business != business:
                raise serializers.ValidationError("The selected client does not belong to this business.")
        
        instance.services.set(validated_data.get('services', instance.services.all()))
        instance.staff = validated_data.get('staff', instance.staff)
        instance.client_appointments = validated_data.get('client_appointments', instance.client_appointments)
        instance.appointment_date = validated_data.get('appointment_date', instance.appointment_date)
        instance.appointment_time = validated_data.get('appointment_time', instance.appointment_time)
        instance.pay_mode = validated_data.get('pay_mode', instance.pay_mode)
        instance.business = validated_data.get('business', instance.business)
        instance.save()
        return instance


# Serializer for Phone number verification
class PhoneVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)


# Serializer for OTP verification
class OTPVerifySerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=4)


# Business Authentication Serializer (JWT generation)
class BusinessAuthSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)

    def validate_phone_number(self, value):
        try:
            business = Business.objects.get(phone_number=value)
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business with this phone number does not exist.")
        return value

    def create(self, validated_data):
        phone_number = validated_data['phone_number']
        business = Business.objects.get(phone_number=phone_number)

        # Create JWT token
        refresh = RefreshToken.for_user(business)
        access_token = refresh.access_token

        return {
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'business': BusinessSerializer(business).data
        }
