import S3 from 'aws-sdk/clients/s3';
import AWS from 'aws-sdk';
import {S3Handler} from 'aws-lambda';
import csv from 'csv-parser';

import {BUCKET} from "../constants";

const processRecord = (Key, s3) => new Promise((resolve, reject) => {
    const params = {
        Bucket: BUCKET,
        Key,
    };

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream
        .pipe(csv())
        .on('data', (data) => {
            console.log(JSON.stringify(data, null, 4));
        })
        .on('end', resolve)
        .on('error', reject);
});

export const importParser: S3Handler = async (event) => {
    console.log('importParser lambda called with event: ', JSON.stringify(event, null, 4));

    try {
        const s3: S3 = new AWS.S3({region: 'eu-west-1'});
        const {Records} = event;

        for (const record of Records) {

            await processRecord(record.s3.object.key, s3);

            console.log(`Start copying from ${BUCKET}/${record.s3.object.key}`);

            const Key = record.s3.object.key.replace('uploaded', 'parsed');

            await s3
                .copyObject({
                    Bucket: BUCKET,
                    Key,
                    CopySource: `${BUCKET}/${record.s3.object.key}`,
                })
                .promise();

            await s3.deleteObject({Bucket: BUCKET, Key: record.s3.object.key}).promise();

            console.log(`Copied into ${BUCKET}/${Key}`);
        }


    } catch (err) {
        console.error(err);
        return;
    }
};