import { NewsItem, EventItem, Department, Official, TouristSite, Document, Vacancy, GovernorMessage } from './types';

export const departments: Department[] = [
  { id: 'dept-1', name: 'Finance and Economic Planning', description: 'Manages the county budget, economic planning, and revenue collection.', mandate: 'To provide leadership in financial management, economic planning, and resource mobilization.' },
  { id: 'dept-2', name: 'Health Services', description: 'Oversees public health, hospitals, and medical services.', mandate: 'To provide quality, accessible, and affordable health care services.' },
  { id: 'dept-3', name: 'Tourism and Natural Resources', description: 'Promotes tourism and manages the county\'s natural resources.', mandate: 'To sustainably manage wildlife, forests, and promote Taita Taveta as a premier tourist destination.' },
  { id: 'dept-4', name: 'Agriculture, Livestock and Fisheries', description: 'Supports farmers and enhances food security in the county.', mandate: 'To promote innovative and sustainable agriculture and livestock production.' },
  { id: 'dept-5', name: 'Public Works, Infrastructure and Housing', description: 'Responsible for roads, buildings, and infrastructure development.', mandate: 'To develop and maintain sustainable public infrastructure.' },
];

export const officials: Official[] = [
  { id: 'off-1', name: 'H.E. Andrew Mwadime', role: 'Governor', type: 'Governor', imagePlaceholder: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', profile: 'Serving as the 3rd Governor of Taita Taveta County. Committed to economic growth, agricultural transformation, healthcare improvement, and environmental conservation.' },
  { id: 'off-2', name: 'H.E. Christine Kilalo', role: 'Deputy Governor', type: 'Deputy Governor', imagePlaceholder: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', profile: 'Assisting the Governor in steering county policy, intergovernmental relations, youth empowerment, and gender mainstreaming across all sub-counties.' },
  { id: 'off-3', name: 'Hon. John Doe', role: 'CECM - Finance & Economic Planning', type: 'CECM', departmentId: 'dept-1', imagePlaceholder: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', profile: 'Overseeing fiscal responsibility, revenue collection, medium-term expenditure frameworks, and resource allocation.' },
  { id: 'off-4', name: 'Dr. Jane Smith', role: 'CECM - Health Services', type: 'CECM', departmentId: 'dept-2', imagePlaceholder: 'https://images.unsplash.com/photo-1594824436951-7f1269556d32?w=400&q=80', profile: 'Championing universal health coverage, hospital infrastructure upgrades, maternal care, and disease prevention programs.' },
  { id: 'off-5', name: 'Hon. Peter Mwakio', role: 'CECM - Tourism & Natural Resources', type: 'CECM', departmentId: 'dept-3', imagePlaceholder: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', profile: 'Promoting eco-tourism, wildlife sanctuary partnerships, mining compliance, and sustainable forestry.' },
  { id: 'off-6', name: 'Mr. David Mutiso', role: 'CCO - Finance', type: 'CCO', departmentId: 'dept-1', imagePlaceholder: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', profile: 'Chief accounting officer managing financial compliance, auditing, and county treasury administration.' },
  { id: 'off-7', name: 'Ms. Sarah Kinyua', role: 'CCO - Public Health', type: 'CCO', departmentId: 'dept-2', imagePlaceholder: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', profile: 'Directing public health operations, community health promotor networks, and medical supply chain logistics.' },
];

export const newsItems: NewsItem[] = [
  { id: 'news-1', title: 'Governor Launches New Ward at Moi County Referral Hospital', date: '2026-07-20', summary: 'The new maternity ward will increase capacity and improve maternal healthcare services in Voi and surrounding areas.', departmentId: 'dept-2', category: 'Press Release', mainImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=80', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80'] },
  { id: 'news-2', title: 'FY 2026/2027 Budget Public Participation Schedule', date: '2026-07-15', summary: 'Citizens are invited to give their views on the upcoming county budget across all sub-counties.', departmentId: 'dept-1', category: 'Notice' },
  { id: 'news-3', title: 'Taita Taveta Shines at the Annual Tourism Expo', date: '2026-07-10', summary: 'The county showcased its rich heritage and wildlife at the national tourism expo, attracting foreign investors.', departmentId: 'dept-3', category: 'General', mainImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
  { id: 'news-4', title: 'Distribution of Subsidized Fertilizer to Farmers in Mwatate', date: '2026-07-05', summary: 'Over 5,000 bags of fertilizer have been distributed to farmers to boost crop yields this season.', departmentId: 'dept-4', category: 'Press Release', mainImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80' },
];

export const eventItems: EventItem[] = [
  { id: 'ev-1', title: 'County Health Outreach Day', date: '2026-08-05', location: 'Taveta Sub-County Hospital', departmentId: 'dept-2', mainImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80' },
  { id: 'ev-2', title: 'Tsavo Run 2026', date: '2026-08-15', location: 'Tsavo West National Park', departmentId: 'dept-3', mainImage: 'https://images.unsplash.com/photo-1552674605-173fd4c0f204?w=800&q=80', gallery: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80'] },
  { id: 'ev-3', title: 'Farmers Field Day', date: '2026-08-20', location: 'Wundanyi Agriculture Center', departmentId: 'dept-4', mainImage: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=800&q=80' },
  { id: 'ev-4', title: 'Town Hall Meeting: Infrastructure Development', date: '2026-08-28', location: 'Voi Social Hall', departmentId: 'dept-5' },
];

export const touristSites: TouristSite[] = [
  { id: 'ts-1', name: 'Tsavo East National Park', description: 'Famous for its large herds of red-dust-coated elephants and the Yatta Plateau, one of the longest lava flows in the world.', location: 'Voi', imageUrl: 'https://images.unsplash.com/photo-1549473889-14f410d83298?w=800&q=80' },
  { id: 'ts-2', name: 'Tsavo West National Park', description: 'Offers a more rugged, mountainous landscape, featuring the Mzima Springs where hippos and crocodiles can be viewed.', location: 'Mtito Andei / Taveta', imageUrl: 'https://images.unsplash.com/photo-1610996841457-3f82029fbac8?w=800&q=80' },
  { id: 'ts-3', name: 'Taita Hills Wildlife Sanctuary', description: 'A privately owned sanctuary adjacent to Tsavo West, known for excellent game viewing and the iconic Salt Lick Lodge.', location: 'Bura', imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
  { id: 'ts-4', name: 'Lake Jipe', description: 'An inter-territorial lake straddling the border of Kenya and Tanzania, rich in birdlife and offering scenic boat rides.', location: 'Taveta', imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&q=80' },
];

export const officialDocuments: Document[] = [
  { id: 'doc-1', title: 'County Integrated Development Plan (CIDP) 2023-2027', type: 'Policy', datePosted: '2023-08-10', size: '4.5 MB' },
  { id: 'doc-2', title: 'FY 2026/2027 Approved Budget Estimates', type: 'Budget', datePosted: '2026-06-30', size: '2.1 MB' },
  { id: 'doc-3', title: 'Annual Development Plan 2026/2027', type: 'Policy', datePosted: '2025-09-15', size: '1.8 MB' },
  { id: 'doc-4', title: 'TENDER: Construction of ECD Center in Mwatate', type: 'Tender', datePosted: '2026-07-22', size: '850 KB' },
  { id: 'doc-5', title: 'TENDER: Supply of Medical Equipment to Moi Hospital', type: 'Tender', datePosted: '2026-07-25', size: '1.2 MB' },
];

export const vacancies: Vacancy[] = [
  {
    id: 'vac-1',
    title: 'County Director of Health Services',
    departmentId: 'dept-2',
    departmentIds: ['dept-2', 'dept-6'],
    deadline: '2026-08-20T17:00:00',
    type: 'Full-time',
    referenceNo: 'TTC/CPSB/2026/01',
    description: 'The County Public Service Board invites applications from qualified candidates for the position of County Director of Health Services to lead healthcare policy implementation, hospital administration, and public health initiatives across all 4 sub-counties.',
    requirements: [
      'Bachelor of Medicine and Surgery (MBChB) or equivalent from a recognized institution',
      'Master’s degree in Public Health, Health Systems Management, or Medicine',
      'Minimum of 10 years experience in clinical practice and health management',
      'Valid registration with Kenya Medical Practitioners and Dentists Council (KMPDC)'
    ],
    positionsCount: 1,
    fileSize: '1.4 MB',
    viewsCount: 342,
    downloadsCount: 118,
    datePosted: '2026-07-20'
  },
  {
    id: 'vac-2',
    title: 'Agricultural Extension Officers',
    departmentId: 'dept-4',
    departmentIds: ['dept-4', 'dept-3'],
    deadline: '2026-08-15T17:00:00',
    type: 'Contract',
    referenceNo: 'TTC/CPSB/2026/02',
    description: 'Seeking energetic Agricultural Extension Officers to work closely with smallholder farming communities in Taveta, Mwatate, Voi, and Wundanyi to promote climate-smart agriculture and crop yield optimization.',
    requirements: [
      'Degree or Diploma in General Agriculture, Crop Science, or Agribusiness',
      'Minimum of 2 years field experience working with farmer cooperatives',
      'Valid motorcycle driving license (Class F/G) is an added advantage'
    ],
    positionsCount: 5,
    fileSize: '890 KB',
    viewsCount: 512,
    downloadsCount: 204,
    datePosted: '2026-07-22'
  },
  {
    id: 'vac-3',
    title: 'Revenue Collection Officers',
    departmentId: 'dept-1',
    departmentIds: ['dept-1'],
    deadline: '2026-08-10T17:00:00',
    type: 'Contract',
    referenceNo: 'TTC/CPSB/2026/03',
    description: 'The Department of Finance and Economic Planning seeks Revenue Clerks to digitize revenue streams, manage barrier toll points, market fees, and business single permit invoicing.',
    requirements: [
      'Diploma in Business Administration, Accounting, Finance, or CPA Section II',
      'Proficiency in automated revenue management systems and point-of-sale devices',
      'High level of integrity and spotless record of financial stewardship'
    ],
    positionsCount: 10,
    fileSize: '1.1 MB',
    viewsCount: 628,
    downloadsCount: 285,
    datePosted: '2026-07-18'
  },
  {
    id: 'vac-4',
    title: 'Senior Civil Engineer II (Infrastructure & Roads)',
    departmentId: 'dept-5',
    departmentIds: ['dept-5', 'dept-3'],
    deadline: '2026-08-28T17:00:00',
    type: 'Full-time',
    referenceNo: 'TTC/CPSB/2026/04',
    description: 'Oversee structural inspection, rural road grading, bridge construction, and public buildings engineering compliance in the Department of Public Works, Housing and Infrastructure.',
    requirements: [
      'Bachelor’s Degree in Civil Engineering from a recognized university',
      'Registered as a Professional Engineer with Engineers Board of Kenya (EBK)',
      'Proficiency in AutoCAD, Civil 3D, and structural analysis software'
    ],
    positionsCount: 2,
    fileSize: '1.6 MB',
    viewsCount: 289,
    downloadsCount: 94,
    datePosted: '2026-07-25'
  }
];

export const initialGovernorMessage = {
  id: 'gov-msg',
  name: 'H.E. Andrew Mwadime',
  title: 'Governor, Taita Taveta County',
  message: 'Welcome to the official portal of the County Government of Taita Taveta. We are committed to transparency, sustainable development, and service delivery to all our residents. Together, we can build a prosperous county for generations to come.',
  imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
};

export const initialEmergencyAlert = {
  enabled: true,
  title: 'HEAVY RAINFALL & FLASH FLOOD ADVISORY',
  message: 'The Meteorological Department issues a severe weather advisory for lower parts of Voi and Taveta sub-counties. Residents are advised to move to higher ground and contact the County Disaster Hotline at 0800 720 123.',
  type: 'danger' as const,
  linkUrl: '/news',
  linkText: 'View Safety Instructions'
};

export const initialHeroContent = {
  welcomeTag: 'Datoni ya Rika • Welcome to Taita Taveta',
  title: 'The Land of Endless Potential & Rich Heritage',
  titleColor: 'text-white' as const,
  subtitle: 'Official portal for the County Government of Taita Taveta. Access public services, discover investment opportunities, and explore our majestic tourist destinations.',
  slides: [
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600&q=80',
    'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1600&q=80',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80'
  ],
  actionButtons: [
    { id: 'btn_1', label: 'Our Government', url: '/about', color: 'green' as const },
    { id: 'btn_2', label: 'Explore Tourism', url: '/tourism', color: 'orange' as const }
  ]
};

export const initialCountyBranding = {
  logoUrl: '',
  countyName: 'Taita Taveta',
  countyTagline: 'County Government',
  motto: 'Datoni ya Rika'
};


