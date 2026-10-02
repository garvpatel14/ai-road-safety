const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    const garvHash = await bcrypt.hash('garv@admin2026', 10);
    const mihirHash = await bcrypt.hash('mihir@admin2026', 10);

    await db.query(
      `INSERT INTO users (id, name, email, password, role, status, reports_submitted, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin'`,
      ['USR-GARV-ROADSAFE', 'Garv Patel', 'garv@roadsafe.ai', garvHash, 'admin', 'Active', 127, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80']
    );

    await db.query(
      `INSERT INTO users (id, name, email, password, role, status, reports_submitted, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin'`,
      ['USR-MIHIR-ROADSAFE', 'Mihir Shah', 'mihir@roadsafe.ai', mihirHash, 'admin', 'Active', 98, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80']
    );

    console.log('Successfully added garv@roadsafe.ai and mihir@roadsafe.ai admin credentials!');
    process.exit(0);
  } catch (err) {
    console.error('Error adding aliases:', err);
    process.exit(1);
  }
}

main();
