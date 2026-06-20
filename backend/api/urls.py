from django.urls import path
from .views.activity_view import (
    ActivityView,
    ActivityParticipantsView,
    JoinActivityView,
    LeaveActivityView,
    UserActivityView,
)
from .views.interest_view import InterestView
from .views.auth_view import LoginView, LogoutView

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="login"),
    path("activities/", ActivityView.as_view(), name="activity-list"),
    path(
        "activities/<int:activity_id>/",
        ActivityView.as_view(),
        name="activity-detail",
    ),
    path(
        "activities/<int:activity_id>/participants/",
        ActivityParticipantsView.as_view(),
        name="activity-participants",
    ),
    path(
        "activities/<int:activity_id>/join/",
        JoinActivityView.as_view(),
        name="join-activity",
    ),
    path(
        "activities/<int:activity_id>/leave/",
        LeaveActivityView.as_view(),
        name="leave-activity",
    ),
    path("interests/", InterestView.as_view(), name="interest-list"),
    path(
        "interests/<int:interest_id>/", InterestView.as_view(), name="interest-detail"
    ),
    path("user-activities/", UserActivityView.as_view(), name="user-activities"),
]
