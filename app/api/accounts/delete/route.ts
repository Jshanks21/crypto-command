import prisma from '@/prisma/client';

async function deleteAccountHandler(req: Request) {
  const { account, user_id }: { account: string, user_id: number } = await req.json();
 
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
      // Delete existing account
      await prisma.account.delete({
        where: { id: existingAccount.id },
      });
    } else {
      console.log(`Account ${account} not found in database or does not belong to user with id ${user_id}`);
      return new Response(JSON.stringify({ success: false, message: 'Account not found in database or does not belong to user' }), { status: 404 });
    }

  } catch (error: any) {
    console.log(`Error deleting account ${account}:`, error);
    if (error.code === 'P2016') {
      return new Response(JSON.stringify({ success: false, message: 'Account not found in database' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: false, message: error }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export { deleteAccountHandler as POST };