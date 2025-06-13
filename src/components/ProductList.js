import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import sanitize from 'mongo-sanitize';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/getAll');
      setProducts(response.data);
    }
    catch (error) {
      console.error('Error fetching products:', error);
      alert('Something went wrong while fetching products. Please try again later.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const sanitized_id = sanitize(id);
      const response = await axios.delete(`http://localhost:5000/api/products/${sanitized_id}`);
      console.log('Product deleted:', response.data);
      fetchProducts();
    } catch (error) {
      alert('Could not delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName) {
      alert('Please specify the name of the product you intend to buy.');
      return;
    }
    console.log(storeName);
    let sanitized_store = "";
    if (storeName == "") {
      sanitized_store = "Any";
    }
    else {
      sanitized_store = sanitize(storeName)
    }
    console.log(sanitized_store);
    try {
      await axios.post('http://localhost:5000/api/products/add', { productName, storeName: sanitized_store });
      setProductName('');
      setStoreName('');
      alert('Product has been added');
      fetchProducts();
    }
    catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const searchQuerySanitized = sanitize(searchQuery);
        const response = await axios.get(`http://localhost:5000/api/products/search?query=${searchQuerySanitized}`);
        const any_response = await axios.get(`http://localhost:5000/api/products/search?query=Any`);
        // ... adds products with any store to the list
        response.data.push(...any_response.data);
        setProducts(response.data);
      }
      catch (error) {
        console.error('Error searching products:', error);
      }
    }
    else {
      fetchProducts();
    }
    cancelEdit();
  };

  const handleEdit = (product) => {
    setEditingProduct(product); // Set the product to edit
    setProductName(product.productName); // Set the form inputs with existing values
    setStoreName(product.storeName);
    fetchProducts();
  };

  const cancelEdit = () => {
    setProductName('');
    setStoreName('');
    setEditingProduct(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!productName) {
      alert('Please specify the product name.');
      return;
    }

    try {
      const updatedProduct = { productName, storeName };
      console.log('Editing product ID:', editingProduct._id);
      console.log('Updated product data:', updatedProduct);
      const response = await axios.put(`http://localhost:5000/api/products/update/${sanitize(editingProduct._id)}`, updatedProduct);
      console.log('Product updated:', response.data);
      fetchProducts();
    }
    catch (error) {
      console.error('Error updating product:', error);
      alert("Error: Please try editing your product later.");
    }
    cancelEdit();
  };

  return (
    <div>
      <h1>Product Store List</h1>

      <div className="group">
        <input
          type="text"
          placeholder="Search products or stores"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            borderBottom: '2px solid',
            outline: 'none',
          }}
        />
        <br />
        <br />
        <button onClick={handleSearch}>Search</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={{
            border: 'none',
            borderBottom: '2px solid',
            outline: 'none',
          }}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          style={{
            border: 'none',
            borderBottom: '2px solid',
            outline: 'none',
          }}
        />
        <br />
        <br />
        <button type="submit">Add Product</button>
      </form>

      {editingProduct && (
        <div>
          <h2>Edit Product</h2>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Edit Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '2px solid',
                outline: 'none',
              }}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Edit Store Name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '2px solid',
                outline: 'none',
              }}
            />
            <br />
            <br />
            <button type="submit">Update Product</button>
          </form>
          <button type="submit" onClick={cancelEdit}>Cancel</button>
        </div>
      )}

      <table
        className="table"
        style={{
          borderCollapse: 'separate',
          borderSpacing: '0 10px',
          width: '100%'
        }}
      >
        <thead>
          <tr>
            <th style={{ backgroundColor: 'lightcyan', padding: '10px', textAlign: 'center', width: '36%' }}>
              Product
            </th>
            <th style={{ backgroundColor: 'lightpink', padding: '10px', textAlign: 'center', width: '32%' }}>
              Store
            </th>
            <th style={{ backgroundColor: 'lightgreen', padding: '10px', textAlign: 'center', width: '24%' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product._id}
              style={{
                backgroundColor: '#f9f9f9',
                borderBottom: '1px solid #ddd',
              }}
            >
              <td style={{ padding: '8px', textAlign: 'center', width: '33%' }}>{product.productName}</td>
              <td style={{ padding: '4px', textAlign: 'center', width: '37%' }}>{product.storeName}</td>
              <td style={{ padding: '2px', textAlign: 'center', width: '30%' }}>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;

/*
const Recommendations = ({ shoppingList }) => {
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    const fetchRecommendations = async () => {
    const response = await axios.get('/api/recommendations', {
        params: { shoppingList },
      });
    setRecommendations(response.data);
  };
  fetchRecommendations();
  }, [shoppingList]);

  return (
    <div>
      <h2>Recommended Items</h2>
      <ul>
        {recommendations.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
*/