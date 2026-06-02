import { NextRequest, NextResponse } from "next/server";
import { students, letterGrade } from "../data";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  const index = students.findIndex((s) => s.id === numId);

  if (index === -1) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const body = await request.json();
  const { grade } = body;

  if (typeof grade !== "number" || grade < 0 || grade > 100) {
    return NextResponse.json({ error: "Grade must be a number between 0 and 100" }, { status: 400 });
  }

  students[index].grade = grade;
  const updated = students[index];
  return NextResponse.json({ ...updated, letterGrade: letterGrade(updated.grade) });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  const index = students.findIndex((s) => s.id === numId);

  if (index === -1) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  students.splice(index, 1);
  return NextResponse.json({ success: true });
}
