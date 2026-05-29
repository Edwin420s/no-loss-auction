import { Contract, Address, nativeToScVal, scValToNative, TransactionBuilder, Account } from '@stellar/stellar-sdk';
import { server, networkPassphrase, getAccount, signAndSend } from './freighter';

// REPLACE WITH YOUR DEPLOYED CONTRACT ID AFTER DEPLOYMENT
export const CONTRACT_ID = 'CDJ3K...';

export async function invokeContract({ method, args, sourcePublicKey }) {
  const contract = new Contract(CONTRACT_ID);
  const account = await getAccount(sourcePublicKey);
  const builtTx = new TransactionBuilder(account, { fee: '10000', networkPassphrase })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();
  const txXdr = builtTx.toXDR();
  const result = await signAndSend(txXdr);
  return result;
}

export async function queryContract({ method, args }) {
  const contract = new Contract(CONTRACT_ID);
  const tx = new TransactionBuilder(new Account('G...', '0'), { fee: '10000', networkPassphrase })
    .addOperation(contract.call(method, ...args))
    .setTimeout(0)
    .build();
  const result = await server.simulateTransaction(tx);
  return scValToNative(result.result.retval);
}