import {APIGatewayProxyHandler} from 'aws-lambda';
import {S3} from 'aws-sdk';

import {BUCKET} from '../constants';

export const importUploader: APIGatewayProxyHandler = async (event) => {
    console.log('importUploader lambda called with event:  ', event);

    try {
        const {name} = event.queryStringParameters;
        const path = `uploaded/${name}`;

        const s3 = new S3({ region: 'eu-west-1' });

        const params = {
            Bucket: BUCKET,
            Key: path,
            Expires: 60,
            ContentType: 'text/csv',
        };

        const signedUrl = await s3.getSignedUrlPromise('putObject', params);

        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
            body: signedUrl,
        };
    } catch (err) {
        console.error('importUploader lambda threw error:  ', err);
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 500,
            body: 'Unexpected error'
        };
    }
};
