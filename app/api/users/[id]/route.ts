import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
}

// Get user by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const users = await query<User[]>(
      "SELECT id, name, email, phone, dob FROM users WHERE id = ?",
      [params.id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: users[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email, phone, dob } = await request.json();
    await query(
      "UPDATE users SET name = ?, email = ?, phone = ?, dob = ? WHERE id = ?",
      [name, email, phone, dob, params.id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query("DELETE FROM users WHERE id = ?", [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
