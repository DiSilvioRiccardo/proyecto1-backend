import { getRestaurant, createRestaurant, patchRestaurant, deleteRestaurant } from "./restaurant.controller";
import {Router} from 'express';
const router = Router();

// Endpoint GET /Restaurant
router.get('/', getRestaurant);

// Endpoint POST /Restaurant
router.post('/', createRestaurant);

// Endpoint PATCH /Restaurant
router.patch('/', patchRestaurant);

// Endpoint DELETE /Restaurant
router.delete('/', deleteRestaurant);

export default router;