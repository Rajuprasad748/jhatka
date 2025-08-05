
import { findUserById } from "../services/user.services.js";

export const addMoneyToWallet = async (req, res) => {
  const { userId, amount, method, transactionId } = req.body;

  // Validate input
  if (!userId || !amount || !method || !transactionId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Find user
  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Create add money transaction
  const addMoneyTransaction = await AddMoney.create({
    userId,
    amount,
    method,
    transactionId,
    status: 'pending'
  });

  res.status(201).json({ message: 'Money added successfully', transaction: addMoneyTransaction });
}


export const withdrawMoney = async (req, res) => {
  const { userId, accountHolderName, accountNumber, ifscCode, amount } = req.body;

  // Validate input
  if (!userId || !accountHolderName || !accountNumber || !ifscCode || !amount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Find user
  const user = await findUserById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Create withdraw request
  const withdrawRequest = await WithdrawRequest.create({
    userId,
    accountHolderName,
    accountNumber,
    ifscCode,
    amount
  });

  res.status(201).json({ message: 'Withdraw request created successfully', request: withdrawRequest });
}
