import {APIGatewayProxyHandler} from "aws-lambda";
import {handleError, HTTPError} from "../utils";
import dbConnect from "../db";
import selectProductById from "../db/selectProductById.sql";


export const getProductById: APIGatewayProxyHandler = async (event) => {
    console.log('getProductById lambda executed with event:', event);

    try {
        const client = await dbConnect();

        try {
            const {id} = event.pathParameters ?? {};
            if (!/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)) {
                throw new HTTPError({message: 'Wrong ID format', code: 400});
            }

            const response = await client.query(selectProductById, [id]);
            const product = response.rows;

            if (!product || product.length === 0) {
                throw new HTTPError({message: 'Not found', code: 404});
            }

            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                statusCode: 200,
                body: JSON.stringify(product[0])
            };

        } catch (err) {
            return handleError(err);
        } finally {
            client.end();
        }
    } catch (err) {
        return handleError(err);
    }
};
