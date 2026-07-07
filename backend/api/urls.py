#
# Napisala Jana Jolovic 2023/0338
# Napisao Ivan Majer 2023/0406
# Napisao Dusan Veljkovic 2023/0417
#
from django.urls import path
from .views.activity_view import (
    ActivityView,
    ActivityParticipantsView,
    JoinActivityView,
    JoinedActivitiesView,
    LeaveActivityView,
    UserActivityView,
)
from .views.interest_view import InterestView, UserInterestsView
from .views.auth_view import LoginView, LogoutView, RegisterView
from .views.chat_view import UserChatsView, ChatView
from .views.weather_view import WeatherView, WeatherForecastView
from .view import UserDataView, UserView, ModeratorRequestView

urlpatterns = [
    path("user-data/", UserDataView.as_view(), name="user-data"),
    path("users/<int:user_id>/", UserView.as_view(), name="user-detail"),
    path("users/", UserView.as_view(), name="user-list"),
    path(
        "moderator-requests/",
        ModeratorRequestView.as_view(),
        name="moderator-request-list",
    ),
    path(
        "moderator-requests/<int:request_id>/",
        ModeratorRequestView.as_view(),
        name="moderator-request-detail",
    ),
    path(
        "users/<int:user_id>/interests/",
        UserInterestsView.as_view(),
        name="user-interests",
    ),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="login"),
    path("auth/register/", RegisterView.as_view(), name="register"),
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
    path("interests/add-interest/", InterestView.as_view(), name="add-interest"),
    path("user-interests/", UserInterestsView.as_view(), name="user-activities"),
    path(
        "user-interests/<int:user_interest_id>",
        UserInterestsView.as_view(),
        name="user-activities-single",
    ),
    path("user-activities/", UserActivityView.as_view(), name="user-activities"),
    path(
        "joined-activities/", JoinedActivitiesView.as_view(), name="joined-activities"
    ),
    path("user-chats/", UserChatsView.as_view(), name="user-chats"),
    path("chats/<int:chat_id>/", ChatView.as_view(), name="chat-full"),
    path("weather/", WeatherView.as_view(), name="weather"),
    path("weather/forecast", WeatherForecastView.as_view(), name="weather-forecast"),
]
