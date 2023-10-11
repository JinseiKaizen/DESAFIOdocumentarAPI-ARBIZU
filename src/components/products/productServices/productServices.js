const { error } = require("console")
const fs = require("fs")

class ProductServices {
    constructor() {
        this.path = "./src/data/productos.json"
    }

    async addProduct(product) {
        try {
            const { code } = product
            const products = await this.getProductsFromFile()

            const existingProduct = products.find(item => item.code === code)
            if (existingProduct) {
                return false
            }

            const newProduct = {
                id: this.getNextId(products),
                ...product
            }
            products.push(newProduct)
            await this.saveProductsToFile(products)
            return true
        }
        catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProductsFromFile()
            const product = products.find(product => product.id === id)
            if (!product) {
                return null
            }
            return product
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProductsFromFile()
            const index = products.findIndex(product => product.id === id)
            if (index !== -1) {
                const updatedProduct = {
                    ...products[index],
                    ...updatedFields
                }

                if (updatedFields.hasOwnProperty('id')) {
                    updatedProduct.id = products[index].id;
                    return false
                }

                products[index] = updatedProduct;
                this.saveProductsToFile(products)

                return true
            }
            else {
                return null
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProductsFromFile()
            const index = products.findIndex(product => product.id === id)
            if (index === -1) {
                return null
            }
            else {
                products.splice(index, 1)
                await this.saveProductsToFile(products)
                return true
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            console.log(error);
            return []
        }
    }

    async saveProductsToFile(products) {
        try {
            const data = JSON.stringify(products, null, 2)
            await fs.promises.writeFile(this.path, data)
        } catch (error) {
            console.log(error);
        }
    }

    getNextId(products) {
        if (products.length === 0) {
            return 1
        }
        const maxId = Math.max(...products.map(product => product.id))
        return maxId + 1
    }
}

module.exports = new ProductServices();