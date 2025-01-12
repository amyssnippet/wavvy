# serializers.py
from rest_framework import serializers
from .models import Business, OTP, ServiceCategory, Services, Client, TeamMember, Appointment, Packages
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

class ClientSerializer(serializers.ModelSerializer):
    business_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['business']
        
    def create(self, validated_data):
        business_id = validated_data.pop('business_id')
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business with the given ID does not exist.")
        
        client = Client.objects.create(business=business, **validated_data)
        return client


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['phone_number', 'otp']

class ServiceCategorySerializer(serializers.ModelSerializer):
    business_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ServiceCategory
        fields = '__all__'
        read_only_fields = ['business']

    def create(self, validated_data):
        business_id = validated_data.pop('business_id')
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business with the given ID does not exist.")
        
        category = ServiceCategory.objects.create(business=business, **validated_data)
        return category
    
    
class ServicesSerializer(serializers.ModelSerializer):
    business_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Services
        fields = '__all__'
        read_only_fields = ['business']
        
    def create(self, validated_data):
        business_id = validated_data.pop('business_id')
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business with the given ID does not exist.")
        
        service = Services.objects.create(business=business, **validated_data)
        return service
    
class PackagesSerializer(serializers.ModelSerializer):
    business_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Packages
        fields = '__all__'
        read_only_fields = ['business']
        
    def create(self, validated_data):
        business_id = validated_data.pop('business_id')
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business with the given ID does not exist.")
        
        package = Packages.objects.create(business=business, **validated_data)
        return package


class TeamMemberSerializer(serializers.ModelSerializer):
    business_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = TeamMember
        fields = '__all__'
        read_only_fields = ['business']
        
    def create(self, validated_data):
        business_id = validated_data.pop('business_id')
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business with the given ID does not exist.")
        
        team_member = TeamMember.objects.create(business=business, **validated_data)
        return team_member
    
class AppointmentSerializer(serializers.ModelSerializer):
    services = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Services.objects.all()
    )
    business_id = serializers.IntegerField(write_only=True)
    client_appointments = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all()
    )
    staff = serializers.PrimaryKeyRelatedField(
        queryset=TeamMember.objects.all()
    )

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['business','client_appointments','staff','services']

    def create(self, validated_data):
        business_id = validated_data.pop('business_id')
        services = validated_data.pop('services')
        try:
            business = Business.objects.get(id=business_id)
        except Business.DoesNotExist:
            raise serializers.ValidationError("Business with the given ID does not exist.")

        appointment = Appointment.objects.create(business=business, **validated_data)
        appointment.services.set(services)
        return appointment
 
    def get_client_appointments(self, obj):
        # Return data for viewing, such as related client information
        if obj.client_appointments:
            return {
                "business_id": obj.client_appointments.business_id,
                "client_name": obj.client_appointments.client_name,
                "client_type": obj.client_appointments.client_type,
                "client_email": obj.client_appointments.client_email,
                "client_phone": obj.client_appointments.client_phone,
                "client_dob": obj.client_appointments.client_dob,
                "client_gender": obj.client_appointments.client_gender,
            }
        return None
        
class BusinessSerializer(serializers.ModelSerializer):
    clients = ClientSerializer(many=True, read_only=True)
    business_team_members = TeamMemberSerializer(many=True, read_only=True)
    business_services = ServicesSerializer(many=True, read_only=True)
    business_packages = PackagesSerializer(many=True, read_only=True)
    business_categories = ServiceCategorySerializer(many=True, read_only=True)
    business_appointments = AppointmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Business
        fields = '__all__'

    def create(self, validated_data):
        team_members_data = validated_data.pop('team_members', [])
        services_data = validated_data.pop('services', [])
        appointments_data = validated_data.pop('appointments', [])
        clients_data = validated_data.pop('clients', [])
        categories_data = validated_data.pop('categories', [])

        # Create the Business object
        business = Business.objects.create(**validated_data)

        # Add many-to-many relationships
        business.team_members.set(team_members_data)
        business.services.set(services_data)
        business.appointments.set(appointments_data)
        business.clients.set(clients_data)
        business.categories.set(categories_data)

        return business

    def update(self, instance, validated_data):
        # Remove many-to-many fields from validated_data
        team_members_data = validated_data.pop('team_members', None)
        services_data = validated_data.pop('services', None)
        appointments_data = validated_data.pop('appointments', None)
        clients_data = validated_data.pop('clients', None)
        categories_data = validated_data.pop('categories', None)

        # Update the Business object
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update many-to-many relationships if provided
        if team_members_data is not None:
            instance.team_members.set(team_members_data)
        if services_data is not None:
            instance.services.set(services_data)
        if appointments_data is not None:
            instance.appointments.set(appointments_data)
        if clients_data is not None:
            instance.clients.set(clients_data)
        if categories_data is not None:
            instance.categories.set(categories_data)

        return instance