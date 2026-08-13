// Realistic Mock Data for AI Road Safety Intelligence Platform

export const INITIAL_REPORTS = [
  {
    id: 'REP-1001',
    type: 'Pothole',
    severity: 'High',
    status: 'Pending',
    description: 'Deep pothole in middle of lane causing severe traffic deceleration & risk of wheel damage.',
    locationName: 'Main St & 4th Ave, Downtown',
    lat: 37.7749,
    lng: -122.4194,
    date: '2026-07-30',
    time: '14:22',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Alex Morgan',
    aiConfidence: '98%',
    upvotes: 24,
    depthCm: 14.2,
    widthCm: 45.0,
    areaSqM: 0.16,
    priorityScore: 88,
    district: 'Central Commercial',
    comments: [
      { id: 1, user: 'Sarah Connor', text: 'Damaged my tire rim yesterday night! Needs urgent repair.', time: '2 hours ago' },
      { id: 2, user: 'City Inspector #12', text: 'Scheduled for emergency patching crew.', time: '30 mins ago' }
    ]
  },
  {
    id: 'REP-1002',
    type: 'Crack',
    severity: 'Medium',
    status: 'Under Review',
    description: 'Long longitudinal asphalt crack expanding along the bike lane edge.',
    locationName: 'Oakland Blvd Near Bridge',
    lat: 37.7833,
    lng: -122.4167,
    date: '2026-07-29',
    time: '09:15',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Sarah Connor',
    aiConfidence: '92%',
    upvotes: 12,
    depthCm: 4.5,
    widthCm: 12.0,
    areaSqM: 1.25,
    priorityScore: 54,
    district: 'North Bay Ward',
    comments: [
      { id: 1, user: 'Cycling Guild', text: 'Hazardous for thin road bike tires.', time: '1 day ago' }
    ]
  },
  {
    id: 'REP-1003',
    type: 'Accident',
    severity: 'Critical',
    status: 'Scheduled',
    description: 'Two-vehicle side collision near intersection. Emergency services notified.',
    locationName: 'Highway 101 North Exit 22B',
    lat: 37.7650,
    lng: -122.4200,
    date: '2026-07-31',
    time: '08:45',
    vehiclesInvolved: 2,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Traffic Cam AI #04',
    aiConfidence: '99%',
    upvotes: 45,
    depthCm: 0,
    widthCm: 0,
    areaSqM: 0,
    priorityScore: 96,
    district: 'Highway Corridor 101',
    comments: []
  },
  {
    id: 'REP-1004',
    type: 'Repair',
    severity: 'Low',
    status: 'Resolved',
    description: 'Asphalt repaving and lane line re-striping completed by city maintenance crew.',
    locationName: 'Sunset Expressway Mile 14',
    lat: 37.7590,
    lng: -122.4350,
    date: '2026-07-28',
    time: '16:00',
    image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Dept of Transport',
    aiConfidence: '100%',
    upvotes: 89,
    depthCm: 0,
    widthCm: 0,
    areaSqM: 12.0,
    priorityScore: 10,
    district: 'Sunset District',
    comments: []
  },
  {
    id: 'REP-1005',
    type: 'Pothole',
    severity: 'Critical',
    status: 'In Progress',
    description: 'Multiple connected potholes creating hazardous driving condition for motorcycles.',
    locationName: 'Market Street & 8th St',
    lat: 37.7780,
    lng: -122.4120,
    date: '2026-07-30',
    time: '11:05',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'David Miller',
    aiConfidence: '95%',
    upvotes: 31,
    depthCm: 18.5,
    widthCm: 60.0,
    areaSqM: 0.45,
    priorityScore: 92,
    district: 'Central Commercial',
    comments: []
  },
  {
    id: 'REP-1006',
    type: 'Erosion',
    severity: 'High',
    status: 'Pending',
    description: 'Shoulder erosion caused by heavy rains near curve ramp.',
    locationName: 'Skyline Drive South',
    lat: 37.7400,
    lng: -122.4500,
    date: '2026-07-31',
    time: '10:30',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Elena Rostova',
    aiConfidence: '91%',
    upvotes: 18,
    depthCm: 22.0,
    widthCm: 110.0,
    areaSqM: 2.80,
    priorityScore: 78,
    district: 'Skyline Hills',
    comments: []
  }
];

export const MOCK_RQI_SEGMENTS = [
  { id: 'RQI-1', name: 'Downtown Market St Corridor', rqiScore: 38, status: 'Poor', lat1: 37.7749, lng1: -122.4194, lat2: 37.7780, lng2: -122.4120 },
  { id: 'RQI-2', name: 'Oakland Blvd Bridge Approach', rqiScore: 65, status: 'Fair', lat1: 37.7833, lng1: -122.4167, lat2: 37.7890, lng2: -122.4100 },
  { id: 'RQI-3', name: 'Sunset Expressway Westbound', rqiScore: 92, status: 'Good', lat1: 37.7590, lng1: -122.4350, lat2: 37.7520, lng2: -122.4450 },
  { id: 'RQI-4', name: 'Skyline Mountain Pass South', rqiScore: 52, status: 'Fair', lat1: 37.7400, lng1: -122.4500, lat2: 37.7320, lng2: -122.4600 },
];

