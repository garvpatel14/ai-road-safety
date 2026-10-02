// Realistic Mock Data for AI Road Safety Intelligence Platform

export const INITIAL_REPORTS = [
  {
    id: 'REP-1001',
    type: 'Pothole',
    severity: 'High',
    status: 'Pending',
    description: 'Deep road crater near railway junction causing severe traffic deceleration and risk of wheel rim damage.',
    locationName: 'Station Road, Near Anand Railway Station, Anand',
    lat: 22.5606,
    lng: 72.9575,
    date: '2026-09-24',
    time: '14:22',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Garv Patel',
    aiConfidence: '98%',
    upvotes: 38,
    depthCm: 15.2,
    widthCm: 48.0,
    areaSqM: 0.18,
    priorityScore: 92,
    district: 'Anand Town Central',
    comments: [
      { id: 1, user: 'Ramesh Patel', text: 'Very risky for two-wheelers at night!', time: '2 hours ago' },
      { id: 2, user: 'Anand Municipal Inspector', text: 'Patching team scheduled.', time: '30 mins ago' }
    ]
  },
  {
    id: 'REP-1002',
    type: 'Pothole',
    severity: 'Critical',
    status: 'In Progress',
    description: 'Severe pothole cluster across both lanes near Amul Chocolate Plant entrance.',
    locationName: 'Amul Dairy Road, Anand',
    lat: 22.5535,
    lng: 72.9515,
    date: '2026-09-25',
    time: '09:15',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Mihir Shah',
    aiConfidence: '96%',
    upvotes: 45,
    depthCm: 18.5,
    widthCm: 62.0,
    areaSqM: 0.42,
    priorityScore: 96,
    district: 'Amul Industrial Zone',
    comments: [
      { id: 1, user: 'Dairy Milk Van Ops', text: 'Slows down tankers entering facility.', time: '3 hours ago' }
    ]
  },
  {
    id: 'REP-1003',
    type: 'Crack',
    severity: 'Medium',
    status: 'Under Review',
    description: 'Long longitudinal crack expanding along the busy commercial market corridor.',
    locationName: 'Nana Bazar, Tower Road, Anand',
    lat: 22.5595,
    lng: 72.9460,
    date: '2026-09-23',
    time: '11:40',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Kunal Joshi',
    aiConfidence: '92%',
    upvotes: 14,
    depthCm: 4.8,
    widthCm: 14.0,
    areaSqM: 1.10,
    priorityScore: 58,
    district: 'Old Anand Market',
    comments: []
  },
  {
    id: 'REP-1004',
    type: 'Pothole',
    severity: 'High',
    status: 'Pending',
    description: 'Sharp-edged pothole on highway junction causing sudden vehicle swerving.',
    locationName: 'Borsad Chokdi, Anand-Borsad Highway, Anand',
    lat: 22.5400,
    lng: 72.9320,
    date: '2026-09-25',
    time: '16:00',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'State Highway Patrol',
    aiConfidence: '94%',
    upvotes: 29,
    depthCm: 14.0,
    widthCm: 42.0,
    areaSqM: 0.16,
    priorityScore: 84,
    district: 'Southern Bypass',
    comments: []
  },
  {
    id: 'REP-1005',
    type: 'Crack',
    severity: 'Medium',
    status: 'Under Review',
    description: 'Spiderweb alligator cracks near college campus roundabout.',
    locationName: 'Mota Bazar, Near BVM College, Vallabh Vidyanagar, Anand',
    lat: 22.5528,
    lng: 72.9242,
    date: '2026-09-24',
    time: '08:30',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'Student Commuter Council',
    aiConfidence: '91%',
    upvotes: 21,
    depthCm: 5.5,
    widthCm: 35.0,
    areaSqM: 0.65,
    priorityScore: 66,
    district: 'Vidyanagar Education Hub',
    comments: []
  },
  {
    id: 'REP-1006',
    type: 'Repair',
    severity: 'Low',
    status: 'Resolved',
    description: 'New micro-surfacing and lane re-marking completed by Anand Urban Development Authority.',
    locationName: '100 Feet Bypass Road, Anand',
    lat: 22.5690,
    lng: 72.9350,
    date: '2026-09-22',
    time: '17:00',
    image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
    reportedBy: 'AUDA Road Maintenance',
    aiConfidence: '100%',
    upvotes: 72,
    depthCm: 0,
    widthCm: 0,
    areaSqM: 45.0,
    priorityScore: 10,
    district: 'Northern Ring Road',
    comments: []
  },
  {
    id: 'REP-1007',
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
    upvotes: 56,
    depthCm: 22.0,
    widthCm: 75.0,
    areaSqM: 0.55,
    priorityScore: 98,
    district: 'Eastern Anand',
    comments: []
  },
  {
    id: 'REP-1008',
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
    upvotes: 19,
    depthCm: 12.5,
    widthCm: 38.0,
    areaSqM: 0.14,
    priorityScore: 76,
    district: 'Karamsad Ward',
    comments: []
  }
];

