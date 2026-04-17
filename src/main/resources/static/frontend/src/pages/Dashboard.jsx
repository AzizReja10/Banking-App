import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';   // ← add this
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/api/accounts');
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSelectedAccount(res.data[0]);
          await fetchTransactions(res.data[0].accountNumber);
        }
      } catch (err) {
        console.error('Failed to fetch accounts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

 const fetchTransactions = async (accountNumber) => {
    try {
      // ← /recent instead of /transactions
      const res = await api.get(`/api/accounts/${accountNumber}/transactions/recent`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
};

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    fetchTransactions(account.accountNumber);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading your accounts...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Welcome Header */}
      <h2 style={styles.heading}>Welcome back, {user?.username} 👋</h2>

      {/* Account Cards */}
      <h3 style={styles.sectionTitle}>Your Accounts</h3>
      <div style={styles.accountsRow}>
        {accounts.length === 0 ? (
          <p style={{ color: '#999' }}>No accounts found.</p>
        ) : (
          accounts.map(acc => (
            <div
              key={acc.id}
              onClick={() => handleAccountSelect(acc)}
              style={{
                ...styles.accountCard,
                border: selectedAccount?.id === acc.id
                  ? '3px solid #4fc3f7'
                  : '3px solid transparent'
              }}
            >
              <p style={styles.accType}>{acc.accountType}</p>
              <p style={styles.accNumber}>{acc.accountNumber}</p>
              <p style={styles.accBalance}>₹{Number(acc.balance).toFixed(2)}</p>
              <p style={styles.accLabel}>Available Balance</p>
            </div>
          ))
        )}
      </div>

      {/* Transaction History */}
      <div style={styles.txSection}>
        {/* View All Button */}
{transactions.length > 0 && (
  <div style={{ textAlign: 'center', margin: '20px 0' }}>
    <button
      onClick={() => navigate(`/history/${selectedAccount?.accountNumber}`)}
      style={styles.viewAllBtn}
    >
      View All Transactions →
    </button>
  </div>
)}
        <h3 style={styles.txTitle}>
          Recent Transactions
          {selectedAccount && (
            <span style={styles.txSubtitle}> — {selectedAccount.accountNumber}</span>
          )}
        </h3>

        {/* Legend */}
        <div style={styles.legend}>
          <span style={styles.legendCredit}>↓ Incoming (Credit)</span>
          <span style={styles.legendDebit}>↑ Outgoing (Debit)</span>
        </div>

        {transactions.length === 0 ? (
          <p style={styles.noTx}>No transactions yet.</p>
        ) : (
          transactions.map(tx => {
            const isCredit = tx.direction === 'CREDIT';
            return (
              <div key={tx.id} style={styles.txCard}>

                {/* Left side */}
                <div style={styles.txLeft}>
                  {/* Direction arrow badge */}
                  <div style={{
                    ...styles.directionBadge,
                    background: isCredit ? '#e8f5e9' : '#ffebee',
                    color: isCredit ? '#2e7d32' : '#c62828'
                  }}>
                    {isCredit ? '↓ CREDIT' : '↑ DEBIT'}
                  </div>

                  <p style={styles.txDesc}>
                    {tx.description || 'No description'}
                  </p>

                  <p style={styles.txMeta}>
                    {isCredit
                      ? `From: ${tx.fromAccount}`
                      : `To: ${tx.toAccount}`
                    }
                  </p>
                </div>

                {/* Right side */}
                <div style={styles.txRight}>
                  <p style={{
                    ...styles.txAmount,
                    color: isCredit ? '#2e7d32' : '#c62828'
                  }}>
                    {isCredit ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                  </p>
                  <p style={styles.txDate}>
                    {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p style={styles.txTime}>
                    {new Date(tx.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: '#666'
  },
  viewAllBtn: {
  background: 'none',
  border: '1px solid #1a3c6e',
  color: '#1a3c6e',
  padding: '10px 28px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
},
  container: {
    maxWidth: '860px',
    margin: '30px auto',
    padding: '0 20px'
  },
  heading: {
    color: '#1a3c6e',
    fontSize: '26px',
    marginBottom: '8px'
  },
  sectionTitle: {
    color: '#444',
    fontSize: '16px',
    marginBottom: '12px',
    fontWeight: '500'
  },
  accountsRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '32px'
  },
  accountCard: {
    background: 'linear-gradient(135deg, #1a3c6e, #2563ab)',
    color: 'white',
    borderRadius: '16px',
    padding: '24px 28px',
    minWidth: '220px',
    cursor: 'pointer'
  },
  accType: {
    margin: '0 0 4px',
    fontSize: '12px',
    opacity: 0.75,
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  accNumber: {
    margin: '0 0 12px',
    fontSize: '14px',
    letterSpacing: '2px',
    opacity: 0.9
  },
  accBalance: {
    margin: '0 0 2px',
    fontSize: '32px',
    fontWeight: 'bold'
  },
  accLabel: {
    margin: 0,
    fontSize: '11px',
    opacity: 0.7
  },
  txSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
  },
  txTitle: {
    color: '#1a3c6e',
    margin: '0 0 8px',
    fontSize: '18px',
    fontWeight: '600'
  },
  txSubtitle: {
    color: '#888',
    fontSize: '14px',
    fontWeight: '400'
  },
  legend: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  legendCredit: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  legendDebit: {
    background: '#ffebee',
    color: '#c62828',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  noTx: {
    color: '#aaa',
    textAlign: 'center',
    padding: '30px 0'
  },
  txCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #f5f5f5'
  },
  txLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  directionBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '20px',
    display: 'inline-block',
    width: 'fit-content',
    letterSpacing: '0.5px'
  },
  txDesc: {
    margin: 0,
    color: '#333',
    fontSize: '14px',
    fontWeight: '500'
  },
  txMeta: {
    margin: 0,
    color: '#999',
    fontSize: '12px'
  },
  txRight: {
    textAlign: 'right'
  },
  txAmount: {
    margin: '0 0 2px',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  txDate: {
    margin: '0 0 2px',
    color: '#aaa',
    fontSize: '12px'
  },
  txTime: {
    margin: 0,
    color: '#bbb',
    fontSize: '11px'
  }
};