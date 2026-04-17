import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function TransactionHistory() {
  const { accountNumber } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get(`/api/accounts/${accountNumber}/transactions`);
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [accountNumber]);

  const filtered = transactions.filter(tx => {
    const matchesFilter = filter === 'ALL' || tx.direction === filter;
    const matchesSearch = search === '' ||
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.fromAccount?.includes(search) ||
      tx.toAccount?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const totalCredit = transactions
    .filter(tx => tx.direction === 'CREDIT')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalDebit = transactions
    .filter(tx => tx.direction === 'DEBIT')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading transaction history...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <div>
          <h2 style={styles.title}>Transaction History</h2>
          <p style={styles.subtitle}>Account: {accountNumber}</p>
        </div>
      </div>

      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <p style={styles.summaryLabel}>Total Transactions</p>
          <p style={styles.summaryValue}>{transactions.length}</p>
        </div>
        <div style={{ ...styles.summaryCard, background: '#e8f5e9' }}>
          <p style={{ ...styles.summaryLabel, color: '#2e7d32' }}>Total Received</p>
          <p style={{ ...styles.summaryValue, color: '#2e7d32' }}>
            +${totalCredit.toFixed(2)}
          </p>
        </div>
        <div style={{ ...styles.summaryCard, background: '#ffebee' }}>
          <p style={{ ...styles.summaryLabel, color: '#c62828' }}>Total Sent</p>
          <p style={{ ...styles.summaryValue, color: '#c62828' }}>
            -${totalDebit.toFixed(2)}
          </p>
        </div>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by description or account..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.filterBtns}>
          {['ALL', 'CREDIT', 'DEBIT'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? '#1a3c6e' : 'white',
                color: filter === f ? 'white' : '#1a3c6e',
              }}
            >
              {f === 'ALL' ? 'All' : f === 'CREDIT' ? '↓ Incoming' : '↑ Outgoing'}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.resultCount}>
        Showing {filtered.length} of {transactions.length} transactions
      </p>

      <div style={styles.txList}>
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No transactions found.</p>
          </div>
        ) : (
          filtered.map(tx => {
            const isCredit = tx.direction === 'CREDIT';
            return (
              <div key={tx.id} style={styles.txCard}>
                <div style={{
                  ...styles.txIcon,
                  background: isCredit ? '#e8f5e9' : '#ffebee',
                  color: isCredit ? '#2e7d32' : '#c62828'
                }}>
                  {isCredit ? '↓' : '↑'}
                </div>

                <div style={styles.txDetails}>
                  <p style={styles.txDesc}>{tx.description || 'No description'}</p>
                  <p style={styles.txMeta}>
                    {isCredit ? `Received from: ${tx.fromAccount}` : `Sent to: ${tx.toAccount}`}
                  </p>
                  <p style={styles.txDate}>
                    {new Date(tx.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>

                <div style={styles.txAmountSection}>
                  <p style={{
                    ...styles.txAmount,
                    color: isCredit ? '#2e7d32' : '#c62828'
                  }}>
                    {isCredit ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                  </p>
                  <span style={{
                    ...styles.txBadge,
                    background: isCredit ? '#e8f5e9' : '#ffebee',
                    color: isCredit ? '#2e7d32' : '#c62828'
                  }}>
                    {tx.direction}
                  </span>
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
  container: {
    maxWidth: '860px',
    margin: '30px auto',
    padding: '0 20px 60px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px'
  },
  backBtn: {
    background: 'none',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#555',
    fontSize: '14px',
    whiteSpace: 'nowrap'
  },
  title: {
    margin: '0 0 4px',
    color: '#1a3c6e',
    fontSize: '24px'
  },
  subtitle: {
    margin: 0,
    color: '#888',
    fontSize: '14px'
  },
  summaryRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  summaryCard: {
    flex: 1,
    minWidth: '150px',
    background: '#f0f4ff',
    borderRadius: '12px',
    padding: '16px 20px'
  },
  summaryLabel: {
    margin: '0 0 6px',
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  summaryValue: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1a3c6e'
  },
  controls: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  filterBtns: {
    display: 'flex',
    gap: '8px'
  },
  filterBtn: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #1a3c6e',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  resultCount: {
    color: '#999',
    fontSize: '13px',
    margin: '0 0 16px'
  },
  txList: {
    background: 'white',
    borderRadius: '16px',
    padding: '8px 24px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#aaa'
  },
  txCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 0',
    borderBottom: '1px solid #f5f5f5'
  },
  txIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  txDetails: {
    flex: 1
  },
  txDesc: {
    margin: '0 0 3px',
    color: '#333',
    fontSize: '15px',
    fontWeight: '500'
  },
  txMeta: {
    margin: '0 0 3px',
    color: '#888',
    fontSize: '13px'
  },
  txDate: {
    margin: 0,
    color: '#bbb',
    fontSize: '12px'
  },
  txAmountSection: {
    textAlign: 'right',
    flexShrink: 0
  },
  txAmount: {
    margin: '0 0 4px',
    fontSize: '17px',
    fontWeight: 'bold'
  },
  txBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '20px',
    letterSpacing: '0.5px'
  }
};