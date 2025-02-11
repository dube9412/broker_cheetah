import { NextResponse } from 'next/server';  // Vercel's serverless function response handling
import bcrypt from 'bcryptjs';  // For password comparison
import jwt from 'jsonwebtoken';  // For JWT token generation
import User from '../../../models/user';  // Ensure you have the User model properly imported

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';  // Use your JWT secret here

export async function POST(request) {
  // Parse the incoming request body
  const body = await request.json();
  const { email, password } = body;

  try {
    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }

    // Create the JWT token with the user's ID
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Check if the user is an admin
    const isAdmin = email === 'dube9412@gmail.com';  // Check if the user is an admin (you can replace this with actual logic)

    // Return success response with token and admin status
    return NextResponse.json({ success: true, token, isAdmin });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Server error' });
  }
}


