import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {

  const cardProducts = cartData.map((cartProduct) => {

    // to find the cart product from productsData
    const foundOutProduct = productsData.find((product) => product["_id"] === cartProduct.productId);

    // object destructuring to remove _id
    const { _id, ...productWithoutId } = foundOutProduct;

    const cartItem = {
      ...productWithoutId,
      "productId": foundOutProduct["_id"],
      "qty": cartProduct.qty
    }

    return cartItem;
  })

  return cardProducts;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  // cost
  let price = 0;
  items.forEach((item) => {
    price += (item.cost * item.qty);
  })
  return price;
};

// TODO: CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {

  let totalItems = 0;
  items.forEach((item) => {
    totalItems += item["qty"];
  })
  return totalItems
};

// TODO: CHECKOUT - Add static quantity view for Checkout page cart
/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {

  if (isReadOnly) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      </Stack>
    );
  }

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  ...props
}) => {
  let history = useHistory();
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    // only run use effect if item changes
    const newCartProducts = generateCartItemsFrom(items, products);
    setCartProducts(newCartProducts);

  }, [items])

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }



  return (
    <>
      <Box className="cart">
        {/* TODO: CART - Display view for each cart item with non-zero quantity */}
        {
          cartProducts.map((cartProduct) => {
            return (
              <Box display="flex" alignItems="flex-start" padding="1rem" key={cartProduct.productId}>
                <Box className="image-container">
                  <img
                    // Add product image
                    src={cartProduct.image}
                    // Add product name as alt eext
                    alt={cartProduct.name}
                    width="100%"
                    height="100%"
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{cartProduct.name}</div>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <ItemQuantity
                      // Add required props by checking implementation
                      value={cartProduct.qty}
                      handleAdd={() => {
                        handleQuantity(
                          cartProduct.productId,
                          cartProduct.qty + 1, { preventDuplicate: false })

                      }
                      }

                      handleDelete={() => handleQuantity(
                        cartProduct.productId,
                        (cartProduct.qty - 1 < 0 ? 0 : cartProduct.qty - 1),
                        { preventDuplicate: false })}

                      isReadOnly={props.isReadOnly}
                    />
                    <Box padding="0.5rem" fontWeight="700">
                      ${cartProduct.cost}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })
        }
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartProducts)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          {!props.isReadOnly &&
            (
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                onClick={() => { history.push("/checkout"); }}
              >
                Checkout
              </Button>
            )
          }
        </Box>
      </Box>

      {props.isReadOnly &&
        <Box className="cart order-total">
          {/* TODO: CART - Display view for each cart item with non-zero quantity */}

          {/* Products Count */}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Products
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalItems(cartProducts)}
            </Box>
          </Box>

          {/* Subtotal */}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Subtotal
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(cartProducts)}
            </Box>
          </Box>

          {/* Shipping Charges */}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Shipping Charges
            </Box>
            <Box
              color="#3C3C3C"
              alignSelf="center"
              data-testid="cart-total"
            >
              $0
            </Box>
          </Box>
          {/* Order Total */}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(cartProducts)}
            </Box>
          </Box>

        </Box>
      }
    </>
  );
};

export default Cart;
