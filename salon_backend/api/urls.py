from django.urls import path
from .views import BusinessAPIView, BusinessDetailAPIView, CustomerAPIView, CustomerDetailAPIView, ServicesAPIView, ServicesDetailAPIView, TeamMemberAPIView, TeamMemberDetailAPIView, ClientAPIView, ClientDetailAPIView

urlpatterns = [
    path('businesses/', BusinessAPIView.as_view(), name='business-list'), 
    path('businesses/<str:pk>/', BusinessDetailAPIView.as_view(), name='business-detail'),
    path('customers/', CustomerAPIView.as_view(), name='customer-list'),
    path('customers/<str:pk>/', CustomerDetailAPIView.as_view(), name='customer-detail'),
    path('services/', ServicesAPIView.as_view(), name='services-list'),
    path('services/<str:pk>/', ServicesDetailAPIView.as_view(), name='services-detail'),
    path('team-members/', TeamMemberAPIView.as_view(), name='team-member-list'),
    path('team-members/<str:pk>/', TeamMemberDetailAPIView.as_view(), name='team-member-detail'),
    path('clients/', ClientAPIView.as_view(), name='client-list'),
    path('clients/<str:pk>/', ClientDetailAPIView.as_view(), name='client-detail')
]