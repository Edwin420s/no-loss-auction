import { Server, Contract, Address, nativeToScVal } from '@stellar/stellar-sdk';
import * as SorobanClient from '@stellar/stellar-sdk/soroban';

// Replace with your deployed contract ID (after deployment)
export const CONTRACT_ID = 'CDJ3K...'; 

// Testnet setup
export const server = new Server('https://soroban-testnet.stellar.org');
export const networkPassphrase = 'Test SDF Network ; September 2025';

export function loadContract(contractId) {
  return new Contract(contractId);
}

// Helper to invoke a contract method
export async function invokeContract({ contractId, method, args, sourceAccount, signTransaction }) {
  const contract = loadContract(contractId);
  const txBuilder = new SorobanClient.TransactionBuilder(sourceAccount, { networkPassphrase, fee: '10000' })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30);
  let tx = txBuilder.build();
  tx = await signTransaction(tx);
  const result = await server.sendTransaction(tx);
  await server.waitForTransaction(result.hash);
  return result;
}