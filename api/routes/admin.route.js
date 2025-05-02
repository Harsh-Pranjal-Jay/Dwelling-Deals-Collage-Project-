import expess from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { getUsers, getListingsDetails, deleteListing, deleteUser, getUserInfo, getListingInfo, updatePost } from '../controllers/admin.controller.js';

const router = expess.Router();

router.get('/getusers', verifyToken, getUsers);
router.get('/getposts', verifyToken, getListingsDetails);

router.post('/posts/update/:id', verifyToken, updatePost);
router.delete('/posts/delete/:id', verifyToken, deleteListing);
router.delete('/users/delete/:id', verifyToken, deleteUser);

router.get('/users/:id', verifyToken, getUserInfo);
router.get('/posts/:id', verifyToken, getListingInfo);

export default router;