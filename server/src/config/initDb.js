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

    console.log('Tables created. Now seeding seed data...');

    // Seed Users
    const userCount = await appPool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count, 10) === 0) {
      const defaultPasswordHash = await bcrypt.hash('password123', 10);
      const initialUsers = [
        ['USR-1', 'Alex Morgan', 'alex.morgan@saferoad.ai', defaultPasswordHash, 'user', 'Active', 18, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'],
        ['USR-2', 'Sarah Connor', 'sarah.c@saferoad.ai', defaultPasswordHash, 'user', 'Active', 42, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'],
        ['USR-3', 'Marcus Vance (Admin)', 'marcus.v@saferoad.ai', defaultPasswordHash, 'admin', 'Active', 95, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'],
        ['USR-4', 'Garv Patel', 'garv@saferoad.ai', defaultPasswordHash, 'admin', 'Active', 50, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'],
      ];

      for (const u of initialUsers) {
        await appPool.query(
          `INSERT INTO users (id, name, email, password, role, status, reports_submitted, avatar)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (email) DO NOTHING`,
          u
        );
      }
      console.log('Seeded initial users.');
    }

    // Seed Damage Reports
    const repCount = await appPool.query('SELECT COUNT(*) FROM damage_reports');
    if (parseInt(repCount.rows[0].count, 10) === 0) {
      const reports = [
        ['REP-1001', 'Pothole', 'High', 'Pending', 'Deep pothole in middle of lane causing severe traffic deceleration & risk of wheel damage.', 'Main St & 4th Ave, Downtown', 37.7749, -122.4194, '2026-07-30', '14:22', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'Alex Morgan', '98%', 24, 14.2, 45.0, 0.16, 88, 'Central Commercial', 0],
        ['REP-1002', 'Crack', 'Medium', 'Under Review', 'Long longitudinal asphalt crack expanding along the bike lane edge.', 'Oakland Blvd Near Bridge', 37.7833, -122.4167, '2026-07-29', '09:15', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', 'Sarah Connor', '92%', 12, 4.5, 12.0, 1.25, 54, 'North Bay Ward', 0],
        ['REP-1003', 'Accident', 'Critical', 'Scheduled', 'Two-vehicle side collision near intersection. Emergency services notified.', 'Highway 101 North Exit 22B', 37.7650, -122.4200, '2026-07-31', '08:45', 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80', 'Traffic Cam AI #04', '99%', 45, 0, 0, 0, 96, 'Highway Corridor 101', 2],
        ['REP-1004', 'Repair', 'Low', 'Resolved', 'Asphalt repaving and lane line re-striping completed by city maintenance crew.', 'Sunset Expressway Mile 14', 37.7590, -122.4350, '2026-07-28', '16:00', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80', 'Dept of Transport', '100%', 89, 0, 0, 12.0, 10, 'Sunset District', 0],
        ['REP-1005', 'Pothole', 'Critical', 'In Progress', 'Multiple connected potholes creating hazardous driving condition for motorcycles.', 'Market Street & 8th St', 37.7780, -122.4120, '2026-07-30', '11:05', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'David Miller', '95%', 31, 18.5, 60.0, 0.45, 92, 'Central Commercial', 0],
        ['REP-1006', 'Erosion', 'High', 'Pending', 'Shoulder erosion caused by heavy rains near curve ramp.', 'Skyline Drive South', 37.7400, -122.4500, '2026-07-31', '10:30', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', 'Elena Rostova', '91%', 18, 22.0, 110.0, 2.80, 78, 'Skyline Hills', 0],
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
          ('REP-1001', 'Sarah Connor', 'Damaged my tire rim yesterday night! Needs urgent repair.'),
          ('REP-1001', 'City Inspector #12', 'Scheduled for emergency patching crew.'),
          ('REP-1002', 'Cycling Guild', 'Hazardous for thin road bike tires.')
      `);

      console.log('Seeded initial damage reports with PostGIS geometries and comments.');
    }

    // Seed RQI Segments
    const rqiCount = await appPool.query('SELECT COUNT(*) FROM rqi_segments');
    if (parseInt(rqiCount.rows[0].count, 10) === 0) {
      const segments = [
        ['RQI-1', 'Downtown Market St Corridor', 38, 'Poor', 37.7749, -122.4194, 37.7780, -122.4120],
        ['RQI-2', 'Oakland Blvd Bridge Approach', 65, 'Fair', 37.7833, -122.4167, 37.7890, -122.4100],
        ['RQI-3', 'Sunset Expressway Westbound', 92, 'Good', 37.7590, -122.4350, 37.7520, -122.4450],
        ['RQI-4', 'Skyline Mountain Pass South', 52, 'Fair', 37.7400, -122.4500, 37.7320, -122.4600],
      ];

      for (const s of segments) {
        await appPool.query(
          `INSERT INTO rqi_segments (id, name, rqi_score, status, lat1, lng1, lat2, lng2, geom)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_SetSRID(ST_MakeLine(ST_MakePoint($6, $5), ST_MakePoint($8, $7)), 4326))
           ON CONFLICT (id) DO NOTHING`,
          s
        );
      }
      console.log('Seeded RQI segments with PostGIS LineStrings.');
    }

    // Seed Work Orders
    const woCount = await appPool.query('SELECT COUNT(*) FROM work_orders');
    if (parseInt(woCount.rows[0].count, 10) === 0) {
      const workOrders = [
        ['WO-8801', 'REP-1005', 'Market St Emergency Asphalt Patching', 'Alpha Crew #4 (Cold Mix Team)', 'Apex Infrastructure Ltd.', '$3,800', 'In Progress', '2026-08-12', '2026-08-14', 65, 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'],
        ['WO-8802', 'REP-1003', 'Hwy 101 Guardrail & Surface Re-alignment', 'Highway Rapid Ops Unit', 'Bay Area Road Contractors', '$12,500', 'Scheduled', '2026-08-15', '2026-08-17', 15, 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80', null],
        ['WO-8803', 'REP-1004', 'Sunset Expressway Repaving Section B', 'Heavy Machinery Paving Team B', 'City Public Works', '$8,200', 'Completed', '2026-07-26', '2026-07-28', 100, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80'],
      ];

      for (const wo of workOrders) {
        await appPool.query(
          `INSERT INTO work_orders (id, report_id, title, crew_assigned, contractor, estimated_cost, status, start_date, completion_target, progress_pct, before_image, after_image)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          wo
        );
      }
      console.log('Seeded initial work orders.');
    }

    // Seed Verification Queue
    const vCount = await appPool.query('SELECT COUNT(*) FROM verification_queue');
    if (parseInt(vCount.rows[0].count, 10) === 0) {
      const verifications = [
        ['VER-401', 'REP-1001', 'Pothole', 0.98, '14.2 cm', '0.16 sq m', 'Pending Verification', 'High', 'Main St & 4th Ave, Downtown', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80', 'AI model suggests high risk of vehicle axle breakdown due to sharp crater edge.'],
        ['VER-402', 'REP-1006', 'Shoulder Erosion', 0.91, '22.0 cm', '2.80 sq m', 'Pending Verification', 'High', 'Skyline Drive South', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80', 'Heavy rain runoff washed away sub-grade support.']
      ];

      for (const v of verifications) {
        await appPool.query(
          `INSERT INTO verification_queue (id, report_id, type, ai_confidence, estimated_depth, estimated_area, officer_status, ai_flagged_severity, location, image, inspection_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO NOTHING`,
          v
        );
      }
      console.log('Seeded verification desk items.');
    }

    // Seed Notifications
    const nCount = await appPool.query('SELECT COUNT(*) FROM notifications');
    if (parseInt(nCount.rows[0].count, 10) === 0) {
      const notifs = [
        ['NOT-1', 'Repair Completed', 'Work crew completed asphalt patching on Sunset Expressway Mile 14.', '10 mins ago', 'repair', false],
        ['NOT-2', 'Dangerous Road Alert', 'High density of potholes reported near Market Street & 8th St. Drive with caution!', '1 hour ago', 'warning', false],
        ['NOT-3', 'Accident Reported Nearby', 'Traffic collision reported on Hwy 101 Exit 22B. Alternative safe route recommended.', '3 hours ago', 'accident', true],
        ['NOT-4', 'Report Status Update', 'Your report REP-1001 has been escalated to Priority Repair status.', '1 day ago', 'system', true],
      ];

      for (const n of notifs) {
        await appPool.query(
          `INSERT INTO notifications (id, title, message, time, type, read)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          n
        );
      }
      console.log('Seeded initial notifications.');
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
