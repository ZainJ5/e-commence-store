import connectToDatabase  from '../../lib/mongodb';
import Category from '../../models/categories';

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const category = await Category.create({ name: body.name });
    return new Response(JSON.stringify(category), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const categories = await Category.find();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
