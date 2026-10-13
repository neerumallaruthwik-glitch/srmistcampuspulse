// SRM CampusPulse – Comprehensive Seed Dataset (SRM IST Ramapuram Campus)
const initialData = {
  users: [
    {
      id: "usr_student_1",
      name: "Alex Rivera",
      email: "alex.r@srmist.edu.in",
      passwordHash: "student123",
      role: "student",
      studentOrStaffId: "RA2211003020042",
      department: "Computer Science & Engineering",
      campus: "SRM IST Ramapuram",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      interests: ["Technical", "Hackathon", "Workshop", "Seminar and Conference"],
      phone: "+91 98401 23456",
      academicYear: "3rd Year B.Tech"
    },
    {
      id: "usr_student_2",
      name: "Kaviya Sundaram",
      email: "kaviya.s@srmist.edu.in",
      passwordHash: "student123",
      role: "student",
      studentOrStaffId: "RA2311004010119",
      department: "Information Technology",
      campus: "SRM IST Ramapuram",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
      interests: ["Cultural", "Music, Dance and Drama", "Sports", "NSS and Volunteering"],
      phone: "+91 97911 87654",
      academicYear: "2nd Year B.Tech"
    },
    {
      id: "usr_organizer_1",
      name: "Prof. Arun Karthik",
      email: "arunkarthik.m@srmist.edu.in",
      passwordHash: "org123",
      role: "organizer",
      studentOrStaffId: "EMP-SRM-5082",
      club: "SRM Coding Club & GDSC Chapter",
      clubId: "club_1",
      title: "Faculty Coordinator & Club Advisor",
      department: "Department of Computer Science & Engineering",
      campus: "SRM IST Ramapuram",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
      phone: "+91 94440 98765"
    },
    {
      id: "usr_organizer_2",
      name: "Swetha Raman",
      email: "swetha.raman@srmist.edu.in",
      passwordHash: "org123",
      role: "organizer",
      studentOrStaffId: "RA2111005020108",
      club: "SRM Directorate of Student Affairs (Cultural Council)",
      clubId: "club_2",
      title: "Student Convener, Cultural Guild",
      department: "Department of Electronics & Communication",
      campus: "SRM IST Ramapuram",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
      phone: "+91 98841 54321"
    },
    {
      id: "usr_admin_1",
      name: "Dr. M. Murali Krishna",
      email: "dean.studentaffairs@srmist.edu.in",
      passwordHash: "admin123",
      role: "admin",
      studentOrStaffId: "ADM-SRM-1001",
      title: "Dean of Student Affairs & Campus Life",
      department: "Office of Higher Administration",
      campus: "SRM IST Ramapuram",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
      phone: "+91 44 2249 2882"
    }
  ],

  clubs: [
    {
      id: "club_1",
      name: "SRM Coding Club & GDSC Chapter",
      department: "Computer Science & Engineering",
      coordinatorName: "Prof. Arun Karthik",
      status: "active",
      memberCount: 340,
      description: "Flagship competitive programming and open-source innovation society at SRM Ramapuram."
    },
    {
      id: "club_2",
      name: "SRM Directorate of Student Affairs (Cultural Council)",
      department: "Student Affairs",
      coordinatorName: "Swetha Raman",
      status: "active",
      memberCount: 420,
      description: "Oversees fine arts, music fests, theatrical productions, and national inter-collegiate fests."
    },
    {
      id: "club_3",
      name: "IEEE SRM Ramapuram Student Branch",
      department: "Electrical & Electronics",
      coordinatorName: "Dr. K. Radhakrishnan",
      status: "active",
      memberCount: 210,
      description: "Technical chapter conducting global symposia, robotics, and patent workshops."
    },
    {
      id: "club_4",
      name: "SRM NSS & Social Responsibility Wing",
      department: "National Service Scheme",
      coordinatorName: "Dr. V. Saravanan",
      status: "active",
      memberCount: 280,
      description: "Community engagement, green sustainability drives, and blood donation campaigns."
    },
    {
      id: "club_5",
      name: "SRM Sports Association",
      department: "Physical Education",
      coordinatorName: "Mr. R. Balaji",
      status: "active",
      memberCount: 190,
      description: "Inter-collegiate sports leagues, athletic tournaments, and indoor esports."
    }
  ],

  venues: [
    {
      id: "ven_1",
      name: "TRP Auditorium (Main Hall)",
      building: "Main Campus Administrative Block, Ground Floor",
      campus: "SRM IST Ramapuram",
      capacity: 850,
      facilities: ["Acoustic Shell Stage", "4K Main Projector", "Central Air Conditioning", "Green Rooms", "Line-Array Audio System"],
      isAvailable: true,
      inCharge: "Campus Facilities Office"
    },
    {
      id: "ven_2",
      name: "Dr. T. P. Ganesan Mini Hall 1",
      building: "PG Academic Block 1, 3rd Floor",
      campus: "SRM IST Ramapuram",
      capacity: 300,
      facilities: ["Dual Smart Displays", "Surround Sound", "Central AC", "Digital Podium", "Live Stream Camera"],
      isAvailable: true,
      inCharge: "Academic AV Section"
    },
    {
      id: "ven_3",
      name: "Tech Park Innovation Lab",
      building: "Hi-Tech Block 2, 4th Floor",
      campus: "SRM IST Ramapuram",
      capacity: 150,
      facilities: ["Gigabit LAN Drop Per Desk", "Dual HD Projectors", "Air Conditioning", "Workstations with GPUs"],
      isAvailable: true,
      inCharge: "Dept of CSE"
    },
    {
      id: "ven_4",
      name: "Mechanical Seminar Hall",
      building: "Mechanical Engineering Block, Ground Floor",
      campus: "SRM IST Ramapuram",
      capacity: 220,
      facilities: ["Smart Podium", "PA System", "AC", "Tiered Gallery Seating"],
      isAvailable: true,
      inCharge: "Dept of Mechanical"
    },
    {
      id: "ven_5",
      name: "Central Library AV Conference Hall",
      building: "Central Library Complex, 2nd Floor",
      campus: "SRM IST Ramapuram",
      capacity: 180,
      facilities: ["Video Conferencing", "Central AC", "Digital Display Screen", "Microphone Array"],
      isAvailable: true,
      inCharge: "Library Committee"
    },
    {
      id: "ven_6",
      name: "Ramapuram Indoor Sports Arena",
      building: "Athletics & Sports Pavilion",
      campus: "SRM IST Ramapuram",
      capacity: 500,
      facilities: ["Synthetic Wooden Turf", "Electronic Scoreboard", "Floodlights", "Locker Rooms"],
      isAvailable: true,
      inCharge: "Dept of Physical Education"
    },
    {
      id: "ven_7",
      name: "SRM Open Amphitheatre",
      building: "Central Campus Quadrangle Lawn",
      campus: "SRM IST Ramapuram",
      capacity: 1000,
      facilities: ["Open-Air Amphitheatre Seating", "High-power Floodlights", "Acoustic Shell", "Power Stations"],
      isAvailable: true,
      inCharge: "Campus Administration"
    }
  ],

  events: [
    {
      id: "evt_1",
      title: "SRM HackMatrix 2026: 36-Hour National Collegiate Hackathon",
      category: "Hackathon",
      format: "offline",
      description: "The flagship annual 36-hour national collegiate hackathon organized by SRM Coding Club. Open to undergraduate teams nationwide to build transformative solutions in Generative AI, Cloud Infrastructure, Web3, and HealthTech. Mentorship by senior architects from Google, Microsoft & Zoho, ₹1,50,000 prize pool, GitHub swag, and 24/7 food & snacks provided.",
      posterUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_3",
      venueName: "Tech Park Innovation Lab",
      date: "2026-10-24",
      startTime: "09:00",
      endTime: "21:00",
      registrationOpenDate: "2026-10-01",
      registrationCloseDate: "2026-10-22",
      capacity: 150,
      registeredCount: 112,
      isPaid: false,
      feeAmount: 0,
      currency: "INR",
      status: "approved",
      organizerId: "usr_organizer_1",
      organizerName: "Prof. Arun Karthik",
      facultyCoordinator: "Prof. Arun Karthik (CSE)",
      clubId: "club_1",
      clubName: "SRM Coding Club & GDSC Chapter",
      tags: ["Hackathon", "AI", "Coding", "Cloud", "Cash Prizes"],
      eligibility: "All undergraduate students with valid college ID. Teams of 2 to 4 members.",
      rules: [
        "Teams must consist of 2 to 4 members",
        "Bring college ID card, laptop, and chargers",
        "Original code development starts strictly at hackathon kick-off"
      ],
      prerequisites: "Basic proficiency in Git, Python / JavaScript / Java, and problem-solving.",
      contactEmail: "codingclub@srmist.edu.in",
      contactPhone: "+91 94440 98765",
      cancellationPolicy: "Free registration. Please notify 48 hours in advance if unable to attend.",
      resources: [
        { name: "SRM HackMatrix Problem Statements & Guide.pdf", type: "pdf", size: "2.4 MB", url: "#" },
        { name: "API Starter Kits & Cloud Credits.zip", type: "zip", size: "14.1 MB", url: "#" }
      ],
      approvalHistory: [
        {
          status: "approved",
          timestamp: "2026-10-02T10:30:00Z",
          adminName: "Dr. M. Murali Krishna (Dean)",
          notes: "Approved. Tech Park Lab permissions and overnight network security cleared."
        }
      ]
    },
    {
      id: "evt_2",
      title: "Milan Cultural Fiesta: Annual Battle of Bands & Fusion Dance",
      category: "Cultural",
      format: "offline",
      description: "The grandest cultural stage on the Ramapuram campus! Featuring western acoustic rock bands, classical Carnatic-fusion choreography, beatboxing cyphers, and celebrity DJ night. Food stalls and art popups line the quad.",
      posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_1",
      venueName: "TRP Auditorium (Main Hall)",
      date: "2026-10-28",
      startTime: "16:30",
      endTime: "21:30",
      registrationOpenDate: "2026-10-05",
      registrationCloseDate: "2026-10-27",
      capacity: 850,
      registeredCount: 640,
      isPaid: true,
      feeAmount: 150,
      currency: "INR",
      status: "approved",
      organizerId: "usr_organizer_2",
      organizerName: "Swetha Raman",
      facultyCoordinator: "Dr. P. Sangeetha (Cultural Advisory)",
      clubId: "club_2",
      clubName: "SRM Directorate of Student Affairs (Cultural Council)",
      tags: ["Music", "Dance", "Battle of Bands", "Campus Fest", "Gala"],
      eligibility: "Open to all SRM students. Entry pass required.",
      rules: [
        "Entry strictly with verified digital QR ticket and College ID",
        "Auditorium doors close 30 minutes after commencement",
        "Disorderly conduct will result in immediate disqualification"
      ],
      prerequisites: "None. Enthusiastic campus spirit!",
      contactEmail: "culturalcouncil@srmist.edu.in",
      contactPhone: "+91 98841 54321",
      cancellationPolicy: "Refundable up to 24 hours prior to fest commencement.",
      resources: [
        { name: "Band Performance Schedule & Stage Lineup.pdf", type: "pdf", size: "1.1 MB", url: "#" }
      ],
      approvalHistory: [
        {
          status: "approved",
          timestamp: "2026-10-05T14:00:00Z",
          adminName: "Dr. M. Murali Krishna (Dean)",
          notes: "Approved. Auditorium acoustics and crowd management protocol approved."
        }
      ]
    },
    {
      id: "evt_3",
      title: "CyberShield: Capture The Flag (CTF) National Cyber Challenge",
      category: "Technical",
      format: "offline",
      description: "An intensive collegiate Capture The Flag competition testing binary exploitation, reverse engineering, web security, cryptography, and digital forensics. Live jeopardy scoreboard.",
      posterUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_2",
      venueName: "Dr. T. P. Ganesan Mini Hall 1",
      date: "2026-11-03",
      startTime: "10:00",
      endTime: "17:00",
      registrationOpenDate: "2026-10-10",
      registrationCloseDate: "2026-11-01",
      capacity: 300,
      registeredCount: 185,
      isPaid: false,
      feeAmount: 0,
      currency: "INR",
      status: "approved",
      organizerId: "usr_organizer_1",
      organizerName: "Prof. Arun Karthik",
      facultyCoordinator: "Prof. Arun Karthik (CSE)",
      clubId: "club_1",
      clubName: "SRM Coding Club & GDSC Chapter",
      tags: ["Cybersecurity", "CTF", "Ethical Hacking", "Cryptography", "Linux"],
      eligibility: "Open to engineering students across all semesters.",
      rules: [
        "Strict adherence to ethical hacking ethics",
        "Attacking the scoring infrastructure leads to ban"
      ],
      prerequisites: "Familiarity with Linux terminal, Wireshark, Burp Suite, or Python.",
      contactEmail: "cybershield@srmist.edu.in",
      contactPhone: "+91 94440 98765",
      cancellationPolicy: "Free registration. Cancel anytime before closing date.",
      resources: [
        { name: "CTF Rules and Sandbox VM Setup Guide.pdf", type: "pdf", size: "3.2 MB", url: "#" }
      ],
      approvalHistory: [
        {
          status: "approved",
          timestamp: "2026-10-08T09:15:00Z",
          adminName: "Dr. M. Murali Krishna (Dean)",
          notes: "Approved. Isolated network sandbox confirmed."
        }
      ]
    },
    {
      id: "evt_4",
      title: "NextGen Web & Cloud Architecture Masterclass with AWS Lead",
      category: "Workshop",
      format: "online",
      description: "Hands-on technical workshop on serverless microservices, Docker containerization, Kubernetes orchestration, and deploying resilient workloads on AWS Cloud.",
      posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_5",
      venueName: "Central Library AV Conference Hall (Hybrid Stream)",
      date: "2026-10-31",
      startTime: "14:00",
      endTime: "17:30",
      registrationOpenDate: "2026-10-08",
      registrationCloseDate: "2026-10-30",
      capacity: 180,
      registeredCount: 142,
      isPaid: true,
      feeAmount: 100,
      currency: "INR",
      status: "approved",
      organizerId: "usr_organizer_1",
      organizerName: "Prof. Arun Karthik",
      facultyCoordinator: "Dr. K. Radhakrishnan (IEEE)",
      clubId: "club_3",
      clubName: "IEEE SRM Ramapuram Student Branch",
      tags: ["AWS", "Cloud", "Docker", "DevOps", "Workshop", "Certificate"],
      eligibility: "Open to all students interested in cloud computing.",
      rules: [
        "Hands-on laptop setup required for live cloud labs",
        "Certificate issued upon 100% attendance and lab completion"
      ],
      prerequisites: "Laptop with Docker Desktop and AWS Free Tier account.",
      contactEmail: "ieee@srmist.edu.in",
      contactPhone: "+91 98401 22334",
      cancellationPolicy: "Refundable up to 24 hours prior to session.",
      resources: [
        { name: "Hands-on Lab Exercise Notebook.pdf", type: "pdf", size: "1.8 MB", url: "#" }
      ],
      approvalHistory: [
        {
          status: "approved",
          timestamp: "2026-10-07T11:45:00Z",
          adminName: "Dr. M. Murali Krishna (Dean)",
          notes: "Approved. AV setup and guest speaker coordination cleared."
        }
      ]
    },
    {
      id: "evt_5",
      title: "SRM Pro League: Inter-Department Futsal & Badminton Trophy",
      category: "Sports",
      format: "offline",
      description: "Annual inter-department sporting clash! 16 department teams compete over 3 days under arena floodlights in 5v5 Futsal and Badminton Singles/Doubles.",
      posterUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_6",
      venueName: "Ramapuram Indoor Sports Arena",
      date: "2026-11-08",
      startTime: "16:00",
      endTime: "21:00",
      registrationOpenDate: "2026-10-12",
      registrationCloseDate: "2026-11-06",
      capacity: 500,
      registeredCount: 290,
      isPaid: false,
      feeAmount: 0,
      currency: "INR",
      status: "approved",
      organizerId: "usr_organizer_2",
      organizerName: "Swetha Raman",
      facultyCoordinator: "Mr. R. Balaji (Physical Director)",
      clubId: "club_5",
      clubName: "SRM Sports Association",
      tags: ["Sports", "Futsal", "Badminton", "Athletics", "Championship"],
      eligibility: "Department-wise registered squads and student spectators.",
      rules: ["Proper non-marking sports shoes mandatory inside indoor court", "Fair play code strictly enforced"],
      prerequisites: "Sports jersey and college ID.",
      contactEmail: "sports@srmist.edu.in",
      contactPhone: "+91 94441 55667",
      cancellationPolicy: "Free registration.",
      resources: [
        { name: "Tournament Fixtures & Match Schedule.pdf", type: "pdf", size: "850 KB", url: "#" }
      ],
      approvalHistory: [
        {
          status: "approved",
          timestamp: "2026-10-09T16:00:00Z",
          adminName: "Dr. M. Murali Krishna (Dean)",
          notes: "Approved. Medical staff and first aid post verified."
        }
      ]
    },
    {
      id: "evt_6",
      title: "Clean Campus & Green Earth Drive: E-Waste Recycling & Tree Plantation",
      category: "NSS and Volunteering",
      format: "offline",
      description: "University-wide social responsibility initiative organized by SRM NSS Wing. Involves sapling plantation across the campus quadrangle and collecting obsolete e-waste for certified recycling.",
      posterUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_7",
      venueName: "SRM Open Amphitheatre & Campus Lawns",
      date: "2026-11-12",
      startTime: "08:30",
      endTime: "12:30",
      registrationOpenDate: "2026-10-10",
      registrationCloseDate: "2026-11-10",
      capacity: 400,
      registeredCount: 215,
      isPaid: false,
      feeAmount: 0,
      currency: "INR",
      status: "approved",
      organizerId: "usr_organizer_2",
      organizerName: "Swetha Raman",
      facultyCoordinator: "Dr. V. Saravanan (NSS Coordinator)",
      clubId: "club_4",
      clubName: "SRM NSS & Social Responsibility Wing",
      tags: ["NSS", "Volunteering", "Green Drive", "Environment", "Service Hours"],
      eligibility: "All SRM students eligible. NSS certificate and community service credits awarded.",
      rules: ["Gloves and biodegradable bags provided at check-in"],
      prerequisites: "Wear comfortable walking shoes.",
      contactEmail: "nss@srmist.edu.in",
      contactPhone: "+91 98840 11223",
      cancellationPolicy: "Free registration.",
      resources: [
        { name: "Green Campus Route Map & Task Sheet.pdf", type: "pdf", size: "1.2 MB", url: "#" }
      ],
      approvalHistory: [
        {
          status: "approved",
          timestamp: "2026-10-10T12:00:00Z",
          adminName: "Dr. M. Murali Krishna (Dean)",
          notes: "Approved. Horticulture team coordinated."
        }
      ]
    },
    // Events currently awaiting Administrative Approval (demonstrates Approval Workflow)
    {
      id: "evt_7",
      title: "AI in Healthcare & Clinical Diagnostics Symposium",
      category: "Seminar and Conference",
      format: "offline",
      description: "Distinguished research symposium covering deep learning algorithms for medical imaging, genomic sequencing, and automated diagnosis with doctors from SRM Medical College.",
      posterUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_4",
      venueName: "Mechanical Seminar Hall",
      date: "2026-11-18",
      startTime: "10:00",
      endTime: "16:00",
      registrationOpenDate: "2026-10-15",
      registrationCloseDate: "2026-11-16",
      capacity: 220,
      registeredCount: 0,
      isPaid: false,
      feeAmount: 0,
      currency: "INR",
      status: "pending",
      organizerId: "usr_organizer_1",
      organizerName: "Prof. Arun Karthik",
      facultyCoordinator: "Prof. Arun Karthik (CSE)",
      clubId: "club_1",
      clubName: "SRM Coding Club & GDSC Chapter",
      tags: ["AI", "Healthcare", "Medical", "Research", "Conference"],
      eligibility: "Students and research scholars.",
      rules: ["Silence mobile phones during clinical video demonstrations"],
      prerequisites: "Basic understanding of data science.",
      contactEmail: "codingclub@srmist.edu.in",
      contactPhone: "+91 94440 98765",
      cancellationPolicy: "Free registration.",
      resources: [],
      approvalHistory: [
        {
          status: "submitted",
          timestamp: "2026-10-12T11:00:00Z",
          adminName: "Prof. Arun Karthik (Organizer)",
          notes: "Submitted for Dean of Student Affairs review."
        }
      ]
    },
    {
      id: "evt_8",
      title: "SRM Wordsmith: Inter-Collegiate Literary & Parliamentary Debate",
      category: "Literary",
      format: "offline",
      description: "Asian Parliamentary debate championship and creative writing marathon. Topics cover geo-politics, technology ethics, and philosophy.",
      posterUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      venueId: "ven_2",
      venueName: "Dr. T. P. Ganesan Mini Hall 1",
      date: "2026-11-20",
      startTime: "13:00",
      endTime: "18:00",
      registrationOpenDate: "2026-10-16",
      registrationCloseDate: "2026-11-18",
      capacity: 300,
      registeredCount: 0,
      isPaid: false,
      feeAmount: 0,
      currency: "INR",
      status: "pending",
      organizerId: "usr_organizer_2",
      organizerName: "Swetha Raman",
      facultyCoordinator: "Dr. P. Sangeetha (Cultural Advisory)",
      clubId: "club_2",
      clubName: "SRM Directorate of Student Affairs (Cultural Council)",
      tags: ["Debate", "Literary", "Parliamentary", "Public Speaking"],
      eligibility: "Open to all departments.",
      rules: ["Adhere strictly to parliamentary debate speaker timings"],
      prerequisites: "None.",
      contactEmail: "culturalcouncil@srmist.edu.in",
      contactPhone: "+91 98841 54321",
      cancellationPolicy: "Free registration.",
      resources: [],
      approvalHistory: [
        {
          status: "submitted",
          timestamp: "2026-10-12T14:30:00Z",
          adminName: "Swetha Raman (Organizer)",
          notes: "Initial submission for Mini Hall 1."
        }
      ]
    }
  ],

  registrations: [
    {
      id: "reg_1001",
      eventId: "evt_1",
      eventTitle: "SRM HackMatrix 2026: 36-Hour National Collegiate Hackathon",
      eventDate: "2026-10-24",
      eventStartTime: "09:00",
      eventEndTime: "21:00",
      eventVenue: "Tech Park Innovation Lab",
      posterUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      userId: "usr_student_1",
      userName: "Alex Rivera",
      userEmail: "alex.r@srmist.edu.in",
      userRegNo: "RA2211003020042",
      userDept: "Computer Science & Engineering",
      qrCodeToken: "SRM-EVT1-REG1001-SECURE-98471",
      seatNumber: "Lab Bench A-14",
      status: "registered",
      paymentStatus: "free",
      amountPaid: 0,
      registeredAt: "2026-10-10T14:22:00Z",
      checkedInAt: null,
      checkedInBy: null
    },
    {
      id: "reg_1002",
      eventId: "evt_2",
      eventTitle: "Milan Cultural Fiesta: Annual Battle of Bands & Fusion Dance",
      eventDate: "2026-10-28",
      eventStartTime: "16:30",
      eventEndTime: "21:30",
      eventVenue: "TRP Auditorium (Main Hall)",
      posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      userId: "usr_student_1",
      userName: "Alex Rivera",
      userEmail: "alex.r@srmist.edu.in",
      userRegNo: "RA2211003020042",
      userDept: "Computer Science & Engineering",
      qrCodeToken: "SRM-EVT2-REG1002-SECURE-32918",
      seatNumber: "Tier-1 Seat B-22",
      status: "registered",
      paymentStatus: "paid",
      paymentId: "TXN_SRM_99218274_TEST",
      amountPaid: 150,
      registeredAt: "2026-10-11T16:05:00Z",
      checkedInAt: null,
      checkedInBy: null
    },
    {
      id: "reg_1003",
      eventId: "evt_3",
      eventTitle: "CyberShield: Capture The Flag (CTF) National Cyber Challenge",
      eventDate: "2026-11-03",
      eventStartTime: "10:00",
      eventEndTime: "17:00",
      eventVenue: "Dr. T. P. Ganesan Mini Hall 1",
      posterUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      userId: "usr_student_2",
      userName: "Kaviya Sundaram",
      userEmail: "kaviya.s@srmist.edu.in",
      userRegNo: "RA2311004010119",
      userDept: "Information Technology",
      qrCodeToken: "SRM-EVT3-REG1003-SECURE-77123",
      seatNumber: "Mini Hall Row C-08",
      status: "registered",
      paymentStatus: "free",
      amountPaid: 0,
      registeredAt: "2026-10-12T09:12:00Z",
      checkedInAt: null,
      checkedInBy: null
    },
    // Seed sample attendee already checked in to demonstrate anti-duplicate guard!
    {
      id: "reg_1004",
      eventId: "evt_1",
      eventTitle: "SRM HackMatrix 2026: 36-Hour National Collegiate Hackathon",
      eventDate: "2026-10-24",
      eventStartTime: "09:00",
      eventEndTime: "21:00",
      eventVenue: "Tech Park Innovation Lab",
      posterUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      userId: "usr_student_2",
      userName: "Kaviya Sundaram",
      userEmail: "kaviya.s@srmist.edu.in",
      userRegNo: "RA2311004010119",
      userDept: "Information Technology",
      qrCodeToken: "SRM-EVT1-REG1004-CHECKEDIN-ALREADY",
      seatNumber: "Lab Bench A-15",
      status: "attended",
      paymentStatus: "free",
      amountPaid: 0,
      registeredAt: "2026-10-11T15:00:00Z",
      checkedInAt: "2026-10-24T09:12:44Z",
      checkedInBy: "Gate Scanner (Prof. Arun Karthik)"
    }
  ],

  // Certificates earned by students upon verified attendance
  certificates: [
    {
      id: "cert_901",
      certificateNumber: "SRM-CERT-2026-CS-0428",
      userId: "usr_student_1",
      userName: "Alex Rivera",
      userRegNo: "RA2211003020042",
      department: "Computer Science & Engineering",
      eventTitle: "SRM Cloud Native DevOps Bootcamp 2026",
      eventDate: "2026-09-20",
      organizerClub: "SRM Coding Club & GDSC Chapter",
      issuedBy: "Dean of Student Affairs & Faculty Advisor",
      issuedAt: "2026-09-22T10:00:00Z",
      verificationHash: "SHA256:7a9f8e4b2c1d3e5f6a8b9c0d1e2f3a4b",
      grade: "Distinction / First Class with Honor"
    },
    {
      id: "cert_902",
      certificateNumber: "SRM-CERT-2026-IT-0112",
      userId: "usr_student_2",
      userName: "Kaviya Sundaram",
      userRegNo: "RA2311004010119",
      department: "Information Technology",
      eventTitle: "National Cyber Awareness & Defence Sprint",
      eventDate: "2026-09-15",
      organizerClub: "IEEE SRM Ramapuram Student Branch",
      issuedBy: "Dean of Student Affairs & IEEE Chairman",
      issuedAt: "2026-09-17T14:30:00Z",
      verificationHash: "SHA256:8b0e1f2a3c4d5e6f7a8b9c0d1e2f3a4c",
      grade: "Merit of Participation"
    }
  ],

  // In-app Notification Center items
  notifications: [
    {
      id: "notif_1",
      recipientId: "usr_student_1",
      title: "Registration Confirmed: SRM HackMatrix 2026",
      message: "Your seat (Lab Bench A-14) is confirmed. Your digital QR pass is ready in My Tickets.",
      type: "registration",
      read: false,
      createdAt: "2026-10-10T14:23:00Z"
    },
    {
      id: "notif_2",
      recipientId: "usr_student_1",
      title: "Payment Receipt: Milan Cultural Fiesta Pass",
      message: "Payment of ₹150 received successfully (Ref: TXN_SRM_99218274). Entry pass issued.",
      type: "payment",
      read: false,
      createdAt: "2026-10-11T16:06:00Z"
    },
    {
      id: "notif_3",
      recipientId: "usr_student_1",
      title: "Certificate Issued: Cloud Native DevOps Bootcamp",
      message: "Your verified certificate (SRM-CERT-2026-CS-0428) has been generated and is ready for download.",
      type: "certificate",
      read: true,
      createdAt: "2026-09-22T10:05:00Z"
    },
    {
      id: "notif_4",
      recipientId: "usr_organizer_1",
      title: "Event Proposal Approved: CyberShield CTF",
      message: "Dr. M. Murali Krishna approved 'CyberShield: Capture The Flag'. Venue Mini Hall 1 confirmed.",
      type: "approval",
      read: false,
      createdAt: "2026-10-08T09:16:00Z"
    },
    {
      id: "notif_5",
      recipientId: "usr_admin_1",
      title: "New Event Awaiting Clearance: AI in Healthcare",
      message: "Prof. Arun Karthik submitted 'AI in Healthcare & Clinical Diagnostics' for Mechanical Seminar Hall.",
      type: "approval",
      read: false,
      createdAt: "2026-10-12T11:05:00Z"
    }
  ],

  auditLogs: [
    {
      id: "log_1",
      action: "EVENT_APPROVED",
      targetType: "event",
      targetId: "evt_1",
      targetName: "SRM HackMatrix 2026",
      performedBy: "Dr. M. Murali Krishna",
      role: "admin",
      timestamp: "2026-10-02T10:30:00Z",
      details: "Approved event request. Tech Park Innovation Lab confirmed."
    },
    {
      id: "log_2",
      action: "EVENT_APPROVED",
      targetType: "event",
      targetId: "evt_2",
      targetName: "Milan Cultural Fiesta",
      performedBy: "Dr. M. Murali Krishna",
      role: "admin",
      timestamp: "2026-10-05T14:00:00Z",
      details: "Approved event request. TRP Auditorium cleared."
    }
  ]
};

module.exports = initialData;
