# Webhook for Dialogflow in Cibeles Project

Work locally:

    npm install
    
Zip and upload the dialogflow-webhook.zip file to lambda:

    zip -r dialogflow-webhook.zip *

## Set up CLI for deployment

Install aws-cli:


    curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    unzip awscli-bundle.zip
    sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws

You can check the process succeded:

    aws --version

Set up credentials:

    aws configure
    
    #######################CONFIDENTIAL########################
    Access key ID: AKIATR6FRUBMJGQL6ZBW
    Secret access key: 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

For lambda deployment (takes a couple of minutes):

    ./deploy.sh
