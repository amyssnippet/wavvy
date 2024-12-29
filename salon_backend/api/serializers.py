from rest_framework import serializers

class ClientSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    client_name = serializers.CharField(required=True)
    client_type = serializers.ChoiceField(
        required=True,
        choices=["Regular","Premium","Corporate","Walk-in"],
    )
    client_email = serializers.EmailField(required=True)
    client_phone = serializers.CharField(required=True)
    client_dob = serializers.DateField(required=False)
    client_gender = serializers.CharField(
        required=True,
        choices=["Male","Female","Rather Not to Say"],
    )
    

class BusinessSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    owner_name = serializers.CharField(requried=True)
    owner_email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(required=True)
    salon_name = serializers.CharField(required=True)
    gst = serializers.CharField(required=False)
    # address = serializers.CharField(required=False)
    salon_description = serializers.CharField(required=False)

class CustomerSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField(required=False)
    registered_at = serializers.DateTimeField(read_only=True)
