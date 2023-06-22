import prisma from '@/prisma/client';
import { getCombinedAccountData } from '@/utils/actions';
import { parse } from 'url';

async function getTokensHandler(req: Request) {
  const { query } = parse(req.url, true);
  const user_id = Array.isArray(query.user_id) ? query.user_id[0] : query.user_id;
  
  // Check for expected values
  if (!user_id) {
    console.log('Missing or Invalid user_id', user_id);
    return new Response(JSON.stringify({ success: false, message: 'Missing or Invalid user_id' }), { status: 400 });
  }

  try {
    const data = await prisma.account.findMany({
      where: {
        userId: parseInt(user_id)
      }
    })
    //console.log('data:', data)

    const allTokens = await getCombinedAccountData(data)
    return new Response(JSON.stringify({ success: true, data: allTokens }), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching tokens:', error)
    return new Response(JSON.stringify({ success: false, message: error}), { status: 500 });
  }
}

export { getTokensHandler as GET };