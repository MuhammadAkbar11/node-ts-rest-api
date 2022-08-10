import mongoose from "mongoose";
import * as nanoid from "nanoid";
import { UserDocument } from "./user.model";

const setNanoId = nanoid.customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  10
);

export interface IProductInput {
  user: UserDocument["_id"];
  productId: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export interface ProductDocument extends IProductInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `PRODUCT_${setNanoId(8)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>(
  "Product",
  productSchema,
  "products"
);

export default ProductModel;
