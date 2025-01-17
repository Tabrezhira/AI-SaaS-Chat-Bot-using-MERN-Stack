import User from '../models/User.js';
import { hash, compare } from 'bcrypt';
import { createToken } from '../utils/token-manager.js';
import { COOKIE_NAME } from '../utils/constants.js';
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json({ message: "ok", users });
    }
    catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};
export const UserSignup = async (req, res, next) => {
    try {
        //user signup
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(401).send("User already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: '/'
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: "localhost", expires, httpOnly: true, signed: true });
        return res.status(201).json({ message: "ok", id: user._id.toString() });
    }
    catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};
export const UserLogin = async (req, res, next) => {
    try {
        //user signup
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send('Incorrect password');
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: '/'
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: "localhost", expires, httpOnly: true, signed: true });
        return res.status(200).json({ message: "ok", id: user._id.toString() });
    }
    catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};
//# sourceMappingURL=user-controllers.js.map