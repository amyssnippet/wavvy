from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Business, Customer
from .serializers import BusinessSerializer, CustomerSerializer
from datetime import datetime
from rest_framework.exceptions import NotFound

class BusinessView(APIView):
    def get(self, request):
        businesses = Business.objects.all()
        serializer = BusinessSerializer(businesses, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        serializer = BusinessSerializer(data=data)
        if serializer.is_valid():
            business = Business(
                name=serializer.validated_data['name'],
                owner_email=serializer.validated_data['owner_email'],
                phone=serializer.validated_data['phone'],
                address=serializer.validated_data.get('address', ""),
                services=serializer.validated_data.get('services', []),
                packages=serializer.validated_data.get('packages', []),
                created_at=datetime.now()
            )
            business.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        try:
            business = Business.objects.get(id=pk)
        except Business.DoesNotExist:
            raise NotFound("Business not found.")

        data = request.data
        for key, value in data.items():
            if hasattr(business, key):
                setattr(business, key, value)

        business.save()
        serializer = BusinessSerializer(business)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerView(APIView):
    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        serializer = CustomerSerializer(data=data)
        if serializer.is_valid():
            customer = Customer(
                name=serializer.validated_data['name'],
                email=serializer.validated_data['email'],
                phone=serializer.validated_data.get('phone', ""),
                registered_at=datetime.now()
            )
            customer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
