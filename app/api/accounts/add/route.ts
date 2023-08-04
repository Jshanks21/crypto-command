import prisma from '@/prisma/client';

// POST /api/accounts/add
// Adds an account to the user's account list
async function handler(req: Request) {
  const { accounts, user_id }: { accounts: string[], user_id: number} = await req.json();  

  // Check for expected values
  if (accounts.length === 0 || !user_id) {
    console.log('Missing accounts or user_id');
    return new Response(JSON.stringify({ success: false, message: 'Missing accounts or user_id' }), { status: 400 });
  }

  for (const account of accounts) {
    try {
      // Fetch existing record from database
      const existingAccount = await prisma.account.findUnique({
        where: { address: account },
      });
      if (!existingAccount) {
        // Create new record
        await prisma.account.create({
          data: {
            address: account,
            //ens: account || null,
            tracking: true,
            user: {
              connect: { id: user_id }
            }
          },
        });        
      } else if (!existingAccount.tracking) {
        // If account already exists but tracking is false, set tracking to true
        await prisma.account.update({
          where: { id: existingAccount.id },
          data: { tracking: true },
        });
      } else {
        // Account already exists and is being tracked
        console.log(`Account ${account} already being tracked`);
        return new Response(JSON.stringify({ success: false, message: `Account ${account} already being tracked` }), { status: 409 });        
      }
      
    } catch (error: any) {
      console.log(`Error saving token ${account}:`, error);
      return new Response(JSON.stringify({ success: false, message: error}), { status: 500 });
    } 
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export { handler as POST };