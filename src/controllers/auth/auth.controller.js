import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../../models/users/users_model.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashed });

        res.status(201).json({ message: "Signup successful", status: true, userId: user.userId });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ error: 'Signup failed' });

    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res
            .cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only secure in production
                sameSite: 'lax', // More permissive for development
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({ message: "Login successful", status: true, userId: user.userId });
    } catch (err) {
        res.status(500).json({ error: err.message, status: false });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User authenticated", status: true, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const logout = (req, res) => {
    res
        .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })
        .json({ message: "Logout successful" });
};