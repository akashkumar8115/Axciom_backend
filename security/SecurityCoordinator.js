const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class SecurityCoordinator {
    constructor() {
        this.tokenSecret = process.env.JWT_SECRET || 'your-secret-key'
        this.tokenExpiration = '24h'
    }

    async hashPassword(password) {
        return bcrypt.hash(password, 10)
    }

    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash)
    }

    generateToken(payload) {
        return jwt.sign(payload, this.tokenSecret, { expiresIn: this.tokenExpiration })
    }

    verifyToken(token) {
        return jwt.verify(token, this.tokenSecret)
    }

    createAuthMiddleware() {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization?.split(' ')[1]
                if (!token) {
                    return res.status(401).json({ message: 'Authentication required' })
                }
                const decoded = this.verifyToken(token)
                req.user = decoded
                next()
            } catch (error) {
                res.status(401).json({ message: 'Invalid token' })
            }
        }
    }
}

module.exports = SecurityCoordinator
