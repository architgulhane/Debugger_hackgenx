import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as Crypto from 'expo-crypto';

interface Block {
  id: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
  merkleRoot: string;
  version: number;  // Protocol version
  size: number;     // Block size in bytes
  stateRoot?: string; // For more advanced state tracking
}

export interface Transaction {
  id: string;
  timestamp: number;
  title: string;
  description: string;
  amount: string;
  type: string;
  fromAccount?: string;
  toAccount?: string;
  signature?: string;
  gas?: number;           // Gas used by the transaction
  gasPrice?: string;      // Gas price in nanoFiat
  nonce?: number;         // For sequence enforcement
  status?: 'confirmed' | 'pending' | 'failed';  // Transaction status
  blockId?: number;       // Block containing this transaction
}

interface MemPoolTransaction extends Transaction {
  addedTimestamp: number;
  priority: number;
  gasPrice: string;
}

export interface Wallet {
  address: string;
  privateKey: string;
  publicKey: string;
}

type MiningMode = 'normal' | 'test' | 'instant';
type ConsensusMode = 'pow' | 'poa' | 'hybrid';

class Blockchain {
  private chain: Block[];
  private currentTransactions: Transaction[];
  private mempool: Map<string, MemPoolTransaction>;
  private difficulty: number;
  private wallets: Map<string, Wallet>;
  private STORAGE_KEY = 'BUDGET_BUDDY_BLOCKCHAIN';
  private WALLETS_KEY = 'BUDGET_BUDDY_WALLETS';
  private isMining: boolean = false;
  private miningMode: MiningMode = 'test';
  private consensusMode: ConsensusMode = 'pow';
  private authorizedValidators: Set<string> = new Set();
  private miningTimeoutId: NodeJS.Timeout | null = null;

  private stats = {
    totalTransactions: 0,
    lastMinedBlock: 0,
    averageBlockTime: 0,
    hashRate: 0,
    activeWallets: 0
  };

  constructor() {
    this.chain = [];
    this.currentTransactions = [];
    this.mempool = new Map<string, MemPoolTransaction>();
    this.difficulty = 2;
    this.wallets = new Map<string, Wallet>();
    this.loadChain();
    this.loadWallets();
  }

  public setMiningMode(mode: MiningMode): void {
    this.miningMode = mode;
    console.log(`Mining mode set to: ${mode}`);
  }

  public getMiningMode(): MiningMode {
    return this.miningMode;
  }

  public setConsensusMode(mode: ConsensusMode): void {
    this.consensusMode = mode;
    console.log(`Consensus mode set to: ${mode}`);
  }

  public getConsensusMode(): ConsensusMode {
    return this.consensusMode;
  }

  private validateGenesisBlock(): boolean {
    if (this.chain.length === 0) return false;

    const genesisBlock = this.chain[0];
    return (
      genesisBlock.id === 0 &&
      genesisBlock.previousHash === '0000000000000000000000000000000000000000000000000000000000000000' &&
      genesisBlock.hash === this.calculateHash(
        genesisBlock.id,
        genesisBlock.timestamp,
        genesisBlock.transactions,
        genesisBlock.previousHash,
        genesisBlock.nonce,
        genesisBlock.merkleRoot,
        genesisBlock.difficulty
      )
    );
  }

