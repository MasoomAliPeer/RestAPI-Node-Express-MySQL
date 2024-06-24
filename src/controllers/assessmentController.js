import dbConnection from "../database/dbConnection";
import { MESSAGES } from "../config/messages";
import * as assessmentQueries from "../queries/assessmentQueries";

export const getAssessmentType = async (req, res) => {
  try {
    const [results] = await dbConnection
      .promise()
      .query(assessmentQueries.getAssessmentType);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getDomainData = async (req, res) => {
  try {
    const [functionalDomains] = await dbConnection
      .promise()
      .query(assessmentQueries.getFunctionalDomain);

    const [cloudProviders] = await dbConnection
      .promise()
      .query(assessmentQueries.getCloudProvider);

    const [technicalDomains] = await dbConnection
      .promise()
      .query(assessmentQueries.getTechnicalDomain);

    res.status(200).json({
      functionalDomains,
      cloudProviders,
      technicalDomains,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

export const postAssessmentData = async (req, res) => {
  const {
    assessmentName,
    companyID,
    userID,
    assessmentTypeId,
    functionalDomainID,
    cloudProviderId,
    technicalDomainId,
  } = req.body;

  if (
    !assessmentName ||
    !companyID ||
    !userID ||
    !assessmentTypeId ||
    !functionalDomainID ||
    !cloudProviderId ||
    !technicalDomainId
  ) {
    return res.status(400).json(MESSAGES.FIELDS_CANNOT_BE_EMPTY);
  }

  try {
    const [results] = await dbConnection
      .promise()
      .query(assessmentQueries.postAssessmentData, [
        assessmentName,
        companyID,
        userID,
        assessmentTypeId,
        functionalDomainID,
        cloudProviderId,
        technicalDomainId,
      ]);

    res.status(201).json({
      status: MESSAGES.ANSWERS_ADDED_SUCCESSFULLY,
      AssessmentId: results.insertId,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const getQuestions = async (req, res) => {
  const { userId, assessmentTypeId } = req.body;

  if (!userId || !assessmentTypeId) {
    return res
      .status(400)
      .json(MESSAGES.BOTH_USERID_AND_ASSESSMENTTYPEID_REQUIRED);
  }

  try {
    const [results] = await dbConnection
      .promise()
      .query(assessmentQueries.getQuestions, [userId, assessmentTypeId]);

    const transformedResults = results[0].reduce((acc, current) => {
      const {
        SectionName,
        QuestionId,
        QuestionText,
        AnswerTypeName,
        AnswerTypeId,
        QuestionWeightage,
      } = current;

      let section = acc.find((section) => section.title === SectionName);
      if (!section) {
        section = { title: SectionName, questions: [] };
        acc.push(section);
      }

      section.questions.push({
        questionCode: QuestionId.toString(),
        questionText: QuestionText,
        answerType: AnswerTypeName,
        weightage: QuestionWeightage,
        answerTypeID: AnswerTypeId,
      });

      return acc;
    }, []);

    if (transformedResults.length === 0) {
      return res.status(404).json(MESSAGES.NO_DATA_AVAILABLE);
    }

    res.status(200).json(transformedResults);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

export const addAnswer = async (req, res) => {
  try {
    const { assessmentId, questions } = req.body;

    if (!assessmentId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: MESSAGES.INVALID_REQUEST_BODY });
    }

    // Validate and insert answers
    const result = await addAnswers(assessmentId, questions);

    // Send success response
    res.status(201).json({
      message: MESSAGES.ANSWERS_ADDED_SUCCESSFULLY,
      result,
    });
  } catch (error) {
    console.error("Error adding answers:", error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const addAnswers = async (AssessmentId, questions) => {
  try {
    const values = questions.map(
      ({ questionCode, value, answerTypeID, Comments = "" }) => [
        AssessmentId,
        questionCode,
        answerTypeID,
        value,
        Comments,
      ]
    );

    const [result] = await dbConnection
      .promise()
      .query(assessmentQueries.postResponseData, [values]);

    return result.insertId;
  } catch (error) {
    console.error("Error adding answers in service:", error);
    throw error;
  }
};

export const getAssessmentSummary = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json(MESSAGES.FIELDS_CANNOT_BE_EMPTY);
  }

  try {
    const [results] = await dbConnection
      .promise()
      .query(assessmentQueries.getAssessmentSummary, [userId]);

    res.status(201).json({
      status: MESSAGES.FETCH_SUCCESSFULLY,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
