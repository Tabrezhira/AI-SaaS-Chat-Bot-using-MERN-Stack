import { Router } from "express";
import { getAllUsers, UserLogin, UserSignup, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from '../utils/validators.js';
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post('/signup', validate(signupValidator), UserSignup);
userRoutes.post('/login', validate(loginValidator), UserLogin);
userRoutes.get('/auth-status', verifyToken, verifyUser);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map