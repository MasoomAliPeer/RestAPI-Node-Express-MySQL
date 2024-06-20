export const getSectionQuestionsByUserId = `
  CALL usp_get_section_question_details_by_user_id(?, ?)
`;

export const getAllCompanies = `
  SELECT CompanyId, Name 
  FROM company
`;

export const getAllAssessmentTypes = `
  SELECT AssessmentTypeId, Name 
  FROM assessmenttype
`;
