export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  yearsOfExperience: number;
  linkedin: string;
  fitLevel: 'strong' | 'good' | 'weak';
  summary: string;
  skills: string[];
  education: Array<{
    degree: string;
    school: string;
    year: number;
    focus?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  resumeFile: string;
};

export const candidates: Candidate[] = [
  {
    id: 'ml-001',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '(415) 555-0142',
    location: 'San Francisco, CA',
    currentRole: 'Senior Machine Learning Engineer',
    currentCompany: 'Anthropic',
    yearsOfExperience: 8,
    linkedin: 'linkedin.com/in/sarahchen-ml',
    fitLevel: 'strong',
    summary: 'Senior ML Engineer with 8 years of experience building and deploying production ML systems at scale. Currently at Anthropic working on LLM safety and alignment. Previously led ML infrastructure at Google Brain, shipping models serving billions of requests daily.',
    skills: [
      'PyTorch',
      'TensorFlow',
      'Kubernetes',
      'MLOps',
      'Distributed Training',
      'Model Optimization',
      'Python',
      'Go',
      'AWS',
      'GCP',
    ],
    education: [
      {
        degree: 'Ph.D. in Computer Science',
        school: 'Stanford University',
        year: 2016,
        focus: 'Machine Learning',
      },
      {
        degree: 'B.S. in Computer Science',
        school: 'UC Berkeley',
        year: 2012,
      },
    ],
    experience: [
      {
        title: 'Senior Machine Learning Engineer',
        company: 'Anthropic',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        highlights: [
          'Leading ML infrastructure team focused on training efficiency and model deployment',
          'Reduced model training costs by 40% through distributed training optimizations',
          'Built internal tools for model evaluation and safety testing used by 50+ researchers',
          'Collaborated with product team to ship Claude features to millions of users',
        ],
      },
      {
        title: 'Machine Learning Engineer',
        company: 'Google Brain',
        location: 'Mountain View, CA',
        startDate: '2018-06',
        endDate: '2022-02',
        highlights: [
          'Shipped recommendation models serving 2B+ daily predictions on YouTube',
          'Designed and implemented real-time ML inference pipeline with <10ms latency',
          'Led cross-functional project with Search team improving query understanding by 15%',
          'Mentored 5 junior engineers and established ML best practices documentation',
        ],
      },
      {
        title: 'Machine Learning Engineer',
        company: 'Airbnb',
        location: 'San Francisco, CA',
        startDate: '2016-08',
        endDate: '2018-05',
        highlights: [
          'Built pricing optimization models increasing host revenue by 12%',
          'Developed fraud detection system reducing chargebacks by 25%',
          'Created ML feature platform used by 20+ data scientists',
        ],
      },
    ],
    resumeFile: 'sarah_chen_resume.pdf',
  },
  {
    id: 'ml-002',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    phone: '(510) 555-0198',
    location: 'Oakland, CA',
    currentRole: 'Machine Learning Engineer II',
    currentCompany: 'Stripe',
    yearsOfExperience: 5,
    linkedin: 'linkedin.com/in/marcusjohnson',
    fitLevel: 'good',
    summary: 'ML Engineer with 5 years of experience in applied ML for fintech. Strong background in fraud detection, risk modeling, and real-time inference systems. Looking to transition into more AI-focused work at a leading AI company.',
    skills: [
      'Python',
      'PyTorch',
      'Scikit-learn',
      'XGBoost',
      'Spark',
      'Kafka',
      'PostgreSQL',
      'Docker',
      'AWS',
    ],
    education: [
      {
        degree: 'M.S. in Data Science',
        school: 'UC San Diego',
        year: 2019,
      },
      {
        degree: 'B.S. in Statistics',
        school: 'UCLA',
        year: 2017,
      },
    ],
    experience: [
      {
        title: 'Machine Learning Engineer II',
        company: 'Stripe',
        location: 'San Francisco, CA',
        startDate: '2021-04',
        endDate: 'Present',
        highlights: [
          'Own fraud detection models processing $500B+ in annual transactions',
          'Reduced false positive rate by 30% while maintaining recall through model improvements',
          'Built real-time feature computation pipeline handling 10K+ events per second',
          'Collaborated with product managers to launch new merchant risk scoring product',
        ],
      },
      {
        title: 'Machine Learning Engineer',
        company: 'Plaid',
        location: 'San Francisco, CA',
        startDate: '2019-07',
        endDate: '2021-03',
        highlights: [
          'Developed transaction categorization model with 94% accuracy',
          'Implemented model monitoring and alerting infrastructure',
          'Reduced model inference latency from 200ms to 50ms through optimization',
        ],
      },
    ],
    resumeFile: 'marcus_johnson_resume.pdf',
  },
  {
    id: 'ml-003',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(408) 555-0167',
    location: 'San Jose, CA',
    currentRole: 'Senior Applied Scientist',
    currentCompany: 'Meta AI',
    yearsOfExperience: 7,
    linkedin: 'linkedin.com/in/emilyrodriguez-ai',
    fitLevel: 'strong',
    summary: 'Applied Scientist with deep expertise in computer vision and multimodal learning. Led teams shipping ML features to billions of users on Instagram and Facebook. Strong publication record and experience translating research into production systems.',
    skills: [
      'PyTorch',
      'Computer Vision',
      'Multimodal Learning',
      'Transformers',
      'CUDA',
      'C++',
      'Python',
      'Distributed Systems',
      'Model Compression',
    ],
    education: [
      {
        degree: 'Ph.D. in Electrical Engineering',
        school: 'MIT',
        year: 2017,
        focus: 'Computer Vision',
      },
      {
        degree: 'B.S. in Electrical Engineering',
        school: 'Georgia Tech',
        year: 2013,
      },
    ],
    experience: [
      {
        title: 'Senior Applied Scientist',
        company: 'Meta AI',
        location: 'Menlo Park, CA',
        startDate: '2020-01',
        endDate: 'Present',
        highlights: [
          'Led team of 6 engineers shipping visual search features to 2B+ Instagram users',
          'Developed multimodal content understanding system improving ad relevance by 18%',
          'Published 4 papers at top conferences (CVPR, NeurIPS) on efficient vision models',
          'Designed on-device ML pipeline reducing server costs by $10M annually',
        ],
      },
      {
        title: 'Applied Scientist',
        company: 'Amazon',
        location: 'Palo Alto, CA',
        startDate: '2017-08',
        endDate: '2019-12',
        highlights: [
          'Built visual similarity search for Amazon Shopping app',
          'Improved product image classification accuracy from 85% to 93%',
          'Created training data pipeline processing 100M+ images daily',
        ],
      },
    ],
    resumeFile: 'emily_rodriguez_resume.pdf',
  },
  {
    id: 'ml-004',
    name: 'David Park',
    email: 'david.park@email.com',
    phone: '(650) 555-0134',
    location: 'Palo Alto, CA',
    currentRole: 'Junior Machine Learning Engineer',
    currentCompany: 'Scale AI',
    yearsOfExperience: 2,
    linkedin: 'linkedin.com/in/davidpark-ml',
    fitLevel: 'weak',
    summary: 'Early-career ML Engineer passionate about AI. Currently working on data labeling infrastructure at Scale AI. Strong fundamentals but limited production ML experience. Eager to grow into more senior roles.',
    skills: ['Python', 'PyTorch', 'Scikit-learn', 'Pandas', 'SQL', 'Docker', 'Git'],
    education: [
      {
        degree: 'M.S. in Computer Science',
        school: 'Carnegie Mellon University',
        year: 2022,
        focus: 'Machine Learning',
      },
      {
        degree: 'B.S. in Computer Science',
        school: 'University of Washington',
        year: 2020,
      },
    ],
    experience: [
      {
        title: 'Junior Machine Learning Engineer',
        company: 'Scale AI',
        location: 'San Francisco, CA',
        startDate: '2022-06',
        endDate: 'Present',
        highlights: [
          'Building tools for data labeling quality assurance',
          'Implemented automated data validation pipelines',
          'Contributing to internal ML model evaluation framework',
          'Assisted senior engineers with model fine-tuning experiments',
        ],
      },
      {
        title: 'ML Research Intern',
        company: 'NVIDIA',
        location: 'Santa Clara, CA',
        startDate: '2021-05',
        endDate: '2021-08',
        highlights: [
          'Worked on neural architecture search for efficient inference',
          'Contributed to internal research tool development',
        ],
      },
    ],
    resumeFile: 'david_park_resume.pdf',
  },
  {
    id: 'ml-005',
    name: 'Jennifer Walsh',
    email: 'jennifer.walsh@email.com',
    phone: '(925) 555-0156',
    location: 'Walnut Creek, CA',
    currentRole: 'Data Scientist',
    currentCompany: 'Salesforce',
    yearsOfExperience: 4,
    linkedin: 'linkedin.com/in/jenniferwalsh',
    fitLevel: 'weak',
    summary: 'Data Scientist with analytics background transitioning toward ML engineering. Experience with traditional ML models but limited deep learning and production systems experience. Strong SQL and business intelligence skills.',
    skills: [
      'Python',
      'SQL',
      'Tableau',
      'Scikit-learn',
      'Pandas',
      'R',
      'A/B Testing',
      'Statistical Analysis',
    ],
    education: [
      {
        degree: 'M.S. in Statistics',
        school: 'UC Davis',
        year: 2020,
      },
      {
        degree: 'B.A. in Economics',
        school: 'University of Oregon',
        year: 2018,
      },
    ],
    experience: [
      {
        title: 'Data Scientist',
        company: 'Salesforce',
        location: 'San Francisco, CA',
        startDate: '2021-02',
        endDate: 'Present',
        highlights: [
          'Built customer churn prediction model using logistic regression and random forests',
          'Created dashboards tracking key product metrics for leadership',
          'Designed A/B testing framework for product experiments',
          'Collaborated with product team on feature prioritization using data insights',
        ],
      },
      {
        title: 'Business Analyst',
        company: 'Deloitte',
        location: 'San Francisco, CA',
        startDate: '2020-07',
        endDate: '2021-01',
        highlights: [
          'Conducted market analysis for tech clients',
          'Built financial models and forecasting tools',
          'Automated reporting workflows saving 10 hours weekly',
        ],
      },
    ],
    resumeFile: 'jennifer_walsh_resume.pdf',
  },
];

