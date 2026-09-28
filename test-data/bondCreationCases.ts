export type BondCreationCase = {
  id: string;
  title: string;
  priority: 'High' | 'Critical' | 'Medium';
};

/** Selected high-value Bond Creation cases, with titles and priorities from the workbook. */
export const bondCreationHighValueCases: BondCreationCase[] = [
  { id: 'TC-019', title: 'Start a new bond', priority: 'High' },
  { id: 'TC-020', title: 'Search and select an agency', priority: 'High' },
  { id: 'TC-021', title: 'Select agency directly from dropdown', priority: 'Medium' },
  { id: 'TC-023', title: 'Select available bond from All Bond Forms', priority: 'High' },
  { id: 'TC-024', title: 'Verify selected bond header information', priority: 'High' },
  { id: 'TC-025', title: 'Find and select an existing principal', priority: 'High' },
  { id: 'TC-026', title: 'Enter bond amount at minimum boundary', priority: 'High' },
  { id: 'TC-027', title: 'Enter bond amount below minimum', priority: 'High' },
  { id: 'TC-028', title: 'Enter bond amount at maximum boundary', priority: 'Critical' },
  { id: 'TC-029', title: 'Enter bond amount above maximum', priority: 'Critical' },
  { id: 'TC-040', title: 'Verify optional License and Permit fields can remain blank', priority: 'Medium' },
  { id: 'TC-041', title: 'Select Contractor Insurance, Business Structure and State of Incorporation', priority: 'Medium' },
  { id: 'TC-043', title: 'Verify Modifier Value boundary values', priority: 'High' },
  { id: 'TC-044', title: 'Complete team assignment, notes and submit bond', priority: 'Critical' },
  { id: 'TC-045', title: 'Verify bond lifecycle through Submit and Cancel paths', priority: 'Critical' },
];
