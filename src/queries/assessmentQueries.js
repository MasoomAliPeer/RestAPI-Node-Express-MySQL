export const getAssessmentType = `SELECT AssessmentTypeId, Name FROM assessmenttype`;

export const getQuestions = `CALL usp_get_section_question_details_by_user_id(?, ?)`;

export const getFunctionalDomain = `SELECT DISTINCT FunctionalDomainId, Name AS FunctionalDomainName  FROM FunctionalDomain`;

export const getCloudProvider = `SELECT DISTINCT CloudProviderId, Name AS CloudProviderName FROM CloudProvider`;

export const getTechnicalDomain = `SELECT DISTINCT TechnicalDomainId, Name AS TechnicalDomainName FROM TechnicalDomain`;

export const postAssessmentData = `INSERT INTO assessment ( AssessmentName, CompanyId, UserId, AssessmentTypeId, FunctionalDomainId, CloudProviderId, TechnicalDomainId) VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
