import prisma from '@/prisma/client';
import { Token } from '@/utils/types';
import { getSingleAccountData } from '@/utils/actions';

async function getTokenDetailsHandler(req: Request, { params }: { params: { token_address: string } }) {
  const token_address = params.token_address;
  const { user_id }: { user_id: number } = await req.json();

  // Check for expected values
  if (!user_id || !token_address) {
    console.log('Missing user_id or token_address');
    return new Response(JSON.stringify({ success: false, message: 'Missing user_id or token_address' }), { status: 400 });
  }

  try {
    // Get all accounts
    const accounts = await prisma.account.findMany({
      where: {
        userId: user_id
      }
    })

    // Get token data for each account
    const tokenData: Token[][] = await Promise.all(accounts.map(async (account) => {
      return getSingleAccountData(account.address)
    }))

    // Flatten the arrays to have a single array with all tokens
    const allTokens: Token[] = tokenData.flat()

    // Filter the tokens to only include the selected token
    const selectedToken = allTokens.filter((token: Token) => {
      return token_address === token.contract_address
    })

    return new Response(JSON.stringify({ success: true, data: selectedToken }), { status: 200 });
  } catch (error: any) {
    console.error('Error fetching tokens:', error)
    return new Response(JSON.stringify({ success: false, message: error }), { status: 500 });
  }
}

export { getTokenDetailsHandler as GET };