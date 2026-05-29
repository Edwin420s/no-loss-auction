import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';
import { Server, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

export const server = new Server('https://soroban-testnet.stellar.org');
export const networkPassphrase = Networks.TESTNET;

export async function connectFreighter() {
  const connected = await isConnected();
  if (!connected) {
    alert('Please install Freighter wallet and connect to Testnet');
    return null;
  }
  try {
    const publicKey = await getPublicKey();
    return publicKey;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getAccount(publicKey) {
  try {
    return await server.loadAccount(publicKey);
  } catch (e) {
    if (e.response?.status === 404) {
      // Account not funded – use friendbot in dev, but on testnet user must fund.
      throw new Error('Account not funded. Use friendbot or send testnet XLM.');
    }
    throw e;
  }
}

export async function signAndSend(txXdr) {
  const signedXdr = await signTransaction(txXdr);
  const tx = TransactionBuilder.fromXDR(signedXdr, networkPassphrase);
  const result = await server.sendTransaction(tx);
  await server.waitForTransaction(result.hash);
  return result;
}