/**
 * API Routes for Permission Requests
 * GET /api/permission-requests/[requestId] - Fetch request details
 * POST /api/permission-requests/[requestId] - Respond to request (approve/deny)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPermissionRequest, updatePermissionRequest, isRequestExpired } from '@/lib/permissions';
import type { LandownerResponse } from '@/lib/types';

export const dynamic = 'force-dynamic'; // Disable caching

/**
 * GET - Fetch permission request details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;

    console.log(`[API] Fetching permission request: ${requestId}`);

    // Fetch request from Firestore
    const permissionRequest = await getPermissionRequest(requestId);

    if (!permissionRequest) {
      return NextResponse.json(
        { error: 'Permission request not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (isRequestExpired(permissionRequest)) {
      return NextResponse.json(
        {
          error: 'This permission request has expired',
          expired: true,
        },
        { status: 410 } // 410 Gone
      );
    }

    // Return request data
    return NextResponse.json({
      success: true,
      data: permissionRequest,
    });
  } catch (error) {
    console.error('[API] Error in GET /api/permission-requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permission request' },
      { status: 500 }
    );
  }
}

/**
 * POST - Respond to permission request (approve/deny)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;

    console.log(`[API] Processing response for request: ${requestId}`);

    // Parse request body
    const body: LandownerResponse = await request.json();

    // Validate required fields
    if (!body.status || !body.landownerName) {
      return NextResponse.json(
        { error: 'Missing required fields: status, landownerName' },
        { status: 400 }
      );
    }

    // Validate status
    if (body.status !== 'approved' && body.status !== 'denied') {
      return NextResponse.json(
        { error: 'Invalid status. Must be "approved" or "denied"' },
        { status: 400 }
      );
    }

    // Validate landowner name
    if (body.landownerName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Landowner name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Update request in Firestore
    const updatedRequest = await updatePermissionRequest(requestId, body);

    console.log(`[API] Request ${requestId} ${body.status} successfully`);

    // TODO: Send notification to requester
    // - Push notification via FCM
    // - Email notification
    // - In-app notification

    return NextResponse.json({
      success: true,
      message: `Permission request ${body.status} successfully`,
      data: updatedRequest,
    });
  } catch (error: any) {
    console.error('[API] Error in POST /api/permission-requests:', error);

    // Handle specific errors
    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { error: 'Permission request not found' },
        { status: 404 }
      );
    }

    if (error.message?.includes('already')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 } // 409 Conflict
      );
    }

    return NextResponse.json(
      { error: 'Failed to process permission request response' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS - Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
