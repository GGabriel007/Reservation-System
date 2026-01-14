import { useState, useEffect } from "react";
import styles from "./styles.module.css";

interface Transaction {
  _id: string;
  stripePaymentIntentId: string;
  amount: number;
  status: "succeeded" | "refunded" | "processing" | "failed";
  currency: string;
  createdAt: string;
  // Populated Fields
  userId?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  hotelId?: {
    name: string;
  };
  reservationId?: {
    confirmationCode: string;
  };
  paymentMethodDetails?: {
    brand: string;
    last4: string;
  };
}

export default function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Checks environment URL
  const baseUrl = import.meta.env.PROD 
    ? "http://liore.us-east-1.elasticbeanstalk.com" 
    : "http://localhost:8080"; 

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${baseUrl}/transactions`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CALCULATE STATS ---
  const totalRevenue = transactions
    .filter(t => t.status === 'succeeded')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalRefunds = transactions
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) return <div className={styles.loading}>Loading Financial Data...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Financial Audit</h2>
        <p className={styles.subtitle}>Real-time view of Stripe payments and refunds.</p>
      </div>

      {/* --- KPI CARDS --- */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>${totalRevenue.toLocaleString()}</span>
          <span className={styles.statLabel}>Total Revenue</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{transactions.length}</span>
          <span className={styles.statLabel}>Transactions</span>
        </div>
        <div className={styles.statCard} style={{ borderColor: totalRefunds > 0 ? '#ffcccc' : '#eee' }}>
          <span className={styles.statValue} style={{ color: '#d93025' }}>
            ${totalRefunds.toLocaleString()}
          </span>
          <span className={styles.statLabel}>Refunded</span>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Stripe ID / Date</th>
              <th>Guest</th>
              <th>Hotel Location</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No transactions found.</td></tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn._id}>
                  <td>
                    <div style={{fontWeight: 'bold', fontSize: '0.85rem'}}>
                      {txn.stripePaymentIntentId.slice(0, 14)}...
                    </div>
                    <div style={{color: '#888', fontSize: '0.8rem'}}>
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    {txn.userId ? (
                      <>
                        <div>{txn.userId.firstName} {txn.userId.lastName}</div>
                        <div style={{fontSize: '0.75rem', color: '#888'}}>{txn.userId.email}</div>
                      </>
                    ) : (
                      <span style={{fontStyle: "italic", color: "#999"}}>Guest Checkout</span>
                    )}
                  </td>
                  <td>
                    {txn.hotelId?.name || "Unknown Location"}
                    {txn.reservationId && (
                      <div style={{fontSize: '0.75rem', color: '#c5a059'}}>
                        Ref: {txn.reservationId.confirmationCode}
                      </div>
                    )}
                  </td>
                  <td className={`${styles.amount} ${txn.status === 'refunded' ? styles.negative : styles.positive}`}>
                    {txn.status === 'refunded' ? '-' : '+'}${txn.amount.toFixed(2)}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[`status_${txn.status}`]}`}>
                      {txn.status}
                    </span>
                    {txn.paymentMethodDetails && (
                      <div style={{fontSize: '0.75rem', marginTop: '4px', color: '#666'}}>
                        {txn.paymentMethodDetails.brand.toUpperCase()} •••• {txn.paymentMethodDetails.last4}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}