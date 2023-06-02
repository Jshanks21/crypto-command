import prisma from '@/prisma/client';
import { Account } from '@prisma/client';

async function addTokenHandler(req: Request) {
  const { accounts, user_id }: { accounts: string[], user_id: number} = await req.json();  
  //console.log('accounts:', accounts)

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
      } 
    } catch (error: any) {
      console.log(`Error saving token ${account}:`, error);
      return new Response(JSON.stringify({ success: false, message: error}), { status: 500 });
    } 
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export { addTokenHandler as POST };