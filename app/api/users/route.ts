import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket, OkPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
}

// Get all users
export async function GET() {
  try {
    const users = await query<User[]>(
      'SELECT id, name, email, phone, dob FROM users'
    );
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Add new user
export async function POST(request: Request) {
    try {
      const { name, email, phone, dob } = await request.json();
      const result = await query<OkPacket>(
        'INSERT INTO users (name, email, phone, dob) VALUES (?, ?, ?, ?)',
        [name, email, phone, dob]
      );
      return NextResponse.json({ success: true, userId: result.insertId });
    } catch (error) {
      console.error('Error adding user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add user' },
        { status: 500 }
      );
    }
  }