export const MOCK_RQI_SEGMENTS = [
  { id: 'RQI-1', name: 'Station Road to Nana Bazar Corridor', rqiScore: 36, status: 'Poor', lat1: 22.5606, lng1: 72.9575, lat2: 22.5595, lng2: 72.9460 },
  { id: 'RQI-2', name: 'Amul Dairy Industrial Highway', rqiScore: 48, status: 'Fair', lat1: 22.5535, lng1: 72.9515, lat2: 22.5400, lng2: 72.9320 },
  { id: 'RQI-3', name: '100 Feet Bypass Smooth Ring Road', rqiScore: 94, status: 'Good', lat1: 22.5690, lng1: 72.9350, lat2: 22.5580, lng2: 72.9260 },
  { id: 'RQI-4', name: 'Vidyanagar Double Road Education Corridor', rqiScore: 88, status: 'Good', lat1: 22.5580, lng1: 72.9260, lat2: 22.5528, lng2: 72.9242 },
  { id: 'RQI-5', name: 'Karamsad Heritage Boulevard', rqiScore: 62, status: 'Fair', lat1: 22.5528, lng1: 72.9242, lat2: 22.5475, lng2: 72.8988 },
];

export const MOCK_WORK_ORDERS = [
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
  }
];

export const MOCK_VERIFICATION_QUEUE = [
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
    inspectionNotes: 'AI Computer Vision verifies deep crater on approach to main railway terminal. Urgent patching recommended.'
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
    inspectionNotes: 'Sub-grade failure near industrial entry. Heavy vehicle traffic causing asphalt breakdown.'
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
    inspectionNotes: 'High-risk bridge approach crater. Warning cones deployed by municipal inspection team.'
  }
];

export const INITIAL_NOTIFICATIONS = [
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
    name: 'Garv Patel',
    email: 'garv@saferoad.ai',
    role: 'Admin Supervisor',
    status: 'Active',
    reportsSubmitted: 127,
    joinedDate: 'Aug 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'USR-4',
    name: 'Mihir Shah',
    email: 'mihir@saferoad.ai',
    role: 'Municipal Engineer',
    status: 'Active',
    reportsSubmitted: 98,
    joinedDate: 'Jul 2025',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
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
    { zone: 'Station Road to Gamdi Overbridge Corridor', hazardScore: 94, incidents: 88, status: 'Critical Action Needed' },
    { zone: 'Amul Dairy Industrial Highway', hazardScore: 88, incidents: 64, status: 'Priority Repair' },
    { zone: 'Borsad Chokdi High-Speed Junction', hazardScore: 76, incidents: 41, status: 'Under Maintenance' },
    { zone: 'Vallabh Vidyanagar College Road Hub', hazardScore: 68, incidents: 29, status: 'Monitoring' },
    { zone: 'Nana Bazar Commercial Market Corridor', hazardScore: 62, incidents: 22, status: 'Scheduled' },
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
