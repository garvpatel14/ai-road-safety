const bcrypt = require('bcryptjs');
const db = require('./db');

async function createAdminUsers() {
  console.log('--- Creating/Updating Admin Users for Garv and Mihir ---');

  try {
    const garvPasswordHash = await bcrypt.hash('garv@admin2026', 10);
    const mihirPasswordHash = await bcrypt.hash('mihir@admin2026', 10);

    // Garv Admin Account
    const garvResult = await db.query(
      `INSERT INTO users (id, name, email, password, role, status, reports_submitted, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) 
       DO UPDATE SET 
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         name = EXCLUDED.name
       RETURNING id, name, email, role`,
      [
        'USR-GARV',
        'Garv Patel',
        'garv@saferoad.ai',
        garvPasswordHash,
        'admin',
        'Active',
        127,
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      ]
    );

    console.log('✓ Garv admin account created/updated:', garvResult.rows[0]);

    // Mihir Admin Account
    const mihirResult = await db.query(
      `INSERT INTO users (id, name, email, password, role, status, reports_submitted, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) 
       DO UPDATE SET 
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         name = EXCLUDED.name
       RETURNING id, name, email, role`,
      [
        'USR-MIHIR',
        'Mihir Shah',
        'mihir@saferoad.ai',
        mihirPasswordHash,
        'admin',
        'Active',
        98,
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      ]
    );

    console.log('✓ Mihir admin account created/updated:', mihirResult.rows[0]);

    console.log('\n--- Admin Credentials ---');
    console.log('Garv:  Email: garv@saferoad.ai  | Password: garv@admin2026');
    console.log('Mihir: Email: mihir@saferoad.ai | Password: mihir@admin2026');
    console.log('------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin users:', err);
    process.exit(1);
  }
}

createAdminUsers();
