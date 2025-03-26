import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_decode.id; // Use `id`, not `userId` (matches your token payload)

        // Admin Check (if needed)
        if (token_decode.email === process.env.ADMIN_EMAIL) {
            req.body.isAdmin = true;
        }

        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Invalid or Expired Token' });
    }
};

export default authUser;
