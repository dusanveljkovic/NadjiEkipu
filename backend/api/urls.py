from django.urls import path 
from . import views

urlpatterns = [
    path('activities/',
         views.ActivityView.as_view(),
         name='activity-list'),
    path('activities/<int:activity_id>/',
         views.ActivityView.as_view(),
         name='activity-detail'),
    path('activities/<int:activity_id>/participants/',
         views.ActivityParticipantsView.as_view(),
         name='activity-participants'),
    path('activities/<int:activity_id>/join/',
         views.JoinActivityView.as_view(),
         name='join-activity'),
    path('activities/<int:activity_id>/leave/',
         views.LeaveActivityView.as_view(),
         name='leave-activity'),
        ]


