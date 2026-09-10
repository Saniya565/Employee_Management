import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const token = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({ token: token(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function logout(req, res) {
  res.json({ message: "Logged out successfully. Remove the token on the client." });
}
