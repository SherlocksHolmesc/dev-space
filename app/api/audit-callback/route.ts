import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the callback data for debugging
    console.log('Audit trail callback received:', body)
    
    // Here you would typically:
    // 1. Verify the callback is from MasChain
    // 2. Update the post status in your database
    // 3. Send notifications if needed
    
    // For now, we'll just acknowledge the callback
    return NextResponse.json({ 
      status: 'success', 
      message: 'Callback received successfully' 
    })
  } catch (error) {
    console.error('Audit callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Audit callback endpoint is active' 
  })
} 