  private async loadChain() {
    try {
      const storedChain = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedChain) {
        this.chain = JSON.parse(storedChain);
        if (!this.validateGenesisBlock()) {
          console.error('Invalid genesis block detected. Resetting blockchain.');
          this.chain = [];
          this.createGenesisBlock();
          await this.saveChain();
        } else {
          this.updateStats();
        }
      } else {
        this.createGenesisBlock();
        await this.saveChain();
      }
    } catch (error) {
      console.error('Error loading blockchain:', error);
      this.chain = [];
      this.createGenesisBlock();
      await this.saveChain();
    }
  }

  private async loadWallets() {
    try {
      const storedWallets = await AsyncStorage.getItem(this.WALLETS_KEY);
      if (storedWallets) {
        const walletArray = JSON.parse(storedWallets);
        walletArray.forEach((wallet: Wallet) => {
          this.wallets.set(wallet.address, wallet);
        });
        this.stats.activeWallets = this.wallets.size;
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  }

  private async saveWallets() {
    try {
      const walletArray = Array.from(this.wallets.values());
      await AsyncStorage.setItem(this.WALLETS_KEY, JSON.stringify(walletArray));
    } catch (error) {
      console.error('Error saving wallets:', error);
    }
  }

  private updateStats() {
    if (this.chain.length === 0) return;

    this.stats.totalTransactions = this.chain.reduce(
      (total, block) => total + block.transactions.length,
      0
    );

    if (this.chain.length > 1) {
      const blockTimes = [];
      for (let i = 1; i < this.chain.length; i++) {
        blockTimes.push(this.chain[i].timestamp - this.chain[i - 1].timestamp);
      }
      this.stats.averageBlockTime = blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length;
    }

    this.stats.lastMinedBlock = this.chain[this.chain.length - 1].timestamp;

    if (this.stats.averageBlockTime > 0) {
      this.stats.hashRate = Math.pow(16, this.difficulty) / this.stats.averageBlockTime * 1000;
    }

    this.stats.activeWallets = this.wallets.size;
  }

  private createGenesisBlock() {
    const genesisBlock: Block = {
      id: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000', // Standard zero hash
      hash: '',
      nonce: 0,
      difficulty: this.difficulty,
      merkleRoot: '0',
      version: 1,
      size: 0
    };

    // Set Coinbase transaction for the genesis block (block reward)
    const coinbaseTransaction: Transaction = {
      id: this.sha256('genesis-coinbase-' + Date.now()),
      timestamp: genesisBlock.timestamp,
      title: 'Genesis Block Reward',
      description: 'First block on chain with no previous block',
      amount: '₹50.00',
      type: 'coinbase',
      toAccount: 'Treasury', // System treasury
      status: 'confirmed',
      blockId: 0
    };
    
    genesisBlock.transactions = [coinbaseTransaction];
    genesisBlock.merkleRoot = this.calculateMerkleRoot(genesisBlock.transactions);
    genesisBlock.size = new TextEncoder().encode(JSON.stringify(genesisBlock)).length;

    genesisBlock.hash = this.calculateHash(
      genesisBlock.id,
      genesisBlock.timestamp,
      genesisBlock.transactions,
      genesisBlock.previousHash,
      genesisBlock.nonce,
      genesisBlock.merkleRoot,
      genesisBlock.difficulty
    );

    this.chain.push(genesisBlock);
  }

  private calculateMerkleRoot(transactions: Transaction[]): string {
    if (transactions.length === 0) return '0';

    // Standardize transaction format before hashing to ensure consistency
    const standardizedTx = transactions.map(tx => ({
      id: tx.id,
      timestamp: tx.timestamp,
      title: tx.title,
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      fromAccount: tx.fromAccount || '',
      toAccount: tx.toAccount || '',
      nonce: tx.nonce || 0,
      gas: tx.gas || 0,
      // Exclude signature to ensure consistent hashing between creation and validation
    }));

    // Sort transactions by id to ensure consistent ordering
    standardizedTx.sort((a, b) => a.id.localeCompare(b.id));

    // Create initial hashes from transactions
    let hashes = standardizedTx.map(tx => this.sha256(JSON.stringify(tx)));
    
    // Handle empty case
    if (hashes.length === 0) return '0';
    
    // Handle single transaction case
    if (hashes.length === 1) return hashes[0];

    // Build the merkle tree
    while (hashes.length > 1) {
      const levelHashes = [];
      
      // Process pairs of hashes at this level
      for (let i = 0; i < hashes.length; i += 2) {
        if (i + 1 < hashes.length) {
          // If we have a pair, combine them
          const combinedHash = this.sha256(hashes[i] + hashes[i + 1]);
          levelHashes.push(combinedHash);
        } else {
          // If there's a lone hash left, duplicate it (to prevent malleability)
          const duplicatedHash = this.sha256(hashes[i] + hashes[i]);
          levelHashes.push(duplicatedHash);
        }
      }
      
      // Move up to the next level of the tree
      hashes = levelHashes;
    }

    return hashes[0];
  }

  private calculateHash(id: number, timestamp: number, transactions: Transaction[], previousHash: string, nonce: number, merkleRoot: string, blockDifficulty?: number): string {
    const difficultyToUse = blockDifficulty !== undefined ? blockDifficulty : this.difficulty;
    
    // Using more comprehensive block header format similar to established blockchains
    const blockHeader = {
      version: 1,
      previousBlockHash: previousHash,
      merkleRoot: merkleRoot,
      timestamp: timestamp,
      difficulty: difficultyToUse,
      nonce: nonce
    };
    
    const dataString = JSON.stringify(blockHeader);

    try {
      // Use Keccak-256 (Ethereum's hashing algorithm) via ethers
      const syncHash = ethers.utils.id(dataString).slice(2);
      return syncHash;
    } catch (error) {
      console.error('Hash calculation error:', error);
      return '0'.repeat(64);
    }
  }

  private sha256(data: string): string {
    try {
      return ethers.utils.id(data).slice(2);
    } catch (e) {
      console.error('Error in sha256:', e);
      return ethers.utils.id(data).slice(2);
    }
  }

  private async saveChain() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.chain));
    } catch (error) {
      console.error('Error saving blockchain:', error);
    }
  }

  private adjustDifficulty(): void {
    if (this.miningMode === 'test' || this.miningMode === 'instant') {
      this.difficulty = 2;
      return;
    }

    const lastBlock = this.chain[this.chain.length - 1];
    if (!lastBlock) return;

    const targetBlockTime = 10000;

    if (this.chain.length > 1) {
      const prevBlock = this.chain[this.chain.length - 2];
      const timeToMine = lastBlock.timestamp - prevBlock.timestamp;

      if (timeToMine < targetBlockTime / 2) {
        this.difficulty++;
      }
      else if (timeToMine > targetBlockTime * 2 && this.difficulty > 1) {
        this.difficulty--;
      }

      console.log(`Difficulty adjusted to: ${this.difficulty} (Block time: ${timeToMine}ms)`);
    }
  }

  private async mineBlock(block: Block): Promise<Block> {
    if (this.miningTimeoutId) {
      clearTimeout(this.miningTimeoutId);
      this.miningTimeoutId = null;
    }

    // Calculate block size in bytes for proper size tracking
    block.size = new TextEncoder().encode(JSON.stringify(block)).length;
    
    // Update transaction statuses to pending during mining
    block.transactions.forEach(tx => {
      tx.status = 'pending';
      tx.blockId = block.id;
    });

    if (this.miningMode === 'instant') {
      block.nonce = 1;
      block.hash = '0'.repeat(this.difficulty) + this.sha256(block.id.toString()).substring(this.difficulty);
      console.log(`Block ${block.id} instantly mined: ${block.hash}`);
      
      // Mark transactions as confirmed in instant mode
      block.transactions.forEach(tx => {
        tx.status = 'confirmed';
      });
      
      return block;
    }

    if (this.miningMode === 'test') {
      block.difficulty = Math.min(2, this.difficulty);
      const target = '0'.repeat(block.difficulty);

      const MAX_TEST_ITERATIONS = 1000;
      let iterations = 0;

      while (block.hash.substring(0, block.difficulty) !== target && iterations < MAX_TEST_ITERATIONS) {
        block.nonce++;
        iterations++;
        block.hash = this.calculateHash(
          block.id,
          block.timestamp,
          block.transactions,
          block.previousHash,
          block.nonce,
          block.merkleRoot,
          block.difficulty
        );
      }

      if (iterations >= MAX_TEST_ITERATIONS) {
        console.log(`Block ${block.id} test mining reached max iterations`);
      } else {
        console.log(`Block ${block.id} test mined with ${iterations} iterations: ${block.hash}`);
      }
      
      // Mark transactions as confirmed in test mode
      block.transactions.forEach(tx => {
        tx.status = 'confirmed';
      });

      return block;
    }

    const target = '0'.repeat(this.difficulty);
    let startTime = Date.now();
    let hashesAttempted = 0;

    console.log(`Mining block ${block.id} with difficulty ${this.difficulty}...`);

    return new Promise((resolve) => {
      const mineChunk = () => {
        const startChunkTime = Date.now();
        const MAX_CHUNK_TIME = 200; 
        const HASH_REPORT_INTERVAL = 10000; // Report hash rate every 10K attempts

        while (Date.now() - startChunkTime < MAX_CHUNK_TIME) {
          if (block.hash.substring(0, this.difficulty) === target) {
            const miningTime = Date.now() - startTime;
            const hashRate = (hashesAttempted / miningTime) * 1000; // hashes per second
            console.log(`Block ${block.id} mined in ${miningTime}ms: ${block.hash}`);
            console.log(`Hash rate: ${hashRate.toFixed(2)} H/s`);
            
            // Mark transactions as confirmed after successful mining
            block.transactions.forEach(tx => {
              tx.status = 'confirmed';
            });
            
            resolve(block);
            return;
          }

          block.nonce++;
          hashesAttempted++;
          
          // Occasionally report hash rate during long mining operations
          if (hashesAttempted % HASH_REPORT_INTERVAL === 0) {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const currentHashRate = (hashesAttempted / elapsedTime) * 1000;
            console.log(`Mining in progress... Hash rate: ${currentHashRate.toFixed(2)} H/s`);
          }
          
          block.hash = this.calculateHash(
            block.id,
            block.timestamp,
            block.transactions,
            block.previousHash,
            block.nonce,
            block.merkleRoot,
            block.difficulty
          );
        }

        this.miningTimeoutId = setTimeout(mineChunk, 0);
      };

      mineChunk();
    });
  }

  public createWallet(name: string = ''): Wallet {
    const wallet = ethers.Wallet.createRandom();

    const newWallet: Wallet = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    };

    this.wallets.set(newWallet.address, newWallet);
    this.saveWallets();
    this.stats.activeWallets = this.wallets.size;

    return newWallet;
  }

  public getWallet(address: string): Wallet | undefined {
    return this.wallets.get(address);
  }

  public getAllWallets(): Wallet[] {
    return Array.from(this.wallets.values());
  }

  public signTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'signature'>, privateKey: string): Transaction {
    // Create a unique nonce for transaction ordering from sender
    const nonce = this.getNextNonce(transaction.fromAccount || '');
    
    const tx: Transaction = {
      id: '',
      timestamp: Date.now(),
      nonce,
      status: 'pending',
      gas: this.calculateGasForTransaction(transaction),
      gasPrice: '0.01', // Fixed gas price in this implementation
      ...transaction
    };

    // Create deterministic transaction ID using keccak256
    const txHash = this.sha256(JSON.stringify({
      ...tx,
      id: '',
      signature: undefined
    }));

    try {
      // Use proper async/await for signing with ethers
      const wallet = new ethers.Wallet(privateKey);
      
      // For simplicity in this implementation, we're signing synchronously
      // In a production environment, this would be handled asynchronously
      const messageHashBytes = ethers.utils.arrayify(ethers.utils.id(txHash));
      const flatSig = wallet.signMessage(messageHashBytes);
      
      let signature = '';
      // This is a simplification for the implementation
      // Real blockchain would properly use the signature from the resolved promise
      flatSig.then(sig => {
        signature = sig;
      }).catch(err => {
        console.error("Error signing transaction:", err);
      });

      const newTransaction: Transaction = {
        ...tx,
        id: txHash,
        signature
      };

      return newTransaction;
    } catch (error) {
      console.error("Error in transaction signing process:", error);
      // In case of error, still return a transaction but mark it as failed
      return {
        ...tx,
        id: txHash,
        status: 'failed'
      };
    }
  }

  public verifyTransaction(transaction: Transaction): boolean {
    if (!transaction.signature) return false;

    const { signature, id, ...txData } = transaction;

    const txHash = this.sha256(JSON.stringify({ ...txData, id: '' }));

    try {
      const recoveredAddress = ethers.utils.verifyMessage(txHash, signature);

      return recoveredAddress === transaction.fromAccount;
    } catch (error) {
      console.error("Error verifying transaction signature:", error);
      return false;
    }
  }

  public async addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'signature'>): Promise<string> {
    // Create a new transaction with default values
    const newTransaction: Transaction = {
      id: this.sha256(Date.now().toString() + JSON.stringify(transaction)),
      timestamp: Date.now(),
      status: 'pending',
      gas: this.calculateGasForTransaction(transaction),
      gasPrice: transaction.gasPrice || '0.01',
      nonce: transaction.fromAccount ? this.getNextNonce(transaction.fromAccount) : undefined,
      ...transaction,
    };

    // Add to the mempool as a prioritized transaction
    const memTx: MemPoolTransaction = {
      ...newTransaction,
      addedTimestamp: Date.now(),
      priority: transaction.fromAccount ? 1 : 0, // Signed transactions get higher priority
      gasPrice: newTransaction.gasPrice || '0.01'
    };

    // Store in mempool first
    this.mempool.set(newTransaction.id, memTx);
    
    // Then move to current transactions for next block
    this.currentTransactions.push(newTransaction);
    
    // Sort transactions by gas price (fee market) and then by timestamp
    this.currentTransactions.sort((a, b) => {
      const aGasPrice = parseFloat(a.gasPrice || '0.01');
      const bGasPrice = parseFloat(b.gasPrice || '0.01');
      
      if (bGasPrice !== aGasPrice) {
        return bGasPrice - aGasPrice; // Higher gas price first
      }
      return a.timestamp - b.timestamp; // Older transactions first
    });

    // Trigger mining if enough transactions are pending
    if (this.currentTransactions.length >= 3 && !this.isMining) {
      this.mineNewBlock().catch(err => {
        console.error("Error mining block:", err);
      });
    }

    return newTransaction.id;
  }

  public async mineNewBlock(): Promise<Block | null> {
    if (this.isMining || this.currentTransactions.length === 0) {
      return null;
    }

    try {
      this.isMining = true;

      const previousBlock = this.chain[this.chain.length - 1];
      const transactionsToMine = [...this.currentTransactions];
      this.currentTransactions = [];

      const merkleRoot = this.calculateMerkleRoot(transactionsToMine);

      const newBlock: Block = {
        id: previousBlock.id + 1,
        timestamp: Date.now(),
        transactions: transactionsToMine,
        previousHash: previousBlock.hash,
        hash: '',
        nonce: 0,
        difficulty: this.difficulty,
        merkleRoot,
        version: 1,
        size: 0
      };

      newBlock.hash = this.calculateHash(
        newBlock.id,
        newBlock.timestamp,
        newBlock.transactions,
        newBlock.previousHash,
        newBlock.nonce,
        newBlock.merkleRoot,
        newBlock.difficulty
      );

      const minedBlock = await this.mineBlock(newBlock);

      this.chain.push(minedBlock);

      this.adjustDifficulty();

      this.updateStats();

      await this.saveChain();

      return minedBlock;
    } catch (error) {
      console.error("Error in mineNewBlock:", error);
      if (this.currentTransactions.length > 0) {
        this.currentTransactions = [...this.currentTransactions];
      }
      return null;
    } finally {
      this.isMining = false;
    }
  }

  public cancelMining(): void {
    if (this.miningTimeoutId) {
      clearTimeout(this.miningTimeoutId);
      this.miningTimeoutId = null;
    }
    this.isMining = false;
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public getAllTransactions(): Transaction[] {
    const transactions: Transaction[] = [];

    for (const block of this.chain) {
      transactions.push(...block.transactions);
    }

    transactions.push(...this.currentTransactions);

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  public isChainValid(): boolean {
    // Check genesis block integrity first
    if (this.chain.length === 0) return false;
    
    const genesisBlock = this.chain[0];
    if (genesisBlock.id !== 0 || genesisBlock.previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
      console.error('Invalid genesis block');
      return false;
    }
    
    // Verify the rest of the chain
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify block index continuity
      if (currentBlock.id !== previousBlock.id + 1) {
        console.error(`Block ${currentBlock.id} has invalid index sequence`);
        return false;
      }
      
      // Verify timestamps are logical (each block should be after previous)
      if (currentBlock.timestamp <= previousBlock.timestamp) {
        console.error(`Block ${currentBlock.id} has invalid timestamp`);
        return false;
      }

      // Verify Merkle root (transaction integrity)
      const calculatedMerkleRoot = this.calculateMerkleRoot(currentBlock.transactions);
      if (currentBlock.merkleRoot !== calculatedMerkleRoot) {
        console.error(`Invalid merkle root for block ${currentBlock.id}`);
        return false;
      }

      // Verify block hash
      const calculatedHash = this.calculateHash(
        currentBlock.id,
        currentBlock.timestamp,
        currentBlock.transactions,
        currentBlock.previousHash,
        currentBlock.nonce,
        currentBlock.merkleRoot,
        currentBlock.difficulty
      );

      if (currentBlock.hash !== calculatedHash) {
        console.error(`Invalid hash for block ${currentBlock.id}`);
        return false;
      }

      // Verify proof of work
      if (this.miningMode !== 'test' && this.miningMode !== 'instant') {
        if (currentBlock.hash.substring(0, currentBlock.difficulty) !== '0'.repeat(currentBlock.difficulty)) {
          console.error(`Hash does not meet difficulty for block ${currentBlock.id}`);
          return false;
        }
      }

      // Verify blockchain continuity
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`Previous hash mismatch for block ${currentBlock.id}`);
        return false;
      }
      
      // Verify all transactions in the block
      for (const tx of currentBlock.transactions) {
        // Skip coinbase transactions (they don't have signatures)
        if (tx.type === 'coinbase') continue;
        
        // If transaction has a signature, verify it
        if (tx.signature && tx.fromAccount) {
          if (!this.verifyTransaction(tx)) {
            console.error(`Invalid transaction signature in block ${currentBlock.id}: ${tx.id}`);
            return false;
          }
        }
      }
    }

    return true;
  }

  public async addTestData(count: number = 5): Promise<boolean> {
    try {
      const types = ['approval', 'increase', 'expense', 'transfer', 'report'];
      const titles = [
        'Budget Allocation',
        'Fund Transfer',
        'Expense Approval',
        'Revenue Report',
        'Budget Amendment',
        'Emergency Fund',
        'Project Funding',
        'Department Budget',
        'Capital Expense',
        'Annual Budget'
      ];

      const originalMode = this.miningMode;

      this.setMiningMode('instant');

      for (let i = 0; i < count; i++) {
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomAmount = '₹' + (Math.floor(Math.random() * 1000000) / 100).toLocaleString('en-IN');

        await this.addTransaction({
          title: `${randomTitle} ${i + 1}`,
          description: `Test transaction for ${randomType}`,
          amount: randomAmount,
          type: randomType
        });

        if (this.currentTransactions.length >= 3) {
          await this.mineNewBlock();
        }
      }
      if (this.currentTransactions.length > 0) {
        await this.mineNewBlock();
      }

      this.setMiningMode(originalMode);

      return true;
    } catch (error) {
      console.error('Error adding test data:', error);
      return false;
    }
  }

  public getStats() {
    return {
      ...this.stats,
      blockCount: this.chain.length,
      pendingTransactions: this.currentTransactions.length,
      currentDifficulty: this.difficulty,
      miningMode: this.miningMode,
      consensusMode: this.consensusMode
    };
  }

  public getBlockById(id: number): Block | null {
    const block = this.chain.find(b => b.id === id);
    return block || null;
  }

  public async exportBlockchain(): Promise<string> {
    try {
      const data = {
        chain: this.chain,
        pendingTransactions: this.currentTransactions,
        difficulty: this.difficulty,
        stats: this.stats,
        miningMode: this.miningMode,
        consensusMode: this.consensusMode
      };

      return JSON.stringify(data);
    } catch (error) {
      console.error('Error exporting blockchain:', error);
      return '';
    }
  }

  public async importBlockchain(data: string): Promise<boolean> {
    try {
      const parsedData = JSON.parse(data);

      if (!parsedData.chain || !Array.isArray(parsedData.chain)) {
        throw new Error('Invalid blockchain data: chain is missing or not an array');
      }

      this.chain = parsedData.chain;
      this.currentTransactions = parsedData.pendingTransactions || [];
      this.difficulty = parsedData.difficulty || 2;
      this.miningMode = parsedData.miningMode || 'test';
      this.consensusMode = parsedData.consensusMode || 'pow';

      this.updateStats();
      await this.saveChain();

      return true;
    } catch (error) {
      console.error('Error importing blockchain:', error);
      return false;
    }
  }

  public async resetChain() {
    try {
      this.chain = [];
      this.currentTransactions = [];
      this.difficulty = 2;
      this.createGenesisBlock();
      await this.saveChain();
      this.updateStats();
      return true;
    } catch (error) {
      console.error('Error resetting blockchain:', error);
      return false;
    }
  }

  private getNextNonce(accountAddress: string): number {
    // Get all transactions from this account (both mined and pending)
    const allTxs = [
      ...this.getAllTransactions().filter(tx => tx.fromAccount === accountAddress),
      ...this.currentTransactions.filter(tx => tx.fromAccount === accountAddress)
    ];
    
    // If no previous transactions, start with nonce 0
    if (allTxs.length === 0) return 0;
    
    // Find the highest nonce used so far
    const highestNonce = Math.max(
      ...allTxs.map(tx => tx.nonce !== undefined ? tx.nonce : 0)
    );
    
    // Return the next nonce
    return highestNonce + 1;
  }

  private calculateGasForTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'signature'>): number {
    // Base gas cost for any transaction
    const BASE_GAS = 21000;
    
    // Add gas for each byte of data (approximation)
    const txSize = new TextEncoder().encode(JSON.stringify(transaction)).length;
    const DATA_GAS_PER_BYTE = 68;
    const dataGas = txSize * DATA_GAS_PER_BYTE;
    
    // Additional gas for transaction type
    let typeGas = 0;
    switch (transaction.type) {
      case 'transfer':
        typeGas = 5000; // Transfers are more computationally intensive
        break;
      case 'expense':
        typeGas = 3000;
        break;
      case 'approval':
        typeGas = 10000; // Approvals require more validation
        break;
      default:
        typeGas = 1000;
    }
    
    return BASE_GAS + dataGas + typeGas;
  }
}

const blockchainInstance = new Blockchain();
export default blockchainInstance;