# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
import uuid
import openai
from openai import OpenAI
from typing import Any, Dict, List, Text

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import os

openai_api_key = ''
print(openai_api_key)
def gptResponse(query):
    client = OpenAI(
        api_key=openai_api_key
    )
    system_message = {
        'role': 'system',
        'content': '''
        You are a helpful assistant. Please structure your response in a JSON-like list with separate items for text and links.
          If a link is mentioned, it should be in its own item. Separate multiple text sections as distinct items. Also must include questioning at the end
          Here's an example of the desired structure, not necessary have to follow you can add more if the user provide more information:
          [
            {"text": "Here's a resource for you,"},
            {"link": "https://example.com"},only include Link if the message provided with "Link"
            {"ImgLink": "https://example.com"}, only include ImgLink if the message provided with "ImgLink"
            {"text": "This link provides useful information."},
            {"question": "Is there anything you would like to ask?"} // (must include question object!! can be rephrase them in anyway you want)
          ]
             '''


    }
    messages = [system_message]
    for item in query:
        # Get the first key-value pair from the dictionary to use as content
        key, content = list(item.items())[0]
        if key == "question":
            messages.append({'role': 'user', 'content': content})
        else:
            messages.append({'role': 'user', 'content': f"{key}: {content}"})

    response = client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=messages
    )
    print(response)
    gpt_response = response.choices[0].message.content.strip()
    print(gpt_response)
    return gpt_response

class ActionBookTicket(Action):

    def name(self) -> Text:
        return 'action_book_ticket'
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        city  = tracker.get_slot('destination')

        dispatcher.utter_message(text='I have booked a ticket to %s for you. The book return ')
        return []

from rasa_sdk import Tracker, ValidationAction
from rasa_sdk.types import DomainDict

class ValidatePredefinedSlots(ValidationAction):
    def validate_phone(self,slot_value: Any, dispatcher: CollectingDispatcher,
                       tracker: Tracker, domain: DomainDict,) -> Dict[Text, Any]:
        phone  = slot_value.replace('-', '')
        return {'phone': phone}

class ActionFallBack(Action):
    def name(self) -> Text:
        return 'action_out_of_scope'
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        print(tracker)
        question = tracker.latest_message['text']
        query = [
            {"question": f'{question}'},
            {"answer": "Sure, OpenAI is an AI research lab."},
            {"link": "https://www.openai.com."},
            {"additional_info": "OpenAI focuses on creating safe AI."}
        ]
        gpt_response = gptResponse(query)
        dispatcher.utter_message(gpt_response)
        return []

class providing_news_link(Action):
    def name(self) -> Text:
        return 'providing_news_link'
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        question = tracker.latest_message['text']
        print(f'flask getting: {question}')

        query = [
            {"question": f'{question}'},
            {"link": "https://www.mindef.gov.sg/web/portal/rsaf/news-and-publications/news"},
            {"additional_info": "This is a news link about the latest and past news about The republic of Singapore Air Force"}

        ]
        gpt_response = gptResponse(query)
        dispatcher.utter_message(gpt_response)
        return []

class providing_images_of_base(Action):
    def name(self) -> Text:
        return 'providing_images_of_base'
    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        question = tracker.latest_message['text']
        print(f'flask getting: {question}')

        query = [
            {"question": f'{question}'},
            {"link": "https://www.google.com/maps/place/Central+Manpower+Base/@1.280195,103.815126,17z/data=!3m1!4b1!4m6!3m5!1s0x31da1bd0af54732f:0x9c274decbab4e599!8m2!3d1.280195!4d103.815126!16s%2Fg%2F11c5bnkq01?entry=ttu"},
            {"ImgLink": "static/images/base_image.png"},
            {"additional_info": "This the image of the CMPB location and the google map link to it"}

        ]
        gpt_response = gptResponse(query)
        dispatcher.utter_message(gpt_response)
        return []