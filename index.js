const express = require('express');
const db = require('./db/conn');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const calculateTotalValue = (products) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
};

app.get('/', (req, res) => {
    const search = req.query.search || '';
    const filter = req.query.filter || '';
    let query = 'SELECT * FROM products';
    let params = [];

    if (search) {
        query += ' WHERE name LIKE ?';
        params.push(`%${search}%`);
    }

    if (filter === 'low-stock') {
        query += search ? ' AND quantity < 10' : ' WHERE quantity < 10';
    } else if (filter === 'out-of-stock') {
        query += search ? ' AND quantity = 0' : ' WHERE quantity = 0';
    }

    db.query(query, params, (err, results) => {
        if (err) throw err;

        const totalValue = calculateTotalValue(results);
        res.render('index', { products: results, totalValue, search });
    });
});
app.get('/products/add', (req, res) => {
    res.render('add-product');
});

app.post('/products/add', (req, res) => {
    const { name, description, quantity, price } = req.body;
    const query = 'INSERT INTO products (name, description, quantity, price) VALUES (?, ?, ?, ?)';
    db.query(query, [name, description, quantity, price], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/products/edit/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [productId], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }

        const product = results[0];
        res.render('edit-product', { product });
    });
});

app.post('/products/edit/:id', (req, res) => {
    const { name, description, quantity, price } = req.body;
    const query = 'UPDATE products SET name = ?, description = ?, quantity = ?, price = ? WHERE id = ?';
    db.query(query, [name, description, quantity, price, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/products/delete/:id', (req, res) => {
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