export const MOCK_WORK_ORDERS = [
  {
    id: 'WO-8801',
    reportId: 'REP-1005',
    title: 'Market St Emergency Asphalt Patching',
    crewAssigned: 'Alpha Crew #4 (Cold Mix Team)',
    contractor: 'Apex Infrastructure Ltd.',
    estimatedCost: '$3,800',
    status: 'In Progress',
    startDate: '2026-08-12',
    completionTarget: '2026-08-14',
    progressPct: 65,
    beforeImage: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    afterImage: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'WO-8802',
    reportId: 'REP-1003',
    title: 'Hwy 101 Guardrail & Surface Re-alignment',
    crewAssigned: 'Highway Rapid Ops Unit',
    contractor: 'Bay Area Road Contractors',
    estimatedCost: '$12,500',
    status: 'Scheduled',
    startDate: '2026-08-15',
    completionTarget: '2026-08-17',
    progressPct: 15,
    beforeImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    afterImage: null,
  },
  {
    id: 'WO-8803',
    reportId: 'REP-1004',
    title: 'Sunset Expressway Repaving Section B',
    crewAssigned: 'Heavy Machinery Paving Team B',
    contractor: 'City Public Works',
    estimatedCost: '$8,200',
    status: 'Completed',
    startDate: '2026-07-26',
    completionTarget: '2026-07-28',
    progressPct: 100,
    beforeImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    afterImage: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
  }
];

export const MOCK_VERIFICATION_QUEUE = [
  {
    id: 'VER-401',
    reportId: 'REP-1001',
    type: 'Pothole',
    aiConfidence: 0.98,
    estimatedDepth: '14.2 cm',
    estimatedArea: '0.16 sq m',
    officerStatus: 'Pending Verification',
    aiFlaggedSeverity: 'High',
    location: 'Main St & 4th Ave, Downtown',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    inspectionNotes: 'AI model suggests high risk of vehicle axle breakdown due to sharp crater edge.'
  },
  {
    id: 'VER-402',
    reportId: 'REP-1006',
    type: 'Shoulder Erosion',
    aiConfidence: 0.91,
    estimatedDepth: '22.0 cm',
    estimatedArea: '2.80 sq m',
    officerStatus: 'Pending Verification',
    aiFlaggedSeverity: 'High',
    location: 'Skyline Drive South',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    inspectionNotes: 'Heavy rain runoff washed away sub-grade support.'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOT-1',
    title: 'Repair Completed',
    message: 'Work crew completed asphalt patching on Sunset Expressway Mile 14.',
    time: '10 mins ago',
    type: 'repair',
    read: false,
  },
  {
    id: 'NOT-2',
    title: 'Dangerous Road Alert',
    message: 'High density of potholes reported near Market Street & 8th St. Drive with caution!',
    time: '1 hour ago',
    type: 'warning',
    read: false,
  },
  {
    id: 'NOT-3',
    title: 'Accident Reported Nearby',
    message: 'Traffic collision reported on Hwy 101 Exit 22B. Alternative safe route recommended.',
    time: '3 hours ago',
    type: 'accident',
    read: true,
  },
  {
    id: 'NOT-4',
    title: 'Report Status Update',
    message: 'Your report REP-1001 has been escalated to Priority Repair status.',
    time: '1 day ago',
    type: 'system',
    read: true,
  }
];

export const MOCK_USERS = [
  {
    id: 'USR-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@saferoad.ai',
    role: 'Civilian Inspector',
    status: 'Active',
    reportsSubmitted: 18,
    joinedDate: 'Jan 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'USR-2',
    name: 'Sarah Connor',
    email: 'sarah.c@saferoad.ai',
    role: 'Field Engineer',
    status: 'Active',
    reportsSubmitted: 42,
    joinedDate: 'Nov 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'USR-3',
    name: 'Marcus Vance',
    email: 'marcus.v@saferoad.ai',
    role: 'Admin Supervisor',
    status: 'Active',
    reportsSubmitted: 95,
    joinedDate: 'Aug 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'USR-4',
    name: 'Elena Rostova',
    email: 'elena.r@saferoad.ai',
    role: 'Community Reporter',
    status: 'Pending Verification',
    reportsSubmitted: 5,
    joinedDate: 'Jul 2026',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  }
];

export const DASHBOARD_STATS = {
  totalRoadDamage: 1428,
  totalAccidents: 312,
  roadsRepaired: 984,
  dangerousRoads: 47,
  activeUsers: 12540,
  todaysReports: 38,
};

export const ANALYTICS_DATA = {
  monthlyReports: {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Damage Reports',
        data: [180, 240, 310, 280, 390, 420],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Accidents',
        data: [65, 50, 80, 72, 95, 60],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  },
  damageTypeDistribution: {
    labels: ['Potholes', 'Surface Cracks', 'Erosion / Slopes', 'Debris / Obstruction', 'Missing Signage'],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: ['#ea580c', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'],
        borderWidth: 0,
      }
    ]
  },
  highRiskZones: [
    { zone: 'Downtown Market St Corridor', hazardScore: 94, incidents: 88, status: 'Critical Action Needed' },
    { zone: 'Highway 101 Junction Exit 22', hazardScore: 88, incidents: 64, status: 'Priority Repair' },
    { zone: 'Bay Bridge Approach Blvd', hazardScore: 76, incidents: 41, status: 'Under Maintenance' },
    { zone: 'Skyline Mountain Pass', hazardScore: 68, incidents: 29, status: 'Monitoring' },
    { zone: 'Industrial Park Access Rd', hazardScore: 62, incidents: 22, status: 'Scheduled' },
  ],
  repairProgress: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Repairs Completed',
        data: [90, 110, 140, 160, 210, 230, 250],
        backgroundColor: '#10b981',
      }
    ]
  }
};
