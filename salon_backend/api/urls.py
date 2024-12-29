from django.urls import path
from .views import BusinessView, CustomerView

urlpatterns = [
    path('businesses/', BusinessView.as_view(), name='business-list'),
    path('businesses/<str:pk>/', BusinessView.as_view(), name='business-detail'),
    path('customers/', CustomerView.as_view(), name='customer-list'),
]
