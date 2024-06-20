export const getAssessmentType = `SELECT AssessmentTypeId, Name FROM assessmenttype`;

export const getQuestions = `CALL usp_get_section_question_details_by_user_id(?, ?)`;
