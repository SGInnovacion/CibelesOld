zip -ru dialogflow-webhook.zip *
echo 'Compressed. Deploying to AWS Lambda...'
aws lambda update-function-code --function-name auto-webhook --zip-file fileb://./dialogflow-webhook.zip > /dev/null
echo 'Deployment Complete'