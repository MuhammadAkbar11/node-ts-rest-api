import mongoose from "mongoose";
import ProductModel, {
  IProductInput,
  ProductDocument,
} from "../models/product.model";
import logger from "../utils/logger.utils";

export async function createProductService(
  input: Omit<IProductInput, "productId">
) {
  try {
    return await ProductModel.create(input);
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}

export async function findProductService(
  query: mongoose.FilterQuery<ProductDocument>,
  opts: mongoose.QueryOptions = { lean: true }
) {
  try {
    return await ProductModel.find(query, {}, opts);
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}

export async function findOneProductService(
  query: mongoose.FilterQuery<ProductDocument>,
  opts: mongoose.QueryOptions = {}
) {
  try {
    return await ProductModel.findOne(query, {}, opts);
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}

export async function finAndUpdateProductService(
  query: mongoose.FilterQuery<ProductDocument>,
  update: Omit<IProductInput, "user" | "productId">,
  options: mongoose.QueryOptions = {}
) {
  try {
    return await ProductModel.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}
export async function deleteProductService(
  query: mongoose.FilterQuery<ProductDocument>
) {
  try {
    return await ProductModel.deleteOne(query);
  } catch (error: any) {
    logger.error(error);
    throw new Error(error);
  }
}
