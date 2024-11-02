import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hash } from 'bcrypt';
import { OkPacket } from 'mysql2';

export async function POST(req: Request) {
  try {
    const { name, email, phone, dob, password } = await req.json();

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((existingUser as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Insert new user
    const result = await query<OkPacket>(
      'INSERT INTO users (name, email, phone, dob, password) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, dob, hashedPassword]
    );

    return NextResponse.json({ 
      success: true, 
      userId: result.insertId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}