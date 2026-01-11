// app/api/clinics/route.ts
export const dynamic = 'force-dynamic'; // or 'auto' or 'force-static'

// Your route handler will go here
export async function GET(request: Request) {
  return new Response(JSON.stringify({ message: 'Not implemented yet' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
}