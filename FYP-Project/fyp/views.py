from django.shortcuts import render, HttpResponse
from django.http import JsonResponse

import json
import requests



# Create your views here.
def test_api(request):

    # Probably need something lese here
    # word_count = 200
    # request = requests.get(f"https://random-word-api.herokuapp.com/word?number={word_count}").json()

    # print(request)

    request = [
        "apple", "banana", "cherry", "grape", "orange", "strawberry", "peach",
        "laptop", "keyboard", "monitor", "mouse", "software", "hardware",
        "python", "javascript", "react", "django", "typescript", "backend",
        "football", "tennis", "cricket", "hockey", "cycling", "swimming",
        "mountain", "valley", "river", "ocean", "desert", "jungle",
        "apple", "banana", "cherry", "grape", "orange", "strawberry", "peach",
        "laptop", "keyboard", "monitor", "mouse", "software", "hardware",
        "python", "javascript", "react", "django", "typescript", "backend",
        "football", "tennis", "cricket", "hockey", "cycling", "swimming",
        "mountain", "valley", "river", "ocean", "desert", "jungle"
    ]

    # Returns randomized 200 words
    return JsonResponse({"words": request})


