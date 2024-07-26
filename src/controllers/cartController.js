const fs = require('fs');
const path = require('path');
const cartsPath = path.join(__dirname, '../data/carts.json');
const productsPath = path.join(__dirname, '../data/products.json');

const readCarts = () => {
  const data = fs.readFileSync(cartsPath);
  return JSON.parse(data);
};

const writeCarts = (carts) => {
  fs.writeFileSync(cartsPath, JSON.stringify(carts, null, 2));
};

const readProducts = () => {
  const data = fs.readFileSync(productsPath);
  return JSON.parse(data);
};

const createCart = (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: carts.length ? carts[carts.length - 1].id + 1 : 1,
    products: []
  };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
};

const getCartById = (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
};

const addProductToCart = (req, res) => {
  const carts = readCarts();
  const products = readProducts();
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  const product = products.find(p => p.id === parseInt(req.params.pid));
  if (cart && product) {
    const existingProduct = cart.products.find(p => p.product === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: product.id, quantity: 1 });
    }
    writeCarts(carts);
    res.status(201).json(cart);
  } else {
    res.status(404).json({ error: 'Cart or Product not found' });
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart
};
