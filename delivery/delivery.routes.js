import { getDelivery, createDelivery, patchDelivery, deleteDelivery } from "./delivery.controller";
import {Router} from 'express';
const router = Router();

// Endpoint GET /Delivery
router.get('/', getDelivery);

// Endpoint POST /Delivery
router.post('/', createDelivery);

// Endpoint PATCH /Delivery
router.patch('/', patchDelivery);

// Endpoint DELETE /Delivery
router.delete('/', deleteDelivery);

export default router;