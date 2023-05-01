import { getProduct, createProduct, patchProduct, deleteProduct } from "./product.controller";
import {Router} from 'express';
const router = Router();

// Endpoint GET /Product
router.get('/', getProduct);

// Endpoint POST /Product
router.post('/', createProduct);

// Endpoint PATCH /Product
router.patch('/', patchProduct);

// Endpoint DELETE /Product
router.delete('/', deleteProduct);

export default router;