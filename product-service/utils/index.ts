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
