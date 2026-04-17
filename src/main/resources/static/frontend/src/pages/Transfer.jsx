import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/accounts').then(res => {
      setAccounts(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, fromAccount: res.data[0].accountNumber }));
      }
    }).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await api.post('/api/accounts/transfer', {
        ...form,
        amount: parseFloat(form.amount)
      });
      setMessage('Transfer successful!');
      setForm(f => ({ ...f, toAccount: '', amount: '', description: '' }));
      // Go back to dashboard after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>💸 Transfer Funds</h2>
        <p style={styles.subtitle}>Send money to another account instantly</p>

        {message && (
          <div style={styles.successBox}>
            ✅ {message} Redirecting to dashboard...
          </div>
        )}
        {error && (
          <div style={styles.errorBox}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* From Account */}
          <div style={styles.field}>
            <label style={styles.label}>From Account</label>
            <select
              name="fromAccount"
              value={form.fromAccount}
              onChange={handleChange}
              style={styles.input}
              required
            >
              {accounts.map(a => (
               
                <option key={a.id} value={a.accountNumber}>
                  {a.accountNumber} — ₹{Number(a.balance).toFixed(2)} ({a.accountType})
                </option>
              ))}
            </select>
          </div>

          {/* To Account */}
          <div style={styles.field}>
            <label style={styles.label}>To Account Number</label>
            <input
              name="toAccount"
              placeholder="e.g. ACC1002"
              value={form.toAccount}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Amount */}
          <div style={styles.field}>
            <label style={styles.label}>Amount ($)</label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description (optional)</label>
            <input
              name="description"
              placeholder="e.g. Rent, Groceries..."
              value={form.description}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={styles.cancelBtn}
          >
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 16px',
    background: '#f0f4f8',
    minHeight: '85vh'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '440px'
  },
  title: {
    textAlign: 'center',
    color: '#1a3c6e',
    margin: '0 0 6px',
    fontSize: '24px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#999',
    margin: '0 0 28px',
    fontSize: '14px'
  },
  field: {
    marginBottom: '18px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontWeight: '500',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '15px',
    outline: 'none'
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: '#1a3c6e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  cancelBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#888',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px'
  },
  successBox: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  errorBox: {
    background: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  }
};