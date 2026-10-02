const { Client, Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'garvpatel@14',
};

async function initializeDatabase() {
  console.log('--- Initializing SafeRoad PostgreSQL + PostGIS Database ---');

  // Step 1: Connect to default 'postgres' database to create 'saferoad_db' if it doesn't exist
  const rootClient = new Client({
    ...dbConfig,
    database: 'postgres',
  });

  try {
    await rootClient.connect();
    const dbCheck = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'saferoad_db']
    );

    if (dbCheck.rows.length === 0) {
      console.log(`Creating database ${process.env.DB_NAME || 'saferoad_db'}...`);
      await rootClient.query(`CREATE DATABASE ${process.env.DB_NAME || 'saferoad_db'}`);
      console.log('Database created successfully.');
    } else {
      console.log(`Database ${process.env.DB_NAME || 'saferoad_db'} already exists.`);
    }
  } catch (err) {
    console.error('Error verifying/creating database:', err.message);
  } finally {
    await rootClient.end();
  }

  // Step 2: Connect to saferoad_db to setup PostGIS extension & Schema
  const appPool = new Pool({
    ...dbConfig,
    database: process.env.DB_NAME || 'saferoad_db',
  });

  try {
    console.log('Enabling PostGIS extension in database...');
    try {
      await appPool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
      const gisVer = await appPool.query('SELECT postgis_full_version();');
      console.log('PostGIS Enabled successfully:', gisVer.rows[0]?.postgis_full_version?.substring(0, 80));
    } catch (gisErr) {
      console.warn('PostGIS extension note (make sure PostGIS installer has run if not yet active):', gisErr.message);
    }

    console.log('Creating database tables with Spatial Geometry support...');

    // Users Table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'Active',
        reports_submitted INT DEFAULT 0,
        avatar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Damage Reports / Hazards Table (With PostGIS Point Geometry)
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS damage_reports (
        id VARCHAR(50) PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        severity VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        description TEXT,
        location_name VARCHAR(255),
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        geom geometry(Point, 4326),
        date VARCHAR(20),
        time VARCHAR(20),
        image TEXT,
        reported_by VARCHAR(100),
        ai_confidence VARCHAR(20) DEFAULT '95%',
        upvotes INT DEFAULT 0,
        depth_cm DOUBLE PRECISION DEFAULT 0,
        width_cm DOUBLE PRECISION DEFAULT 0,
        area_sq_m DOUBLE PRECISION DEFAULT 0,
        priority_score INT DEFAULT 50,
        district VARCHAR(100),
        vehicles_involved INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Spatial Index on Damage Reports
    try {
      await appPool.query(`
        CREATE INDEX IF NOT EXISTS idx_damage_reports_geom ON damage_reports USING GIST(geom);
      `);
    } catch (e) {}

    // Comments Table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS report_comments (
        id SERIAL PRIMARY KEY,
        report_id VARCHAR(50) REFERENCES damage_reports(id) ON DELETE CASCADE,
        user_name VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // RQI Segments Table (With PostGIS LineString Geometry)
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS rqi_segments (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        rqi_score INT NOT NULL,
        status VARCHAR(50) NOT NULL,
        lat1 DOUBLE PRECISION NOT NULL,
        lng1 DOUBLE PRECISION NOT NULL,
        lat2 DOUBLE PRECISION NOT NULL,
        lng2 DOUBLE PRECISION NOT NULL,
        geom geometry(LineString, 4326),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    try {
      await appPool.query(`
        CREATE INDEX IF NOT EXISTS idx_rqi_segments_geom ON rqi_segments USING GIST(geom);
      `);
    } catch (e) {}

    // Work Orders Table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS work_orders (
        id VARCHAR(50) PRIMARY KEY,
        report_id VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        crew_assigned VARCHAR(150),
        contractor VARCHAR(150),
        estimated_cost VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Scheduled',
        start_date VARCHAR(50),
        completion_target VARCHAR(50),
        progress_pct INT DEFAULT 0,
        before_image TEXT,
        after_image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Road Verification Desk Table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS verification_queue (
        id VARCHAR(50) PRIMARY KEY,
        report_id VARCHAR(50),
        type VARCHAR(100) NOT NULL,
        ai_confidence DOUBLE PRECISION DEFAULT 0.95,
        estimated_depth VARCHAR(50),
        estimated_area VARCHAR(50),
        officer_status VARCHAR(50) DEFAULT 'Pending Verification',
        ai_flagged_severity VARCHAR(50),
        location VARCHAR(255),
        image TEXT,
        inspection_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Notifications Table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        time VARCHAR(50),
        type VARCHAR(50) DEFAULT 'system',
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // GPS Telemetry Logs Table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS gps_telemetry_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50),
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        speed DOUBLE PRECISION DEFAULT 0,
        heading DOUBLE PRECISION DEFAULT 0,
        accuracy DOUBLE PRECISION DEFAULT 0,
        geom geometry(Point, 4326),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Password Reset Tokens Table
    await appPool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(150) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created. Now seeding seed data...');

    // Seed Users
    const userCount = await appPool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      const defaultPasswordHash = await bcrypt.hash('password123', 10);
      const garvPasswordHash = await bcrypt.hash('garv@admin2026', 10);
      const mihirPasswordHash = await bcrypt.hash('mihir@admin2026', 10);
      
      const initialUsers = [
        ['USR-1', 'Alex Morgan', 'alex.morgan@saferoad.ai', defaultPasswordHash, 'user', 'Active', 18, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'],
        ['USR-2', 'Sarah Connor', 'sarah.c@saferoad.ai', defaultPasswordHash, 'user', 'Active', 42, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'],
        ['USR-3', 'Garv Patel', 'garv@saferoad.ai', garvPasswordHash, 'admin', 'Active', 127, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'],
        ['USR-4', 'Mihir Shah', 'mihir@saferoad.ai', mihirPasswordHash, 'admin', 'Active', 98, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'],
      ];

      for (const u of initialUsers) {
        await appPool.query(
          `INSERT INTO users (id, name, email, password, role, status, reports_submitted, avatar)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (email) DO NOTHING`,
          u
        );
      }
      console.log('Seeded initial users with admin accounts for Garv and Mihir.');
    }

    // Seed Damage Reports
    const repCount = await appPool.query('SELECT COUNT(*) FROM damage_reports');
    if (parseInt(repCount.rows[0].count, 10) === 0) {
      const reports = [
        ['REP-1001', 'Pothole', 'High', 'Pending', 'Deep road crater near railway junction causing severe traffic deceleration and risk of wheel rim damage.', 'Station Road, Near Anand Railway Station, Anand', 22.5606, 72.9575, '2026-09-24', '14:22', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'Garv Patel', '98%', 38, 15.2, 48.0, 0.18, 92, 'Anand Town Central', 0],
        ['REP-1002', 'Pothole', 'Critical', 'In Progress', 'Severe pothole cluster across both lanes near Amul Chocolate Plant entrance.', 'Amul Dairy Road, Anand', 22.5535, 72.9515, '2026-09-25', '09:15', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'Mihir Shah', '96%', 45, 18.5, 62.0, 0.42, 96, 'Amul Industrial Zone', 0],
        ['REP-1003', 'Crack', 'Medium', 'Under Review', 'Long longitudinal crack expanding along the busy commercial market corridor.', 'Nana Bazar, Tower Road, Anand', 22.5595, 72.9460, '2026-09-23', '11:40', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', 'Kunal Joshi', '92%', 14, 4.8, 14.0, 1.10, 58, 'Old Anand Market', 0],
        ['REP-1004', 'Pothole', 'High', 'Pending', 'Sharp-edged pothole on highway junction causing sudden vehicle swerving.', 'Borsad Chokdi, Anand-Borsad Highway, Anand', 22.5400, 72.9320, '2026-09-25', '16:00', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'State Highway Patrol', '94%', 29, 14.0, 42.0, 0.16, 84, 'Southern Bypass', 0],
        ['REP-1005', 'Crack', 'Medium', 'Under Review', 'Spiderweb alligator cracks near college campus roundabout.', 'Mota Bazar, Near BVM College, Vallabh Vidyanagar, Anand', 22.5528, 72.9242, '2026-09-24', '08:30', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', 'Student Commuter Council', '91%', 21, 5.5, 35.0, 0.65, 66, 'Vidyanagar Education Hub', 0],
        ['REP-1006', 'Repair', 'Low', 'Resolved', 'New micro-surfacing and lane re-marking completed by Anand Urban Development Authority.', '100 Feet Bypass Road, Anand', 22.5690, 72.9350, '2026-09-22', '17:00', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80', 'AUDA Road Maintenance', '100%', 72, 0, 0, 45.0, 10, 'Northern Ring Road', 0],
        ['REP-1007', 'Pothole', 'Critical', 'Pending', 'Massive rainwater-filled crater near overbridge descent with zero street lighting.', 'Gamdi Overbridge Approach, Anand', 22.5650, 72.9600, '2026-09-25', '20:15', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'Night Patrol AI Cam #2', '99%', 56, 22.0, 75.0, 0.55, 98, 'Eastern Anand', 0],
        ['REP-1008', 'Pothole', 'High', 'Pending', 'Damaged asphalt trench on Sardar Patel Memorial approach avenue.', 'Memorial Road, Karamsad, Anand', 22.5475, 72.8988, '2026-09-25', '12:00', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'Heritage Trust Visitor', '95%', 19, 12.5, 38.0, 0.14, 76, 'Karamsad Ward', 0],
      ];

      for (const r of reports) {
        await appPool.query(
          `INSERT INTO damage_reports (
             id, type, severity, status, description, location_name,
             lat, lng, geom, date, time, image, reported_by, ai_confidence,
             upvotes, depth_cm, width_cm, area_sq_m, priority_score, district, vehicles_involved
           )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_SetSRID(ST_MakePoint($8, $7), 4326), $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
           ON CONFLICT (id) DO NOTHING`,
          r
        );
      }

      // Seed initial comments
      await appPool.query(`
        INSERT INTO report_comments (report_id, user_name, text)
        VALUES 
          ('REP-1001', 'Ramesh Patel', 'Very risky for two-wheelers at night!'),
          ('REP-1001', 'Anand Municipal Inspector', 'Patching team scheduled.'),
          ('REP-1002', 'Dairy Milk Van Ops', 'Slows down tankers entering facility.')
        ON CONFLICT DO NOTHING
      `);

      console.log('Seeded initial damage reports in Anand, Gujarat with PostGIS geometries.');
    }

    // Seed RQI Segments
    const rqiCount = await appPool.query('SELECT COUNT(*) FROM rqi_segments');
    if (parseInt(rqiCount.rows[0].count, 10) === 0) {
      const segments = [
        ['RQI-1', 'Station Road to Nana Bazar Corridor', 36, 'Poor', 22.5606, 72.9575, 22.5595, 72.9460],
        ['RQI-2', 'Amul Dairy Industrial Highway', 48, 'Fair', 22.5535, 72.9515, 22.5400, 72.9320],
        ['RQI-3', '100 Feet Bypass Smooth Ring Road', 94, 'Good', 22.5690, 72.9350, 22.5580, 72.9260],
        ['RQI-4', 'Vidyanagar Double Road Education Corridor', 88, 'Good', 22.5580, 72.9260, 22.5528, 72.9242],
        ['RQI-5', 'Karamsad Heritage Boulevard', 62, 'Fair', 22.5528, 72.9242, 22.5475, 72.8988],
      ];

      for (const s of segments) {
        await appPool.query(
          `INSERT INTO rqi_segments (id, name, rqi_score, status, lat1, lng1, lat2, lng2, geom)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_SetSRID(ST_MakeLine(ST_MakePoint($6, $5), ST_MakePoint($8, $7)), 4326))
           ON CONFLICT (id) DO NOTHING`,
          s
        );
      }
      console.log('Seeded RQI segments in Anand, Gujarat with PostGIS LineStrings.');
    }

    // Seed Work Orders
    const woCount = await appPool.query('SELECT COUNT(*) FROM work_orders');
    if (parseInt(woCount.rows[0].count, 10) === 0) {
      const workOrders = [
        ['WO-ANAND-01', 'REP-ANAND-01', 'Station Road Junction Emergency Asphalt Patching', 'AUDA Rapid Road Unit #2 (Cold Mix Team)', 'Charotar Infrastructure Pvt Ltd', '₹3,45,000', 'In Progress', '2026-09-24', '2026-09-27', 70, 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'],
        ['WO-ANAND-02', 'REP-ANAND-02', 'Amul Dairy Highway Heavy Surface Re-alignment', 'District Heavy Machinery Paving Crew', 'Gujarat Highway Infra Ltd', '₹8,20,000', 'Scheduled', '2026-09-28', '2026-10-02', 20, 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', null],
        ['WO-ANAND-03', 'REP-ANAND-04', 'Borsad Chokdi High-Stress Intersection Concrete Overhaul', 'AMC Special Highway Division', 'Anand Municipal Road Works', '₹14,50,000', 'In Progress', '2026-09-20', '2026-09-30', 55, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', null],
        ['WO-ANAND-04', 'REP-ANAND-08', '100 Feet Bypass Ring Road Micro-Surfacing & Lane Marking', 'AUDA Road Maintenance Unit', 'AUDA Engineering Division', '₹5,80,000', 'Completed', '2026-09-18', '2026-09-23', 100, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'],
      ];

      for (const wo of workOrders) {
        await appPool.query(
          `INSERT INTO work_orders (id, report_id, title, crew_assigned, contractor, estimated_cost, status, start_date, completion_target, progress_pct, before_image, after_image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          wo
        );
      }
      console.log('Seeded initial work orders for Anand, Gujarat.');
    }

    // Seed Verification Queue
    const vCount = await appPool.query('SELECT COUNT(*) FROM verification_queue');
    if (parseInt(vCount.rows[0].count, 10) === 0) {
      const verifications = [
        ['VER-ANAND-01', 'REP-ANAND-01', 'Pothole', 0.98, '15.2 cm', '0.18 sq m', 'Pending Verification', 'High', 'Station Road, Near Anand Railway Station, Anand', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'AI Computer Vision verifies deep crater on approach to main railway terminal. Urgent patching recommended.'],
        ['VER-ANAND-02', 'REP-ANAND-02', 'Pothole', 0.96, '18.5 cm', '0.42 sq m', 'Pending Verification', 'Critical', 'Amul Dairy Road, Anand', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'Sub-grade failure near industrial entry. Heavy vehicle traffic causing asphalt breakdown.'],
        ['VER-ANAND-03', 'REP-ANAND-06', 'Pothole', 0.99, '22.0 cm', '0.55 sq m', 'Verified & Dispatched', 'Critical', 'Gamdi Overbridge Approach, Anand', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'High-risk bridge approach crater. Warning cones deployed by municipal inspection team.']
      ];

      for (const v of verifications) {
        await appPool.query(
          `INSERT INTO verification_queue (id, report_id, type, ai_confidence, estimated_depth, estimated_area, officer_status, ai_flagged_severity, location, image, inspection_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO NOTHING`,
          v
        );
      }
      console.log('Seeded verification desk items for Anand.');
    }

    // Seed Notifications
    const nCount = await appPool.query('SELECT COUNT(*) FROM notifications');
    if (parseInt(nCount.rows[0].count, 10) === 0) {
      const notifs = [
        ['NOT-ANAND-01', 'Repair Completed: 100 Feet Bypass', 'AUDA maintenance crew completed micro-surfacing and lane re-marking on 100 Feet Bypass Road, Anand.', '15 mins ago', 'repair', false],
        ['NOT-ANAND-02', 'Road Hazard Alert: Borsad Chokdi', 'Deep pothole cluster detected near Borsad Chokdi intersection on Anand-Borsad Highway. Drive cautiously!', '1 hour ago', 'warning', false],
        ['NOT-ANAND-03', 'Traffic Advisory: Station Road Junction', 'Traffic slowdown reported near Anand Railway Station due to municipal asphalt repair work. Safe alternative route suggested.', '2 hours ago', 'accident', true],
        ['NOT-ANAND-04', 'Report Verified: Gamdi Overbridge', 'Your reported road defect at Gamdi Overbridge has been verified by the municipal desk and escalated for priority repair.', '1 day ago', 'system', true],
      ];

      for (const n of notifs) {
        await appPool.query(
          `INSERT INTO notifications (id, title, message, time, type, read)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          n
        );
      }
      console.log('Seeded initial notifications for Anand.');
    }

    console.log('Database initialization & seeding completed successfully!');
  } catch (err) {
    console.error('Error setting up tables / seed data:', err);
  } finally {
    await appPool.end();
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
