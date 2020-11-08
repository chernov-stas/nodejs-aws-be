import {APIGatewayProxyHandler} from "aws-lambda";
import {getMockedProducts} from "../utils";

export class HTTPError extends Error {
    code: number;

    constructor(data){
        super(data.message);
        this.code = data.code;
    }
}

export const getProductById: APIGatewayProxyHandler = async (event) => {

    try {
        const {id} = event.pathParameters ?? {};
        if (!/^[0-9]+$/.test(id)) {
            throw new HTTPError({message: 'Wrong ID format', code: 400});
        }

        const products = await getMockedProducts();
        const product = products.find(({id: productId}) => productId === id);

        if (!product) {
            throw new HTTPError({message: 'Not found', code: 404});
        }

        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
            body: JSON.stringify(product)
        };

    } catch(err) {
        return {
            statusCode: err.code,
            body: err.message
        };
    }
};
