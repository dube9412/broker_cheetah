import { NextResponse } from 'next/server';  // For Vercel serverless functions

export async function POST(request) {
  const body = await request.json();  // Get JSON data from the frontend
  const { email, password } = body;  // Extract email and password

  // Your logic to check credentials (replace this with your real logic)
  if (email === 'your-email@example.com' && password === 'your-password') {
    return NextResponse.json({
      success: true,
      isAdmin: email === 'dube9412@gmail.com',  // Check if the user is admin
    });
  } else {
    return NextResponse.json({
      success: false,
      message: 'Invalid credentials',
    });
  }
}
