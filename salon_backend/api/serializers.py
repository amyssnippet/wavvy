from rest_framework import serializers
from .models import Business, Customer, Services, TeamMember, Client, Appointment

class BusinessSerializer(serializers.Serializer):
    
    def validate_unique_phone_number(value):
        if TeamMember.objects.filter(phone_number=value).first():
            raise serializers.ValidationError("Phone number already exists")
        return value
    
    def validate_unique_owner_email(value):
        if TeamMember.objects.filter(member_email=value).first():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_unique_gst(value):
        if Business.objects.filter(gst=value).first():
            raise serializers.ValidationError("GST preowned by other business")
        return value
    
    id = serializers.CharField(read_only=True)
    owner_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True, validators=[validate_unique_phone_number])
    salon_name = serializers.CharField(required=True)
    owner_email = serializers.EmailField(required=True, validators=[validate_unique_owner_email])
    gst = serializers.CharField(required=False, allow_blank=True, allow_null=True, validators=[validate_unique_gst])
    salon_description = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def create(self, validated_data):
        return Business.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class CustomerSerializer(serializers.Serializer):
    
    def validate_unique_customer_phone(value):
        if Customer.objects.filter(phone_number=value).first():
            raise serializers.ValidationError("Phone number already exists")
        return value
    
    id = serializers.CharField(read_only=True)
    customer_name = serializers.CharField(required=True)
    customer_phone = serializers.CharField(required=True, validators=[validate_unique_customer_phone])
    customer_reviews = serializers.ChoiceField(choices=["Good","Bad"],required=True)
    booked_at = serializers.DateField(required=True)
    scheduled_date = serializers.DateTimeField(required=True)
    
    def create(self, validated_data):
        return Customer.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class ServicesSerializer(serializers.Serializer):
    
    id = serializers.CharField(read_only=True)
    service_name = serializers.CharField(required=True)
    service_type = serializers.ChoiceField(choices=["Basic", "Premium", "Add-on"],required=True)
    menu_category = serializers.CharField(required=True)
    duration_in_mins = serializers.IntegerField(required=True)
    price = serializers.IntegerField(required=True)
    
    def create(self, validated_data):
        return Services.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class TeamMemberSerializer(serializers.Serializer):
    
    def validate_unique_phone_number(value):
        if TeamMember.objects.filter(phone_number=value).first():
            raise serializers.ValidationError("Phone number already exists")
        return value
    
    def validate_unique_member_email(value):
        if TeamMember.objects.filter(member_email=value).first():
            raise serializers.ValidationError("Email already exists")
        return value
    
    id = serializers.CharField(read_only=True)
    profile_img = serializers.CharField(required=False)
    member_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True, validators=[validate_unique_phone_number])
    member_email = serializers.EmailField(required=True, validators=[validate_unique_member_email])
    date_of_joining = serializers.DateField(required=True)
    access_type = serializers.CharField(required=True)
    
    def create(self, validated_data):
        return TeamMember.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class ClientSerializer(serializers.Serializer):
    
    def validate_unique_client_phone(value):
        if Client.objects.filter(client_phone=value).first():
            raise serializers.ValidationError("Phone number already exists")
        return value
    
    def validate_unique_client_email(value):
        if Client.objects.filter(client_email=value).first():
            raise serializers.ValidationError("Email already exists")
        return value
    
    id = serializers.CharField(read_only=True)
    client_name = serializers.CharField(required=True)
    client_type = serializers.CharField(required=True)
    client_email = serializers.EmailField(required=True, validators=[validate_unique_client_email])
    client_phone = serializers.CharField(required=True, validators=[validate_unique_client_phone])
    client_dob = serializers.DateField(required=False, allow_null=True)
    
    def create(self, validated_data):
        return Client.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def validate(self, attrs):
        # Check if a client with the same phone number or email already exists
        if Client.objects.filter(phone_number=attrs['phone_number']).first():
            raise serializers.ValidationError("A client with this phone number already exists.")
        if 'email' in attrs and Client.objects.filter(email=attrs['email']).first():
            raise serializers.ValidationError("A client with this email already exists.")
        return attrs
    
class AppointmentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customer = serializers.CharField(required=True)
    appointment_date = serializers.DateField(required=True)
    services = serializers.ListField(child=serializers.CharField())
    assigned_team_member = serializers.CharField(read_only=True)

    def create(self, validated_data):
        try:
            client = Client.objects.get(id=validated_data.pop('customer'))
        except Client.DoesNotExist:
            raise serializers.ValidationError("Client not found.")
        team_member = TeamMember.objects.filter(is_available=True).first()
        if not team_member:
            raise serializers.ValidationError("No available team member found.")

        appointment = Appointment.objects.create(
            customer=client, 
            assigned_team_member=team_member, 
            **validated_data
        )

        client.appointment_history.append(appointment)
        client.save()

        team_member.is_available = False
        team_member.save()

        return appointment
    
    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
