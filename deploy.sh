zip -ru dialogflow-webhook.zip *
echo 'Compressed. Deploying Dialogflow to AWS Lambda...'
aws configure set region us-east-2
aws lambda update-function-code --function-name auto-webhook --zip-file fileb://./dialogflow-webhook.zip > /dev/null
echo 'Done!'
echo 'Compressed. Deploying Alexa to AWS Lambda...'
aws configure set region us-east-1
aws lambda update-function-code --function-name ayto-webhook --zip-file fileb://./dialogflow-webhook.zip > /dev/null
echo 'Done!'
echo 'Deployment Complete'
