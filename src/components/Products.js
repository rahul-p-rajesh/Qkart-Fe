import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debounceTimerId, setDebounceTimerId] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [userIsLogged, setUserIsLogged] = useState(false);

  useEffect(() => {
    performAPICall();


    // fetching user data from localstorage
    // passing user is logged in to product component
    let userName = localStorage.getItem('username');
    if (userName) {
      setUserIsLogged(true);
    } else {
      setUserIsLogged(false);
    }

    // to fetch cart 
    // - check if token exist in local storage if yes fetch it
    // - if token is there then call fetch cart api

    let userToken = localStorage.getItem('token');
    if (userToken && userToken !== "") {
      fetchCart(userToken);
    }


  }, [])



  // TODO: PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {

    let url = `${config.endpoint}/products`

    try {
      const response = await axios.get(url)

      if (response.status === 200) {
        let productList = response.data;
        updateProduct(productList);
        setIsLoading(false);
        return productList;

      } else {
        throw new Error(response);
      }

    } catch (error) {

      if (error.response === undefined) {
        console.log("Something went wrong. Check that the backend is running")

      }
      else if (error.response.status < 500 && error.response.status >= 400) {
        let msg = error.response.data.message;
        console.log(msg)

      } else {
        console.log("Something went wrong. Check that the backend is running")
      }
      return [];
    }

  }

  /**
  * takes the list of all the proudct and updates the state product
  *
  * @param { Array.<Product> } productsList
  *    takes a list of all the product 
  * */
  const updateProduct = (productsList) => {
    setProducts(productsList);
  }

  // TODO: PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

    if (text === "") {
      // if search text has been removed
      performAPICall();
      return;
    }
    let productList = [];
    let url = `${config.endpoint}/products/search?value=${text}`

    try {
      const response = await axios.get(url)
      if (response.status === 200) {
        productList = response.data;
      } else {
        throw new Error(response);
      }

    } catch (error) {

      if (error.response === undefined) {
        console.log("Something went wrong. Check that the backend is running")

      }
      else if (error.response.status < 500 && error.response.status >= 400) {
        let msg = error.response.data.message;
        console.log(msg)

      } else {
        console.log("Something went wrong. Check that the backend is running")
      }

    }
    setIsLoading(false);
    updateProduct(productList);
    return productList;


  };

  // TODO: PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {

    // clearing out the timer if it exist
    if (debounceTimeout !== "") {
      clearTimeout(debounceTimeout);
    }
    const searchText = event.target.value;
    setSearchText(searchText);

    let newTimeOutId = setTimeout(() => {
      performSearch(searchText);
    }, 500)

    setDebounceTimerId(newTimeOutId);
  };




  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    let url = `${config.endpoint}/cart`

    try {
      // TODO: CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setItems(response.data)
      return

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const productExist = items.some((item) => item.productId === productId);
    return productExist;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    // #1 if user is logged in
    if (!userIsLogged) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: 'warning',
      });
      return;
    }
    let productFinalQty = qty;
    if (options.preventDuplicate) {
      // if fn is called from productCard then preventDuplicate = true
      // check if product already exist there if true throw error
      const duplicateProductExist = isItemInCart(items, productId);
      productFinalQty = 1;
      if (duplicateProductExist) {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {
          variant: 'warning',
        });
        return;
      }
    }
    // to add a product to cart

    try {
      let url = `${config.endpoint}/cart`
      let data = { "productId": productId, "qty": productFinalQty };

      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setItems(response.data);

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });

      } else if (e.response && e.response.status === 404) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });

      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }

    }



  };

  /**
 * Main function handler to add products to the cart 
 *
 * @param {string} productId
 *    ID of the product that is to be added or updated in cart
 * @param {number} qty
 *    How many of the product should be in the cart
 * @param {boolean} options
 *    If this function was triggered from the product card's "Add to Cart" button
 *
 */
  const addToCartHandler = async (
    productId,
    qty,
    options
  ) => {

    let userToken = localStorage.getItem('token');

    addToCart(userToken, items, products, productId, qty, options)

  }

  let productWidth = 12;
  if (userIsLogged) {
    productWidth = 9;
  }


  return (
    <div>
      <Header>
        <Box sx={{ width: '40%' }}>
          <TextField
            className="search-desktop"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            value={searchText}
            onChange={(e) => debounceSearch(e, debounceTimerId)}
            name="search"
          />
        </Box>
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item className="product-grid" md={productWidth} >
          <Box className="hero" mb={3}>
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {isLoading &&
            <Box className="loading">
              <CircularProgress mb={1} />
              <p>Loading Products...</p>
            </Box>

          }

          {!isLoading && <Grid container spacing={{ xs: 2, md: 2 }}>
            {products.map((product) =>
              <Grid item xs={6} md={3} key={product._id}>
                <ProductCard product={product} handleAddToCart={addToCartHandler} />
              </Grid>
            )
            }
            {
              !isLoading && (products.length === 0) &&
              <Box className="loading">
                <SentimentDissatisfied />
                <p>No products found</p>
              </Box>
            }
          </Grid>}
        </Grid>

        {userIsLogged &&
          <Grid item className="card-background" xs={12} md={3} >
            <Cart
              items={items}
              products={products}
              handleQuantity={addToCartHandler}
            />
          </Grid>
        }
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;




