import { NextRequest, NextResponse } from "next/server";
import { students, generateId, letterGrade } from "./data";

export async function GET() {
  const result = students.map((s) => ({ ...s, letterGrade: letterGrade(s.grade) }));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, grade } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof grade !== "number" || grade < 0 || grade > 100) {
    return NextResponse.json({ error: "Grade must be a number between 0 and 100" }, { status: 400 });
  }

  const student = { id: generateId(), name: name.trim(), grade };
  students.push(student);
  return NextResponse.json({ ...student, letterGrade: letterGrade(grade) }, { status: 201 });
}
