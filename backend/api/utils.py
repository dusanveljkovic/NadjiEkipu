import json
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder


def json_response(data, status=200):
    return JsonResponse(data, status=status, encoder=DjangoJSONEncoder, safe=False)


def parse_json_body(request):
    try:
        return json.loads(request.body)
    except json.JSONDecodeError:
        return {}


def validate_required_fields(data, required_fields):
    for field in required_fields:
        if field not in data:
            return False
    return True
