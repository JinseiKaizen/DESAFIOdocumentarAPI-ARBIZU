const socket = io();

        // Escuchar el evento 'productos' emitido por el servidor
        socket.on('productos', (productos) => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';

            productos.forEach((producto) => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `${producto.title} - ${producto.price}`;
                productList.appendChild(li);
            });
        });