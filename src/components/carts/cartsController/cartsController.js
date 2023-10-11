const carts = require("../cartsServices/cartsServices.js")

class Carts {

    async get(req, res) {
        try {
            let cid = Number(req.params.cid)

            if (isNaN(cid)) {
                return res.status(400).send({ error: 'El id no es un número' });
            }

            const cart = await carts.getCartById(cid);

            if (!cart) {
                return res.status(404).send({ error: `No se encontró ningún carrito con el id ${cid}.` });
            }

            res.json(cart);
        }
        catch {
            console.error(error);
            res.status(500).json({ error: 'Ocurrió un error al obtener el carrito' });

        }
    }

    async create(req, res) {
        try {
            let newCart = await carts.createCart()

            res.status(201).json({ message: `Carrito creado con id: ${newCart.id}` })
        }
        catch {
            console.error(error);
            res.status(500).json({ error: 'Ocurrió un error al crear el carrito' });
        }
    }

    async add(req, res) {
        try {
            let cid = Number(req.params.cid)
            let pid = Number(req.params.pid)

            if (isNaN(cid) || isNaN(pid)) {
                return res.status(400).json({ error: 'El id no es un número' });
            }

            const AddToCart = await carts.addProductToCart(cid, pid)

            if (!AddToCart) {
                return res.status(404).send({ error: `No se encontró ningún carrito con el id ${cid}.` });
            }

            res.status(200).json({ message: `Se agregó el producto ${pid} al carrito ${cid}` });
        }
        catch {
            console.error(error);
            res.status(500).json({ error: 'Ocurrió un error al agregar el producto al carrito' });

        }
    }
}

module.exports = new Carts(); 