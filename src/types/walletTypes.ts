export interface FundWalletRequestBody {
    userId: number;
    amount: number;
}
  
export interface TransferFundsRequestBody {
    senderId: number;
    recipientId: number;
    amount: number;
}