SELECT products.id, description, title, price, count
FROM products
INNER JOIN stocks ON stocks.product_id = products.id AND products.id = $1