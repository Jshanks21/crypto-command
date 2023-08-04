import prisma from '@/prisma/client';

// POST /api/accounts/hide
// Hides an account from the user's account list
async function handler(req: Request) {
  const { account, user_id }: { account: string, user_id: number } = await req.json();

  // Check for expected values
  if (!account || !user_id) {
    console.log('Missing account or user_id');
    return new Response(JSON.stringify({ success: false, message: 'Missing account or user_id' }), { status: 400 });
  }
 
  try {
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      console.log(`User with id ${user_id} not found in database`);
      return new Response(JSON.stringify({ success: false, message: 'User not found in database' }), { status: 404 });
    }

    // Fetch account from database
    const existingAccount = await prisma.account.findUnique({
      where: { address: account },
    });

    if (existingAccount && existingAccount.userId === user_id) {
      // Set tracking field for existing account to false
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { tracking: false },
      });
    } else {
      console.log(`Account ${account} not found in database or does not belong to user with id ${user_id}`);
      return new Response(JSON.stringify({ success: false, message: 'Account not found in database or does not belong to user' }), { status: 404 });
    }

  } catch (error: any) {
    console.log(`Error deleting account ${account}:`, error);
    return new Response(JSON.stringify({ success: false, message: error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export { handler as POST };