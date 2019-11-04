zip -ru webhook.zip *

if [ "$#" -eq  "0" ]; then
	
	echo 'Compressed.'
	echo 'Deploying Alexa to AWS Lambda...'
	aws configure set region us-east-1
	echo 'Region changed to us-east-1'
	aws lambda update-function-code --function-name ayto-webhook --zip-file fileb://./webhook.zip > /dev/null
	echo 'Done!'

	echo 'Deploying Dialogflow to AWS Lambda...'
	aws configure set region us-east-2
	echo 'Region changed to us-east-2'
	aws lambda update-function-code --function-name auto-webhook --zip-file fileb://./webhook.zip > /dev/null
	echo 'Done!'
	echo 'Deployment Complete'
	
else
	echo 'Compressed. Deploying Dialogflow to AWS Lambda...'
	aws configure set region us-east-2
	echo 'Region changed to us-east-2'
	aws lambda update-function-code --function-name auto-webhook --zip-file fileb://./webhook.zip > /dev/null
	echo 'Deployment Complete'
fi