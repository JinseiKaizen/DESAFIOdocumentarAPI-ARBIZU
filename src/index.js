const express = require("express")
const routes = require("./routes")
const handlebars = require("express-handlebars")
const socketIO = require('socket.io');
const http = require('http');
const fs = require('fs'); 


const PORT = 8080;

class Server {
    constructor() {
        this.app = express();
        this.server = http.Server(this.app);
        this.io = socketIO(this.server);
        this.settings();
        this.routes();
        this.socketEvents();
    }

    settings() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(`${__dirname}/public`))
        this.app.engine("handlebars", handlebars.engine())
        this.app.set("view engine", "handlebars")
        this.app.set('views', `${__dirname}/views`)
    }

    routes() {
        routes(this.app, this.io);
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            const productosPath = `${__dirname}/data/productos.json`;

            const sendProductos = () => {
                fs.readFile(productosPath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading productos.json:', err);
                        return;
                    }

                    const productos = JSON.parse(data);
                    socket.emit('productos', productos); 
                });
            };

            sendProductos();
        });
    }

    listen() {
        this.server.listen(PORT, () => {
            console.log(`Server running on: http://localhost:${PORT}`);
        });
    }
}

module.exports = new Server();