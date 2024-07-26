const fs = require('fs');
const path = require('path');
const productsPath = path.join(__dirname, '../data/products.json');

const readProducts = () => {
  const data = fs.readFileSync(productsPath);
  return JSON.parse(data);
};

const writeProducts = (products) => {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
};

const getAllProducts = (req, res) => {
  const products = readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
};

const getProductById = (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
};

const addProduct = (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    ...req.body,
    status: true
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.pid));
  if (index !== -1) {
    const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
    products[index] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
};

const deleteProduct = (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === parseInt(req.params.pid));
  if (index !== -1) {
    products.splice(index, 1);
    writeProducts(products);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
};
