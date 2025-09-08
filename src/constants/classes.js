/**
 * Class Constants
 * Defines all available classes with their codes and names
 */

export const CLASS_OPTIONS = [
  { code: 'LOP_1', name: 'Lớp 1' },
  { code: 'LOP_2', name: 'Lớp 2' },
  { code: 'LOP_3', name: 'Lớp 3' },
  { code: 'LOP_4', name: 'Lớp 4' },
  { code: 'LOP_5', name: 'Lớp 5' },
  { code: 'LOP_6', name: 'Lớp 6' },
  { code: 'LOP_7', name: 'Lớp 7' },
  { code: 'LOP_8', name: 'Lớp 8' },
  { code: 'LOP_9', name: 'Lớp 9' },
  { code: 'LOP_10', name: 'Lớp 10' },
  { code: 'LOP_11', name: 'Lớp 11' },
  { code: 'LOP_12', name: 'Lớp 12' },
  
  // Specialized classes
  { code: 'LOP_10A1', name: 'Lớp 10A1' },
  { code: 'LOP_10A2', name: 'Lớp 10A2' },
  { code: 'LOP_11A1', name: 'Lớp 11A1' },
  { code: 'LOP_11A2', name: 'Lớp 11A2' },
  { code: 'LOP_12A1', name: 'Lớp 12A1' },
  { code: 'LOP_12A2', name: 'Lớp 12A2' },
];

// Helper functions
export const getClassByCode = (code) => {
  return CLASS_OPTIONS.find(cls => cls.code === code);
};

export const getClassesByCodes = (codes) => {
  if (!Array.isArray(codes)) return [];
  return codes.map(code => getClassByCode(code)).filter(Boolean);
};

export const getClassNameByCode = (code) => {
  const classItem = getClassByCode(code);
  return classItem ? classItem.name : code;
};

// Group classes by level for easier selection
export const getGroupedClasses = () => {
  return {
    elementary: CLASS_OPTIONS.filter(cls => /^LOP_[1-5]$/.test(cls.code)),
    secondary: CLASS_OPTIONS.filter(cls => /^LOP_[6-9]$/.test(cls.code)),
    highSchool: CLASS_OPTIONS.filter(cls => /^LOP_1[0-2]$/.test(cls.code)),
    specialized: CLASS_OPTIONS.filter(cls => /^LOP_\d+[A-Z]\d*$/.test(cls.code)),
  };
};
