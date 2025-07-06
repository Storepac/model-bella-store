import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para executar queries
export const query = async (sql: string, params?: any[]) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export default pool; 