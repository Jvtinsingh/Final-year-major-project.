export const MOCK_USERS = {
  'admin@academetrics.io': {
    uid: 'mock-admin-uid',
    email: 'admin@academetrics.io',
    role: 'admin',
    displayName: 'System Administrator',
    status: 'active',
  },
  'faculty@academetrics.io': {
    uid: 'mock-faculty-uid',
    email: 'faculty@academetrics.io',
    role: 'faculty',
    displayName: 'Dr. Sarah Smith',
    status: 'active',
  },
  'student@academetrics.io': {
    uid: 'mock-student-uid',
    email: 'student@academetrics.io',
    role: 'student',
    displayName: 'John Doe',
    status: 'active',
  },
};

export const MOCK_COURSES = [
  { id: '1', name: 'Introduction to Computer Science', code: 'CS101', students: 120, status: 'Active' },
  { id: '2', name: 'Advanced Mathematics', code: 'MATH301', students: 45, status: 'Active' },
  { id: '3', name: 'Digital Marketing Essentials', code: 'MKT202', students: 85, status: 'Archived' },
];

export const MOCK_STATS = {
  totalStudents: 1240,
  activeExams: 12,
  avgScore: 78.5,
  passingRate: 92,
};
