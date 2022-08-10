import { Request, Response } from "express";
import { IProductInput } from "../models/product.model";
import {
  CreateProductInput,
  DeleteProduct,
  ReadProductInput,
  UpdateProductInput,
} from "../schema/product.schema";
import {
  createProductService,
  deleteProductService,
  finAndUpdateProductService,
  findOneProductService,
  findProductService,
} from "../services/product.service";
import logger from "../utils/logger.utils";

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const { title, description, image, price } = req.body;

  try {
    const post = await createProductService({
      title,
      description,
      image,
      price: +price,
      user: userId,
    });

    return res.status(200).json({
      message: "Success create a product",
      product: post,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;
  const { title, description, image, price } = req.body;
  logger.info(res.locals.user);
  try {
    const product = await findOneProductService({ productId });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission",
      });
    }

    const postUpdate: Omit<IProductInput, "user" | "productId"> = {
      title,
      description,
      image,
      price: +price,
    };

    const updatedProduct = await finAndUpdateProductService(
      { productId: productId },
      postUpdate,
      { new: true }
    );

    return res.status(201).json({
      message: "Success update product",
      product: updatedProduct,
    });
  } catch (error: any) {
    logger.error(error);
    if (error.kind == "ObjectId") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

export async function getListProductHandler(req: Request, res: Response) {
  try {
    const products = await findProductService({});

    return res.status(200).json({
      message: "Success get list product",
      products: products,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

export async function getProductHandler(
  req: Request<ReadProductInput["params"]>,
  res: Response
) {
  const productId = req.params.productId;

  try {
    const product = await findOneProductService({ productId });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Success get product",
      product: product,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

export async function deleteProductHandler(
  req: Request<DeleteProduct["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const productId = req.params.productId;

  try {
    const product = await findOneProductService({ productId });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You don't have permission",
      });
    }

    await deleteProductService({ productId: productId });

    return res.status(200).json({
      message: "Success delete product",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}
