# serializers.py
from rest_framework import serializers
from .models import Business, OTP, ServiceCategory, Services, Client, TeamMember, Appointment
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
    class Meta:
        model = ServiceCategory
        fields = '__all__'

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'


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
    class Meta:
        model = Appointment
        fields = '__all__'
        
        
        
class BusinessSerializer(serializers.ModelSerializer):
    clients = ClientSerializer(many=True, read_only=True)
    business_team_members = TeamMemberSerializer(many=True, read_only=True)
    
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