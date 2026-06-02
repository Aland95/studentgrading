export interface Student {
  id: number;
  name: string;
  grade: number;
}

let nextId = 4;

export const students: Student[] = [
  { id: 1, name: "Alice Johnson", grade: 94 },
  { id: 2, name: "Bob Martinez", grade: 78 },
  { id: 3, name: "Carol Smith", grade: 63 },
];

export function generateId(): number {
  return nextId++;
}

export function letterGrade(grade: number): string {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}
