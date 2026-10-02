const db = require('../src/config/db');

async function cleanAndRefreshData() {
  console.log('========================================================');
  console.log(' SafeRoad AI — Data Cleanup & Anand, Gujarat Refresh');
  console.log('========================================================');

  try {
    // 1. Delete all old non-Anand / San Francisco / Dummy reports
    console.log('[1/6] Removing old dummy & test telemetry reports...');
    const delReports = await db.query(`
      DELETE FROM damage_reports
      WHERE lat > 30 
         OR lng < 0 
         OR location_name LIKE 'Highway GPS Telemetry Point%'
         OR location_name LIKE '%Downtown%'
         OR location_name LIKE '%Oakland%'
         OR location_name LIKE '%Market St%'
         OR location_name LIKE '%Sunset Expressway%'
         OR location_name LIKE '%Skyline Drive%'
    `);
    console.log(`  ✓ Removed ${delReports.rowCount} stale/foreign/test reports.`);

    // 2. Clean out old telemetry logs
    console.log('[2/6] Cleaning stale GPS telemetry logs...');
    await db.query('TRUNCATE TABLE gps_telemetry_logs RESTART IDENTITY CASCADE;');
    console.log('  ✓ Telemetry logs cleaned.');

    // 3. Clear and re-seed authentic Anand, Gujarat damage reports
    console.log('[3/6] Seeding authentic Anand, Gujarat damage reports...');
    
    // Check if we need to insert the canonical Anand reports
    const anandReports = [
      {
        id: 'REP-ANAND-01',
        type: 'Pothole',
        severity: 'High',
        status: 'Pending',
        description: 'Deep road crater near railway junction causing severe traffic deceleration and risk of wheel rim damage.',
        locationName: 'Station Road, Near Anand Railway Station, Anand',
        lat: 22.5606,
        lng: 72.9575,
        date: '2026-09-25',
        time: '14:22',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'Garv Patel',
        aiConfidence: '98%',
        upvotes: 42,
        depthCm: 15.2,
        widthCm: 48.0,
        areaSqM: 0.18,
        priorityScore: 92,
        district: 'Anand Town Central',
        vehiclesInvolved: 0,
      },
      {
        id: 'REP-ANAND-02',
        type: 'Pothole',
        severity: 'Critical',
        status: 'In Progress',
        description: 'Severe pothole cluster across both lanes near Amul Chocolate Plant entrance. Significant hazard for milk tankers.',
        locationName: 'Amul Dairy Road, Anand',
        lat: 22.5535,
        lng: 72.9515,
        date: '2026-09-25',
        time: '09:15',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'Mihir Shah',
        aiConfidence: '96%',
        upvotes: 58,
        depthCm: 18.5,
        widthCm: 62.0,
        areaSqM: 0.42,
        priorityScore: 96,
        district: 'Amul Industrial Zone',
        vehiclesInvolved: 0,
      },
      {
        id: 'REP-ANAND-03',
        type: 'Crack',
        severity: 'Medium',
        status: 'Under Review',
        description: 'Long longitudinal crack expanding along the busy commercial market corridor near Tower Road.',
        locationName: 'Nana Bazar, Tower Road, Anand',
        lat: 22.5595,
        lng: 72.9460,
        date: '2026-09-24',
        time: '11:40',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'Kunal Joshi',
        aiConfidence: '92%',
        upvotes: 19,
        depthCm: 4.8,
        widthCm: 14.0,
        areaSqM: 1.10,
        priorityScore: 58,
        district: 'Old Anand Market',
        vehiclesInvolved: 0,
      },
      {
        id: 'REP-ANAND-04',
        type: 'Pothole',
        severity: 'High',
        status: 'Pending',
        description: 'Sharp-edged pothole on highway junction causing sudden vehicle swerving near Borsad crossing.',
        locationName: 'Borsad Chokdi, Anand-Borsad Highway, Anand',
        lat: 22.5400,
        lng: 72.9320,
        date: '2026-09-25',
        time: '16:00',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'State Highway Patrol',
        aiConfidence: '94%',
        upvotes: 35,
        depthCm: 14.0,
        widthCm: 42.0,
        areaSqM: 0.16,
        priorityScore: 84,
        district: 'Southern Bypass',
        vehiclesInvolved: 0,
      },
      {
        id: 'REP-ANAND-05',
        type: 'Crack',
        severity: 'Medium',
        status: 'Under Review',
        description: 'Spiderweb alligator cracks near BVM engineering college campus roundabout.',
        locationName: 'Mota Bazar, Near BVM College, Vallabh Vidyanagar, Anand',
        lat: 22.5528,
        lng: 72.9242,
        date: '2026-09-24',
        time: '08:30',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'Student Commuter Council',
        aiConfidence: '91%',
        upvotes: 27,
        depthCm: 5.5,
        widthCm: 35.0,
        areaSqM: 0.65,
        priorityScore: 66,
        district: 'Vidyanagar Education Hub',
        vehiclesInvolved: 0,
      },
      {
        id: 'REP-ANAND-06',
        type: 'Pothole',
        severity: 'Critical',
        status: 'Pending',
        description: 'Massive rainwater-filled crater near overbridge descent with zero street lighting.',
        locationName: 'Gamdi Overbridge Approach, Anand',
        lat: 22.5650,
        lng: 72.9600,
        date: '2026-09-25',
        time: '20:15',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'Night Patrol AI Cam #2',
        aiConfidence: '99%',
        upvotes: 64,
        depthCm: 22.0,
        widthCm: 75.0,
        areaSqM: 0.55,
        priorityScore: 98,
        district: 'Eastern Anand',
        vehiclesInvolved: 0,
      },
      {
        id: 'REP-ANAND-07',
        type: 'Pothole',
        severity: 'High',
        status: 'Pending',
        description: 'Damaged asphalt trench on Sardar Patel Memorial approach avenue.',
        locationName: 'Memorial Road, Karamsad, Anand',
        lat: 22.5475,
        lng: 72.8988,
        date: '2026-09-25',
        time: '12:00',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'Heritage Trust Visitor',
        aiConfidence: '95%',
        upvotes: 23,
        depthCm: 12.5,
        widthCm: 38.0,
        areaSqM: 0.14,
        priorityScore: 76,
        district: 'Karamsad Ward',
        vehiclesInvolved: 0,
      },
      {
        id: 'REP-ANAND-08',
        type: 'Repair',
        severity: 'Low',
        status: 'Resolved',
        description: 'New micro-surfacing and lane re-marking completed by Anand Urban Development Authority.',
        locationName: '100 Feet Bypass Road, Anand',
        lat: 22.5690,
        lng: 72.9350,
        date: '2026-09-23',
        time: '17:00',
        image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
        reportedBy: 'AUDA Road Maintenance',
        aiConfidence: '100%',
        upvotes: 81,
        depthCm: 0,
        widthCm: 0,
        areaSqM: 45.0,
        priorityScore: 10,
        district: 'Northern Ring Road',
        vehiclesInvolved: 0,
      },
    ];

    for (const r of anandReports) {
      await db.query(`
        INSERT INTO damage_reports (
          id, type, severity, status, description, location_name,
          lat, lng, geom, date, time, image, reported_by, ai_confidence,
          upvotes, depth_cm, width_cm, area_sq_m, priority_score, district, vehicles_involved
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, ST_SetSRID(ST_MakePoint($8, $7), 4326),
          $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20
        )
        ON CONFLICT (id) DO UPDATE SET
          type = EXCLUDED.type,
          severity = EXCLUDED.severity,
          status = EXCLUDED.status,
          description = EXCLUDED.description,
          location_name = EXCLUDED.location_name,
          lat = EXCLUDED.lat,
          lng = EXCLUDED.lng,
          geom = EXCLUDED.geom,
          priority_score = EXCLUDED.priority_score
      `, [
        r.id, r.type, r.severity, r.status, r.description, r.locationName,
        r.lat, r.lng, r.date, r.time, r.image, r.reportedBy, r.aiConfidence,
        r.upvotes, r.depthCm, r.widthCm, r.areaSqM, r.priorityScore, r.district, r.vehiclesInvolved
      ]);
    }
    console.log(`  ✓ Seeded ${anandReports.length} Anand, Gujarat reports with PostGIS geometry.`);

    // 4. Clean and re-seed Work Orders for Anand in Indian Rupees
    console.log('[4/6] Updating Work Orders for Anand municipal administration...');
    await db.query('DELETE FROM work_orders;');
    const anandWorkOrders = [
      {
        id: 'WO-ANAND-01',
        reportId: 'REP-ANAND-01',
        title: 'Station Road Junction Emergency Asphalt Patching',
        crewAssigned: 'AUDA Rapid Road Unit #2 (Cold Mix Team)',
        contractor: 'Charotar Infrastructure Pvt Ltd',
        estimatedCost: '₹3,45,000',
        status: 'In Progress',
        startDate: '2026-09-24',
        completionTarget: '2026-09-27',
        progressPct: 70,
        beforeImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        afterImage: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'WO-ANAND-02',
        reportId: 'REP-ANAND-02',
        title: 'Amul Dairy Highway Heavy Surface Re-alignment',
        crewAssigned: 'District Heavy Machinery Paving Crew',
        contractor: 'Gujarat Highway Infra Ltd',
        estimatedCost: '₹8,20,000',
        status: 'Scheduled',
        startDate: '2026-09-28',
        completionTarget: '2026-10-02',
        progressPct: 20,
        beforeImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        afterImage: null,
      },
      {
        id: 'WO-ANAND-03',
        reportId: 'REP-ANAND-04',
        title: 'Borsad Chokdi High-Stress Intersection Concrete Overhaul',
        crewAssigned: 'AMC Special Highway Division',
        contractor: 'Anand Municipal Road Works',
        estimatedCost: '₹14,50,000',
        status: 'In Progress',
        startDate: '2026-09-20',
        completionTarget: '2026-09-30',
        progressPct: 55,
        beforeImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        afterImage: null,
      },
      {
        id: 'WO-ANAND-04',
        reportId: 'REP-ANAND-08',
        title: '100 Feet Bypass Ring Road Micro-Surfacing & Lane Marking',
        crewAssigned: 'AUDA Road Maintenance Unit',
        contractor: 'AUDA Engineering Division',
        estimatedCost: '₹5,80,000',
        status: 'Completed',
        startDate: '2026-09-18',
        completionTarget: '2026-09-23',
        progressPct: 100,
        beforeImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
        afterImage: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
      },
    ];

    for (const wo of anandWorkOrders) {
      await db.query(`
        INSERT INTO work_orders (id, report_id, title, crew_assigned, contractor, estimated_cost, status, start_date, completion_target, progress_pct, before_image, after_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING
      `, [
        wo.id, wo.reportId, wo.title, wo.crewAssigned, wo.contractor,
        wo.estimatedCost, wo.status, wo.startDate, wo.completionTarget,
        wo.progressPct, wo.beforeImage, wo.afterImage
      ]);
    }
    console.log(`  ✓ Seeded ${anandWorkOrders.length} Anand work orders.`);

    // 5. Clean and re-seed Verification Queue
    console.log('[5/6] Updating Verification Queue for Anand municipal desk...');
    await db.query('DELETE FROM verification_queue;');
    const anandVerifications = [
      {
        id: 'VER-ANAND-01',
        reportId: 'REP-ANAND-01',
        type: 'Pothole',
        aiConfidence: 0.98,
        estimatedDepth: '15.2 cm',
        estimatedArea: '0.18 sq m',
        officerStatus: 'Pending Verification',
        aiFlaggedSeverity: 'High',
        location: 'Station Road, Near Anand Railway Station, Anand',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        inspectionNotes: 'AI Computer Vision verifies deep crater on approach to main railway terminal. Urgent patching recommended.',
      },
      {
        id: 'VER-ANAND-02',
        reportId: 'REP-ANAND-02',
        type: 'Pothole',
        aiConfidence: 0.96,
        estimatedDepth: '18.5 cm',
        estimatedArea: '0.42 sq m',
        officerStatus: 'Pending Verification',
        aiFlaggedSeverity: 'Critical',
        location: 'Amul Dairy Road, Anand',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        inspectionNotes: 'Sub-grade failure near industrial entry. Heavy vehicle traffic causing asphalt breakdown.',
      },
      {
        id: 'VER-ANAND-03',
        reportId: 'REP-ANAND-06',
        type: 'Pothole',
        aiConfidence: 0.99,
        estimatedDepth: '22.0 cm',
        estimatedArea: '0.55 sq m',
        officerStatus: 'Verified & Dispatched',
        aiFlaggedSeverity: 'Critical',
        location: 'Gamdi Overbridge Approach, Anand',
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        inspectionNotes: 'High-risk bridge approach crater. Warning cones deployed by traffic police.',
      },
    ];

    for (const v of anandVerifications) {
      await db.query(`
        INSERT INTO verification_queue (id, report_id, type, ai_confidence, estimated_depth, estimated_area, officer_status, ai_flagged_severity, location, image, inspection_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
      `, [
        v.id, v.reportId, v.type, v.aiConfidence, v.estimatedDepth,
        v.estimatedArea, v.officerStatus, v.aiFlaggedSeverity, v.location,
        v.image, v.inspectionNotes
      ]);
    }
    console.log(`  ✓ Seeded ${anandVerifications.length} verification desk items.`);

    // 6. Clean and re-seed Notifications
    console.log('[6/6] Updating Notifications for Anand road users...');
    await db.query('DELETE FROM notifications;');
    const anandNotifications = [
      {
        id: 'NOT-ANAND-01',
        title: 'Repair Completed: 100 Feet Bypass',
        message: 'AUDA maintenance crew completed micro-surfacing and lane re-marking on 100 Feet Bypass Road, Anand.',
        time: '15 mins ago',
        type: 'repair',
        read: false,
      },
      {
        id: 'NOT-ANAND-02',
        title: 'Road Hazard Alert: Borsad Chokdi',
        message: 'Deep pothole cluster detected near Borsad Chokdi intersection on Anand-Borsad Highway. Drive cautiously!',
        time: '1 hour ago',
        type: 'warning',
        read: false,
      },
      {
        id: 'NOT-ANAND-03',
        title: 'Traffic Advisory: Station Road Junction',
        message: 'Traffic slowdown reported near Anand Railway Station due to municipal asphalt repair work. Safe alternative route suggested.',
        time: '2 hours ago',
        type: 'accident',
        read: true,
      },
      {
        id: 'NOT-ANAND-04',
        title: 'Report Verified: Gamdi Overbridge',
        message: 'Your reported road defect at Gamdi Overbridge has been verified by the municipal desk and escalated for priority repair.',
        time: '1 day ago',
        type: 'system',
        read: true,
      },
    ];

    for (const n of anandNotifications) {
      await db.query(`
        INSERT INTO notifications (id, title, message, time, type, read)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [n.id, n.title, n.message, n.time, n.type, n.read]);
    }
    console.log(`  ✓ Seeded ${anandNotifications.length} notifications.`);

    // Final summary
    const totalReports = await db.query('SELECT count(*) FROM damage_reports');
    console.log('========================================================');
    console.log(` ✅ Cleanup & Refresh Complete! Total active reports: ${totalReports.rows[0].count}`);
    console.log('========================================================');
  } catch (err) {
    console.error('Data cleanup & refresh failed:', err);
  } finally {
    process.exit(0);
  }
}

cleanAndRefreshData();
