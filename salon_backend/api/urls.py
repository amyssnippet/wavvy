from django.urls import path
from . import views

urlpatterns = [
    # Business endpoints
    path('business/', views.BusinessListCreateView.as_view(), name='business-list-create'),
    path('business/<int:pk>/', views.BusinessDetailView.as_view(), name='business-detail'),

    # Client endpoints
    path('clients/', views.ClientListCreateView.as_view(), name='client-list-create'),
    path('clients/<int:pk>/', views.ClientDetailView.as_view(), name='client-detail'),

    # Services endpoints
    path('services/', views.ServicesListCreateView.as_view(), name='services-list-create'),
    path('services/<int:pk>/', views.ServicesDetailView.as_view(), name='services-detail'),

    # Team Member endpoints
    path('team/', views.TeamMemberListCreateView.as_view(), name='team-list-create'),
    path('team/<int:pk>/', views.TeamMemberDetailView.as_view(), name='team-detail'),

    # Appointment endpoints
    path('appointments/', views.AppointmentListCreateView.as_view(), name='appointment-list-create'),
    path('appointments/<int:pk>/', views.AppointmentDetailView.as_view(), name='appointment-detail'),
]
