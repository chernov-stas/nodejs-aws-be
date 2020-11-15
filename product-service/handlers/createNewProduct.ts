import {APIGatewayProxyHandler} from "aws-lambda";
import {handleError, HTTPError} from "../utils";
import dbConnect from "../db";
import insertProduct from "../db/insertProduct.sql";
import insertStocks from "../db/insertStocks.sql";


export const createNewProduct: APIGatewayProxyHandler = async (event) => {
    console.log('createNewProduct lambda executed with event:', event);

    try {
        const client = await dbConnect();

        try {
            const parsedRequest = JSON.parse(event.body);
            const {title, description, price, count} = parsedRequest;

            if (!title || typeof title !== 'string' ||
                !description || typeof description !== 'string' ||
                !price || typeof price !== 'number' ||
                !count || typeof count !== 'number'
            ) {
                throw new HTTPError({message: 'Wrong parameters provided', code: 400});
            }

            await client.query('BEGIN');

            const response = await client.query(insertProduct, [title, description, price]);
            const {id: productId} = response.rows[0];

            if (!productId) {
                await client.query('ROLLBACK');
                throw new HTTPError({message: 'Product was not added', code: 400});
            }

            await client.query(insertStocks, [productId, count]);

            await client.query("COMMIT");

            console.log(`Product with id ${productId} was successfully added`);

            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                statusCode: 200,
                body: JSON.stringify({
                    description,
                    title,
                    price,
                    count,
                    id: productId,
                }),
            };

        } catch (err) {
            await client.query('ROLLBACK');
            return handleError(err);
        } finally {
            client.end();
        }
    } catch (err) {
        return handleError(err);
    }
};
