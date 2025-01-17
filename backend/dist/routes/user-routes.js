import { Router } from "express";
import { getAllUsers, UserLogin, UserSignup } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from '../utils/validators.js';
const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post('/signup', validate(signupValidator), UserSignup);
userRoutes.post('/login', validate(loginValidator), UserLogin);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map