import json
import requests
import boto3
from boto3.dynamodb.conditions import Key, Attr
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("moodtracker-289303-firebase-adminsdk-qlc7x-086ef6c390.json")
app = firebase_admin.initialize_app(cred)


dynamodb = boto3.resource('dynamodb')
lambdaClient = boto3.client('lambda')


def getMessageTokens():
    table = dynamodb.Table('moodtracker-users')
    resp = table.scan(
        FilterExpression=Attr('notification').eq(True),
        ProjectionExpression="messageToken"
        );
    messageTokens = resp["Items"]

    while 'LastEvaluatedKey' in resp:
        resp = table.scan(
            FilterExpression=Attr('notification').eq(True),
            ProjectionExpression="messageToken",
            ExclusiveStartKey=resp['LastEvaluatedKey']);
            
        messageTokens.extend(resp['Items'])
    
    return messageTokens

def main(event, context):
    
    messageTokenArray = getMessageTokens()

    print(messageTokenArray)

    resp = firebase_admin.messaging.subscribe_to_topic(messageTokenArray, 'moodtrackerTopic')
    

    print(response.success_count, 'tokens were subscribed successfully')

    
    # requests.post('https://fcm.googleapis.com/fcm/send')


    return messageTokenArray
