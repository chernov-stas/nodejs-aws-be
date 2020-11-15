import * as AWSMock from 'aws-sdk-mock';
import {importUploader} from './importUploader';

describe('importUploader handler', () => {

    beforeEach(() => {
        AWSMock.restore();
    });

    test('should return signedUrl and status code 200', async () => {
        const mockedUrl = 'https://test.com';
        await AWSMock.mock('S3', 'getSignedUrl', (_, __, cb) => {
            cb(null, mockedUrl);
        });
        const signedUrl = await importUploader({
            queryStringParameters: {
                name: 'test.csv'
            }
        } as any, null, null);

        expect((signedUrl as any).statusCode).toEqual(200);
        expect((signedUrl as any).body).toEqual(mockedUrl);
    });

    test('should return unexpected error and status code 500 on any error', async () => {
        const error = new Error('Test error');
        await AWSMock.mock('S3', 'getSignedUrl', () => {
            throw error;
        });
        const signedUrl = await importUploader({
            queryStringParameters: {
                name: 'test.csv'
            }
        } as any, null, null);

        expect((signedUrl as any).statusCode).toEqual(500);
        expect((signedUrl as any).body).toEqual('Unexpected error');
    });
})