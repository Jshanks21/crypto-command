import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma/client';
import { getAllTokens } from '@/utils/getTokens';

async function tokenUpdateHandler(req: NextApiRequest, res: NextApiResponse) {
    //const { user } = req.body;

    // TODO: will need to check for user session and update user id accordingly before checking and assigning tokens to user
    try {
      // Fetch data from API
      const allTokens = await getAllTokens();

      //console.log('allTokens:', allTokens)

      // Check for errors or missing values
      if (!allTokens || allTokens.length === 0) {
        console.log('Error fetching token data:', allTokens);
        return;
      }

      for (const token of allTokens) {
        try {
          // Fetch existing record from database
          const existingToken = await prisma.token.findUnique({
            where: { contract_address: token.contract_address },
          });

          if (existingToken) {
            // Update existing record if necessary
            if (existingToken.balance !== token.balance || existingToken.quote !== token.quote || existingToken.quote_rate !== token.quote_rate) {
              await prisma.token.update({
                where: { contract_address: token.contract_address },
                data: {
                  balance: token.balance,
                  quote_rate: token.quote_rate,
                  quote: token.quote,
                },
              });
            }
          } else {
            // Create new record
            await prisma.token.create({
              data: {
                contract_symbol: token.contract_ticker_symbol,
                contract_address: token.contract_address,
                logo_url: token.logo_url,
                contract_decimals: token.contract_decimals,
                balance: token.balance,
                quote: token.quote,
                quote_rate: token.quote_rate,
                pretty_quote: token.pretty_quote,
                tracking: true,
                user: {
                  connect: { id: 1 } // will need to update for specific user sessions later
                }
              },
            });
          }
        } catch (error: any) {
          console.log(`Error saving token ${token.contract_ticker_symbol}:`, error);
          return new Response(JSON.stringify({ success: false, message: error}), { status: 500 });
        
        }
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error: any) {
      console.log('Error refreshing tokens:', error);
      return new Response(JSON.stringify({ success: false, message: error}), { status: 500 });
    }
}

export { tokenUpdateHandler as POST };