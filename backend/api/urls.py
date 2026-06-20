from django.urls import path
from .views.activityView import (
    ActivityView,
    ActivityParticipantsView,
    JoinActivityView,
    LeaveActivityView,
)
from .views.interestView import InterestView

urlpatterns = [
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
]
