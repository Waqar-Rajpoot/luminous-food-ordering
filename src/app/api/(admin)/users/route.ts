// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // Assuming you have a connection utility
import User from '@/models/User.model'; // Adjust path as needed

const PAGE_SIZE = 10;

export async function GET(req: NextRequest): Promise<NextResponse<any>> {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') as  'all' | null;

    const skip = (page - 1) * PAGE_SIZE;

    // --- 1. Construct the Query/Filter ---
    const filter: any = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      filter.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ];
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    // --- 2. Fetch Users ---
    const usersPromise = User.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(PAGE_SIZE)
      .skip(skip)
      .exec();

    // --- 3. Get Total Count for Pagination ---
    const totalUsersPromise = User.countDocuments(filter);

    // --- 4. Get Role Stats (Total count regardless of search/pagination for the dashboard cards) ---
    // NOTE: If you want stats to respect 'search', move the aggregation into the promise array.
    const statsPromise = User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    
    // Execute all database operations in parallel
    const [users, totalUsersCount, roleStats] = await Promise.all([
      usersPromise,
      totalUsersPromise,
      statsPromise,
    ]);

    // --- 5. Process Stats ---
    const stats: any = {
      total: 0,
      admin: 0,
      manager: 0,
      staff: 0,
      user: 0,
    };

    roleStats.forEach(stat => {
      stats[stat._id] = stat.count;
    });
    stats.total = stats.admin + stats.manager + stats.staff + stats.user;

    // --- 6. Calculate Pagination ---
    const totalPages = Math.ceil(totalUsersCount / PAGE_SIZE);

    return NextResponse.json({
      users: users,
      currentPage: page,
      totalPages,
      totalUsers: totalUsersCount,
      stats,
    });
  } catch (error) {
    console.error('Server error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users.', success: false }, { status: 500 });
  }
}