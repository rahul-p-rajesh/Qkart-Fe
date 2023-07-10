import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {

 

  return (
    <Card className="card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="h6">
          <strong>${product.cost}</strong>
        </Typography>
        <Rating name="rating"  value={product.rating} readOnly size="large"/>
      </CardContent>
      <CardActions className="card-actions">
        <Button variant="contained" className="card-button" onClick={() => handleAddToCart(product["_id"], 1, { preventDuplicate: true })}>
          <AddShoppingCartOutlined />
          ADD TO CART
        </Button>
      </CardActions>
      

    </Card>
  );
};

export default ProductCard;
