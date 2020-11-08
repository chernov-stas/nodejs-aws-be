import {APIGatewayProxyHandler} from "aws-lambda";
import dbConnect from "../db";
import getAllProducts from '../db/selectAllProducts.sql';
import {handleError, HTTPError} from "../utils";

export const getProductsList: APIGatewayProxyHandler = async (event) => {

    console.log('getProductsList lambda executed with event:', event);

    try {
        const client = await dbConnect();

        try {
            const response = await client.query(getAllProducts);
            const products = response.rows;

            if (!products || !products.length) {
                throw new HTTPError({message: 'No products found', code: 404});
            } else {
                return {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                    statusCode: 200,
                    body: JSON.stringify(products),
                };
            }

        } catch(err) {
            return handleError(err);
        } finally {
            client.end();
        }

    } catch (err) {
        return handleError(err);
    }
};
