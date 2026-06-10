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
     path('users/',
          views.UserView.as_view(),
          name='user-list'),
     path('users/<int:user_id>/',
          views.UserView.as_view(),
          name='user-detail'),
     path('moderator-requests/', 
          views.ModeratorRequestView.as_view(), 
          name='moderator-request-list'),
     path('moderator-requests/<int:request_id>/', 
          views.ModeratorRequestView.as_view(), 
          name='moderator-request-detail'),
     ]



