import dbConnection from "../database/dbConnection";
import { MESSAGES } from "../config/messages";
import * as answerService from "../services/answerService";
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

//ADD Answers try this afterwards : :
export const addAnswer = async (req, res) => {
  try {
    const answersArray = req.body;

    // Validate input (for illustration purposes)
    if (!Array.isArray(answersArray) || answersArray.length === 0) {
      return res.status(400).json(MESSAGES.INVALID_REQUEST_BODY);
    }

    // Process each section (answers) in the array
    const results = [];
    for (let i = 0; i < answersArray.length; i++) {
      const { title, questions, userId, assessmentTypeID } = answersArray[i];

      // Call service to process answers for each section
      const result = await answerService.addAnswers(
        questions,
        userId,
        assessmentTypeID
      );
      results.push({ title, result }); // Store results for each section
    }

    // Send success response
    res.status(201).json({
      message: MESSAGES.ANSWERS_ADDED_SUCCESSFULLY,
      results,
    });
  } catch (error) {
    console.error("Error adding answers:", error);
    res.status(500).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};
