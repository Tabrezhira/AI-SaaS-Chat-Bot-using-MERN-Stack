import { body, validationResult } from 'express-validator';
export const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const error = validationResult(req);
        if (error.isEmpty()) {
            return next();
        }
        return res.status(422).json({ error: error.array() });
    };
};
export const loginValidator = [
    body('email').trim().isEmail().withMessage('email is required'),
    body('password').trim().isLength({ min: 6 }).withMessage('password is required')
];
export const signupValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    ...loginValidator,
];
export const chatCompletionValidator = [
    body('message').notEmpty().withMessage('Message is required'),
];
//# sourceMappingURL=validators.js.map