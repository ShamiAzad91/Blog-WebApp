const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const authToken = req.headers['authorization']?.split(' ')[1];
    const refreshToken = req.headers['x-refresh-token'];

    if (!authToken || !refreshToken) {
        return res.status(401).json({ ok: false, message: 'Authentication required' });
    }

    jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // If access token is invalid, verify refresh token
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    return res.status(401).json({ ok: false, message: 'Invalid tokens. Please log in again.' });
                }

                // Generate new tokens
                const newAuthToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
                const newRefreshToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '10d' });

                // Send new tokens in response headers and body
                res.setHeader('Authorization', `Bearer ${newAuthToken}`);
                res.setHeader('x-refresh-token', newRefreshToken);
                res.status(200).json({ ok: true, newAuthToken, newRefreshToken });

                req.userId = refreshDecoded.userId;
                next();
            });
        } else {
            // Access token is valid
            req.userId = decoded.userId;
            next();
        }
    });
}

module.exports = checkAuth;
