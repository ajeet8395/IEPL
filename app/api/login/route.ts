import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user with all necessary data
    const users = await query<User[]>(
      'SELECT id, name, email, phone, dob, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isValid = await compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Prepare user data (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      dob: user.dob
    };

    const response = NextResponse.json({ 
      success: true, 
      token,
      userData // Include user data in response
    });
    
    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}