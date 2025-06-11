import { NextResponse } from 'next/server';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const users: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? 'Admin' : 'User',
}));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedUsers = users.slice(startIndex, endIndex);
  
  return NextResponse.json({
    data: paginatedUsers,
    pagination: {
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit),
    },
  });
}