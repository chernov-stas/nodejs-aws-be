import {APIGatewayProxyHandler} from "aws-lambda";
import {getMockedProducts} from "../utils";

export const getProductsList: APIGatewayProxyHandler = async () => {

    try {
        const ProductsList = await getMockedProducts();

        if (!ProductsList || !ProductsList.length) {
            throw new Error('No products found');
        } else {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                statusCode: 200,
                body: JSON.stringify(ProductsList),
            };
        }

    } catch(err) {
        return {
            statusCode: 404,
            body: err.message
        };
    }
};
