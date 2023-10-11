const CartsRoutes = require("../components/carts")
const ProductsRoutes = require("../components/products")
const Products = require("../data/productos.json")

module.exports = (app, io) => {
    CartsRoutes(app);
    ProductsRoutes(app);

    app.get('/', (req, res) => {
        res.render('home', { Products })
    });

    app.get('/realtimeproducts', (req, res) => {
        res.render('realtimeProducts');
    });

}
