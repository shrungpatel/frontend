import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { Snackbar, Alert } from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  //const [added, setAdded] = useState(false);

  // Fetch all products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/getAll');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Something went wrong while fetching products. Please try again later.');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Ensure that the URL follows the same structure as your other API calls
      //const response = await axios.delete(`http://localhost:5000/api/products/delete/${id}`);
      const response = await axios.delete(`http://localhost:5000/api/products/${id}`);

      
      // Log the success response or handle accordingly
      console.log('Product deleted:', response.data);
      
      // Re-fetch the products list after deletion to reflect the change
      fetchProducts(); 
    } catch (error) {
      // Handle error and display an alert to the user
      alert('Could not delete product');
      console.error('Error deleting product:', error);
    }
  };

  // Function to handle product submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !storeName) {
      alert('Both fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/products/add', { productName, storeName });
      setProductName('');
      setStoreName('');
      alert('Product has been added');
      //setAdded(true);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // for the success message
  /*const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAdded(false);
  };*/

  // Function to handle search
  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/search?query=${searchQuery}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    } else {
      fetchProducts(); // Fetch all products if the search query is empty
    }
  };

  return (
    <div>
      <h1>Product Store List</h1>
      <div className='group'>
      <input
        type="text"
        placeholder="Search products or stores"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <br/>
      <button onClick={handleSearch}>Search</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <br/>
        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
        <br/>
        <button type="submit">Add Product</button>
      </form>
      
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
            <th
              style={{
                backgroundColor: 'lightcyan',
                padding: '10px',
                textAlign: 'center',
                width: '33%', // Set width for the column
              }}
            >
              Product
            </th>
            <th
              style={{
                backgroundColor: 'lightpink',
                padding: '10px',
                textAlign: 'center',
                width: '37%', // Set width for the column
              }}
            >
              Store
            </th>
            <th
              style={{
                backgroundColor: 'lightgreen',
                padding: '10px',
                textAlign: 'center',
                width: '30%', // Set width for the column
              }}
            >
              Purchased
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
              <td style={{ padding: '8px', textAlign: 'center', width: '33%' }}>
                {product.productName}
              </td>
              <td style={{ padding: '4px', textAlign: 'center', width: '37%' }}>
                {product.storeName}
              </td>
              <td style={{ padding: '2px', textAlign: 'center', width: '30%' }}>
                <button
                  onClick={() => handleDelete(product._id)}>
                    Delete
                </button>
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

<input
                  type="checkbox"
                  name="checkfield"
                  id={`checkbox-${product._id}`}
                  style={{ margin: '5px' }}
                  onClick={() => handleDelete(product._id)}
                />

<Snackbar
        added={added} // Open when true
        autoHideDuration={3000} // Auto hide after 3 seconds
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom', // Position at the bottom
          horizontal: 'center', // Center horizontally
        }}
      >
        <Alert
          onClose={handleClose}
          severity="success" // Set to "success" to show a green toast
          sx={{ width: '100%' }}
        >
          Product added successfully!
        </Alert>
      </Snackbar>
      */