import products from "../mocks/products.json";
import {Product} from "../models/Product";


export const getMockedProducts = async ():Promise<Array<Product>> => {
    return new Promise(
        (resolve) => setTimeout(
            () => resolve(products as Array<Product>),
            500
        )
    );
}

export class HTTPError extends Error {
    code: number;

    constructor(data){
        super(data.message);
        this.code = data.code;
    }
}

export const handleError = (err: HTTPError) => {
    console.error('Error occurred:', JSON.stringify(err));
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        statusCode: err.code,
        body: err.message
    };
}
