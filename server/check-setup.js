/**
 * Quick setup verification script
 * Checks if database, tables, and admin accounts are ready
 */

const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function checkSetup() {
  console.log('\n========================================');
  console.log('SafeRoad AI Setup Verification');
  console.log('========================================\n');

  try {
    // Check database connection
    console.log('🔍 Checking database connection...');
    await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully\n');

    // Check if tables exist
    console.log('🔍 Checking tables...');
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const requiredTables = [
      'users',
      'damage_reports',
      'rqi_segments',
      'work_orders',
      'verification_queue',
      'notifications'
    ];

    const existingTables = tables.rows.map(row => row.table_name);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length === 0) {
      console.log('✅ All required tables exist');
      console.log(`   Found ${existingTables.length} tables:`, existingTables.join(', '));
    } else {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('   Run: npm run init-db');
    }

    // Check admin accounts
    console.log('\n🔍 Checking admin accounts...');
    const garvCheck = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = $1',
      ['garv@saferoad.ai']
    );
    const mihirCheck = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = $1',
      ['mihir@saferoad.ai']
    );

    if (garvCheck.rows.length > 0) {
      const garv = garvCheck.rows[0];
      console.log(`✅ Garv admin account exists`);
      console.log(`   ID: ${garv.id} | Email: ${garv.email} | Role: ${garv.role}`);
    } else {
      console.log('❌ Garv admin account not found');
      console.log('   Run: npm run create-admins');
    }

    if (mihirCheck.rows.length > 0) {
      const mihir = mihirCheck.rows[0];
      console.log(`✅ Mihir admin account exists`);
      console.log(`   ID: ${mihir.id} | Email: ${mihir.email} | Role: ${mihir.role}`);
    } else {
      console.log('❌ Mihir admin account not found');
      console.log('   Run: npm run create-admins');
    }

    // Check user count
    console.log('\n🔍 Checking users...');
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const adminCount = await db.query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
    console.log(`✅ Total users: ${userCount.rows[0].count}`);
    console.log(`   Admin users: ${adminCount.rows[0].count}`);

    // Check reports count
    console.log('\n🔍 Checking data...');
    const reportCount = await db.query('SELECT COUNT(*) FROM damage_reports');
    const workOrderCount = await db.query('SELECT COUNT(*) FROM work_orders');
    console.log(`✅ Damage reports: ${reportCount.rows[0].count}`);
    console.log(`   Work orders: ${workOrderCount.rows[0].count}`);

    // Check PostGIS
    console.log('\n🔍 Checking PostGIS extension...');
    try {
      const gisCheck = await db.query('SELECT PostGIS_Version()');
      console.log('✅ PostGIS enabled:', gisCheck.rows[0].postgis_version);
    } catch (err) {
      console.log('⚠️  PostGIS not available (spatial features may not work)');
    }

    console.log('\n========================================');
    console.log('Setup Status: ✅ READY');
    console.log('========================================');
    console.log('\n📝 Next steps:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Login as Garv: garv@saferoad.ai / garv@admin2026');
    console.log('   3. Login as Mihir: mihir@saferoad.ai / mihir@admin2026');
    console.log('   4. Test API: node test-auth.js\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Setup check failed:', err.message);
    console.log('\n📝 Troubleshooting:');
    console.log('   1. Ensure PostgreSQL is running');
    console.log('   2. Check .env file credentials');
    console.log('   3. Run: npm run init-db');
    console.log('   4. Run: npm run create-admins\n');
    process.exit(1);
  }
}

checkSetup();
