const productos = require("../productServices/productServices.js")
class Products {

    async get(req, res) {
        try {
            const limit = Number(req.query.limit)
            const readProduct = await productos.getProductsFromFile()
            const productLimit = readProduct.slice(0, limit)

            if (!limit) {
                return res.json(readProduct)
            }

            res.json(await productLimit)
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ocurrió un error al obtener los productos' });

        }
    }

    async getPid(req, res) {
        try {
            let pid = Number(req.params.pid)

            if (isNaN(pid)) {
                return res.status(400).json({ error: 'El id no es un número' });
            }
            const product = await productos.getProductById(pid)

            if (!product) {
                return res.status(404).json({ error: `No se encontró ningún producto con el id ${pid}.` });
            }

            res.json(product);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ocurrió un error al obtener el producto' });

        }
    }

    async create(req, res) {
        try {
            const product = req.body;

            if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
                res.status(400).json({ error: 'Faltan campos obligatorios en el producto. No se puede agregar el producto.' })
            }

            const createProduct = await productos.addProduct(product)

            if (createProduct === false) {
                return res.status(400).json({ error: `Ya existe un producto con el código "${product.code}". No se puede agregar el producto.` });
            }

            res.json({ message: `Se agregó correctamente el producto con el código "${product.code}".` });

        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ocurrió un error al crear el producto' });
        }
    }

    async update(req, res) {
        try {
            let pid = Number(req.params.pid)
            const fields = req.body;

            if (isNaN(pid)) {
                return res.status(400).json({ error: 'El id no es un número' });
            }

            const product = await productos.updateProduct(pid, fields)

            if (product === false) {
                return res.status(400).json({ error: `No se puede modificar el ID del producto` });
            }

            if (!product) {
                return res.status(404).json({ error: `No se encontró ningún producto con el id ${pid}` });
            }

            res.status(200).json({ message: `Se actualizó el producto ${pid}` });

        }
        catch (error) {
            res.status(500).json({ error: 'Ocurrió un error al actualizar producto' });
        }
    }

    async delete(req, res) {
        try {
            let pid = Number(req.params.pid)
            const product = await productos.deleteProduct(pid);

            if (isNaN(pid)) {
                return res.status(400).json({ error: 'El id no es un número' });
            }

            if (!product) {
                return res.status(404).json({ error: `No se encontró ningún producto con el id ${pid}` });
            }

            res.json({ message: `Se eliminó correctamente el producto con el id ${pid}` });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ocurrió un error al eliminar el producto' });
        }
    }

}

module.exports = new Products();