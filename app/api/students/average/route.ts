import { NextResponse } from "next/server";
import { students } from "../data";

export async function GET() {
  if (students.length === 0) {
    return NextResponse.json({ average: 0 });
  }
  const sum = students.reduce((acc, s) => acc + s.grade, 0);
  const average = Math.round((sum / students.length) * 10) / 10;
  return NextResponse.json({ average });
}
