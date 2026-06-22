from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
import hashlib


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('role_id', 1)
        return self.create_user(username, email, password, **extra_fields)


class Role(models.Model):
    idroles = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'roles'
        managed = False

    def __str__(self):
        return self.name


class User(AbstractBaseUser):
    objects = UserManager()
    idusers = models.AutoField(primary_key=True)
    username = models.CharField(max_length=128, unique=True)
    email = models.EmailField(max_length=128, unique=True)
    password_hash = models.CharField(max_length=255)
    firstname = models.CharField(max_length=128, null=True, blank=True)
    lastname = models.CharField(max_length=128, null=True, blank=True)
    birthyear = models.IntegerField(null=True, blank=True)
    # role_id = models.IntegerField(default=1)
    role_id = models.ForeignKey(
        Role,
        on_delete=models.DO_NOTHING,
        db_column='role_id',
        default=1
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    avatar_id = models.SmallIntegerField(default=0)

    last_login = None

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'users'
        managed = False

    def set_password(self, raw_password):
        self.password_hash = hashlib.sha256(raw_password.encode()).hexdigest()
        self._password = raw_password
        self.save()

    def check_password(self, raw_password):
        return self.password_hash == hashlib.sha256(raw_password.encode()).hexdigest()

    @property
    def password(self):
        raise AttributeError('password is not readable')

    @password.setter 
    def password(self, raw_password):
        self.set_password(raw_password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False


class ModeratorRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]

    idmoderator_requests = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User,
                                on_delete=models.DO_NOTHING,
                                db_column='user_id')
    status = models.CharField(max_length=10,
                              choices=STATUS_CHOICES,
                              default='PENDING')
    created_at = models.DateTimeField(default=timezone.now)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'moderator_requests'
        managed = False


class Interest(models.Model):
    idinterests = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField(null=True, blank=True)
    avatar_id = models.SmallIntegerField(default=0)
    created_by = models.ForeignKey(User,
                                   on_delete=models.DO_NOTHING,
                                   db_column='created_by')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'interests'
        managed = False


class UserInterest(models.Model):
    iduser_interests = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User,
                                on_delete=models.DO_NOTHING,
                                db_column='user_id')
    interest_id = models.ForeignKey(Interest,
                                    on_delete=models.DO_NOTHING,
                                    db_column='interest_id')
    skill_level = models.SmallIntegerField(default=0)
    attended_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'user_interests'
        managed = False
        unique_together = (('user_id', 'interest_id'),)


class Activity(models.Model):
    idactivities = models.AutoField(primary_key=True)
    interest_id = models.ForeignKey(Interest,
                                    on_delete=models.DO_NOTHING,
                                    db_column='interest_id')
    created_by = models.ForeignKey(User,
                                   on_delete=models.DO_NOTHING,
                                   db_column='created_by',
                                   related_name='created_activities')
    title = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    event_time = models.DateTimeField()
    lat = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    lon = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    location_name = models.CharField(max_length=128, null=True, blank=True)
    max_participants = models.IntegerField(null=True, blank=True)
    indoor = models.SmallIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'activities'
        managed = False


class ActivityParticipant(models.Model):
    idactivity_participants = models.AutoField(primary_key=True)
    activity_id = models.ForeignKey(Activity,
                                    on_delete=models.DO_NOTHING,
                                    db_column='activity_id')
    user_id = models.ForeignKey(User,
                                on_delete=models.DO_NOTHING,
                                db_column='user_id')
    joined_at = models.DateTimeField(default=timezone.now)
    status = models.SmallIntegerField(default=0)

    class Meta:
        db_table = 'activity_participants'
        managed = False
        unique_together = (('activity_id', 'user_id'),)


class Chat(models.Model):
    idchats = models.AutoField(primary_key=True)
    event_id = models.OneToOneField(Activity,
                                    on_delete=models.DO_NOTHING,
                                    db_column='event_id')
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'chats'
        managed = False


class Message(models.Model):
    idmessages = models.AutoField(primary_key=True)
    chat_id = models.ForeignKey(Chat,
                                on_delete=models.DO_NOTHING,
                                db_column='chat_id')
    sender_id = models.ForeignKey(User,
                                  on_delete=models.DO_NOTHING,
                                  db_column='sender_id')
    message = models.TextField()
    sent_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'messages'
        managed = False


class UserSession(models.Model):
    iduser_sessions = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User,
                                on_delete=models.DO_NOTHING,
                                db_column='user_id')
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'user_sessions'
        managed = False

