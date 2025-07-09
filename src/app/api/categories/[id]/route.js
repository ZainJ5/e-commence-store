import  connectToDatabase  from '../../../lib/mongodb';
import Category from '../../../models/categories';

export async function DELETE(req, { params }) {
  await connectToDatabase();

  try {
    const deleted = await Category.findByIdAndDelete(params.id);
    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Category not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Category deleted' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
