import { getUser, createUser, patchUser, deleteUser } from "./user.controller";
import {Router} from 'express';
const router = Router();

// Endpoint GET /user
router.get('/', getUser);

// Endpoint POST /user
router.post('/', createUser);

// Endpoint PATCH /user
router.patch('/', patchUser);

// Endpoint DELETE /user
router.delete('/', deleteUser);

export default router;