from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Business, Customer, Services, TeamMember, Client, Appointment
from .serializers import BusinessSerializer, CustomerSerializer, ServicesSerializer, TeamMemberSerializer, ClientSerializer, AppointmentSerializer
from mongoengine.errors import DoesNotExist, ValidationError


class BusinessAPIView(APIView):
    def get(self, request):
        businesses = Business.objects.all()
        serializer = BusinessSerializer(businesses, many=True)
        return Response([{
            'id': str(business.id),
            'owner_name': business.owner_name,
            'phone_number': business.phone_number,
            'salon_name': business.salon_name,
            'owner_email': business.owner_email,
            'gst': business.gst,
            'salon_description': business.salon_description
        } for business in businesses])

    def post(self, request):
        serializer = BusinessSerializer(data=request.data)
        if serializer.is_valid():
            business = serializer.save()
            return Response({
                'id': str(business.id),
                **serializer.validated_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class BusinessDetailAPIView(APIView):
    def get(self, request, pk):
        """
        Retrieve a specific Business object by its id.
        """
        try:
            business = Business.objects.get(id=pk)
            serializer = BusinessSerializer({
                'id': str(business.id),
                'owner_name': business.owner_name,
                'phone_number': business.phone_number,
                'salon_name': business.salon_name,
                'owner_email': business.owner_email,
                'gst': business.gst,
                'salon_description': business.salon_description
            })
            return Response(serializer.data)
        except DoesNotExist:
            return Response({'error': 'Business not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update a specific Business object by its id.
        """
        try:
            business = Business.objects.get(id=pk)
        except DoesNotExist:
            return Response({'error': 'Business not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BusinessSerializer(data=request.data)
        if serializer.is_valid():
            # Update fields individually
            for key, value in serializer.validated_data.items():
                setattr(business, key, value)
            business.save()
            return Response({
                'id': str(business.id),
                **serializer.validated_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific Business object by its id.
        """
        try:
            business = Business.objects.get(id=pk)
            business.delete()
            return Response({'message': 'Business deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response({'error': 'Business not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

class CustomerAPIView(APIView):
    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response([{
            'id': str(customer.id),
            'name': customer.customer_name,
            'phone_number': customer.customer_phone,
            'email': customer.customer_email,
            'address': customer.customer_address
        } for customer in customers])

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()
            return Response({
                'id': str(customer.id),
                **serializer.validated_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomerDetailAPIView(APIView):
    def get(self, request, pk):
        """
        Retrieve a specific Customer object by its id.
        """
        try:
            customer = Customer.objects.get(id=pk)
            serializer = CustomerSerializer({
                'id': str(customer.id),
                'name': customer.customer_name,
                'phone_number': customer.customer_phone,
                'email': customer.customer_email,
                'address': customer.customer_address
            })
            return Response(serializer.data)
        except DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update a specific Customer object by its id.
        """
        try:
            customer = Customer.objects.get(id=pk)
        except DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            # Update fields individually
            for key, value in serializer.validated_data.items():
                setattr(customer, key, value)
            customer.save()
            return Response({
                'id': str(customer.id),
                **serializer.validated_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific Customer object by its id.
        """
        try:
            customer = Customer.objects.get(id=pk)
            customer.delete()
            return Response({'message': 'Customer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)
        
class ServicesAPIView(APIView):
    def get(self, request):
        services = Services.objects.all()
        serializer = ServicesSerializer(services, many=True)
        return Response([{
            'id': str(service.id),
            'service_name': service.service_name,
            'service_type': service.service_type,
            'menu_category': service.menu_category,
            'duration_in_mins': service.duration_in_mins,
            'price': service.price
        } for service in services])

    def post(self, request):
        serializer = ServicesSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response({
                'id': str(service.id),
                **serializer.validated_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ServicesDetailAPIView(APIView):
    def get(self, request, pk):
        """
        Retrieve a specific Services object by its id.
        """
        try:
            service = Services.objects.get(id=pk)
            serializer = ServicesSerializer({
                'id': str(service.id),
                'service_name': service.service_name,
                'service_type': service.service_type,
                'menu_category': service.menu_category,
                'duration_in_mins': service.duration_in_mins,
                'price': service.price
            })
            return Response(serializer.data)
        except DoesNotExist:
            return Response({'error': 'Services not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update a specific Services object by its id.
        """
        try:
            service = Services.objects.get(id=pk)
        except DoesNotExist:
            return Response({'error': 'Services not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ServicesSerializer(data=request.data)
        if serializer.is_valid():
            # Update fields individually
            for key, value in serializer.validated_data.items():
                setattr(service, key, value)
            service.save()
            return Response({
                'id': str(service.id),
                **serializer.validated_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific Services object by its id.
        """
        try:
            service = Services.objects.get(id=pk)
            service.delete()
            return Response({'message': 'Services deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response({'error': 'Services not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)
        
class TeamMemberAPIView(APIView):
    def get(self, request):
        team_members = TeamMember.objects.all()
        serializer = TeamMemberSerializer(team_members, many=True)
        return Response([{
            'id': str(member.id),
            'profile_img': member.profile_img,
            'member_name': member.member_name,
            'phone_number': member.phone_number,
            'member_email': member.member_email,
            'date_of_joining': member.date_of_joining,
            'access_type': member.access_type
        } for member in team_members])

    def post(self, request):
        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            return Response({
                'id': str(member.id),
                **serializer.validated_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TeamMemberDetailAPIView(APIView):
    def get(self, request, pk):
        """
        Retrieve a specific TeamMember object by its id.
        """
        try:
            member = TeamMember.objects.get(id=pk)
            serializer = TeamMemberSerializer({
                'id': str(member.id),
                'profile_img': member.profile_img,
                'member_name': member.member_name,
                'phone_number': member.phone_number,
                'member_email': member.member_email,
                'date_of_joining': member.date_of_joining,
                'access_type': member.access_type
            })
            return Response(serializer.data)
        except DoesNotExist:
            return Response({'error': 'TeamMember not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update a specific TeamMember object by its id.
        """
        try:
            member = TeamMember.objects.get(id=pk)
        except DoesNotExist:
            return Response({'error': 'TeamMember not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TeamMemberSerializer(data=request.data)
        if serializer.is_valid():
            # Update fields individually
            for key, value in serializer.validated_data.items():
                setattr(member, key, value)
            member.save()
            return Response({
                'id': str(member.id),
                **serializer.validated_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific TeamMember object by its id.
        """
        try:
            member = TeamMember.objects.get(id=pk)
            member.delete()
            return Response({'message': 'TeamMember deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response({'error': 'TeamMember not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)
        
class ClientAPIView(APIView):
    def get(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response([{
            'id': str(client.id),
            'client_name': client.client_name,
            'client_type': client.client_type,
            'client_email': client.client_email,
            'client_phone': client.client_phone,
            'client_dob': client.client_dob,
        } for client in clients])
        
    def post(self, request):
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            client = serializer.save()
            return Response({
                'id': str(client.id),
                **serializer.validated_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ClientDetailAPIView(APIView):
    def get(self, request, pk):
        """
        Retrieve a specific Client object by its id.
        """
        try:
            client = Client.objects.get(id=pk)
            serializer = ClientSerializer({
                'id': str(client.id),
                'client_name': client.client_name,
                'client_type': client.client_type,
                'client_email': client.client_email,
                'client_phone': client.client_phone,
                'client_dob': client.client_dob,
            })
            return Response(serializer.data)
        except DoesNotExist:
            return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update a specific Client object by its id.
        """
        try:
            client = Client.objects.get(id=pk)
        except DoesNotExist:
            return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            # Update fields individually
            for key, value in serializer.validated_data.items():
                setattr(client, key, value)
            client.save()
            return Response({
                'id': str(client.id),
                **serializer.validated_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific Client object by its id.
        """
        try:
            client = Client.objects.get(id=pk)
            client.delete()
            return Response({'message': 'Client deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)
        
class AppointmentAPIView(APIView):
    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response([{
            'id': str(appointment.id),
            'customer': appointment.customer,
            'appointment_date': appointment.appointment_date,
            'appointment_time': appointment.appointment_time,
            'services': appointment.services,
            'assigned_team_member': appointment.assigned_team_member,
            'status': appointment.status
        } for appointment in appointments])

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            return Response({
                'id': str(appointment.id),
                **serializer.validated_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AppointmentDetailAPIView(APIView):
    def get(self, request, pk):
        """
        Retrieve a specific Appointment object by its id.
        """
        try:
            appointment = Appointment.objects.get(id=pk)
            serializer = AppointmentSerializer({
                'id': str(appointment.id),
                'customer': appointment.customer,
                'appointment_date': appointment.appointment_date,
                'appointment_time': appointment.appointment_time,
                'services': appointment.services,
                'assigned_team_member': appointment.assigned_team_member,
                'status': appointment.status
            })
            return Response(serializer.data)
        except DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        """
        Update a specific Appointment object by its id.
        """
        try:
            appointment = Appointment.objects.get(id=pk)
        except DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            # Update fields individually
            for key, value in serializer.validated_data.items():
                setattr(appointment, key, value)
            appointment.save()
            return Response({
                'id': str(appointment.id),
                **serializer.validated_data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific Appointment object by its id.
        """
        try:
            appointment = Appointment.objects.get(id=pk)
            appointment.delete()
            return Response({'message': 'Appointment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except DoesNotExist:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response({'error': 'Invalid ID format'}, status=status.HTTP_400_BAD_REQUEST)