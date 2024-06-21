import dbConnection from "../database/dbConnection";
import { MESSAGES } from "../config/messages";

// Function to add answers to the database for a specific section
export const addAnswers = async (questions, userId, assessmentTypeID) => {
  try {
    // Validate input
    if (
      !Array.isArray(questions) ||
      questions.length === 0 ||
      !userId ||
      !assessmentTypeID
    ) {
      throw new Error(MESSAGES.INVALID_ANSWERS_FORMAT); // Adjust error message as per your MESSAGES config
    }

    // Example: Loop through questions and insert into database
    const insertPromises = questions.map(async (question) => {
      const { questionCode, value, answerTypeID } = question;

      // Perform database insertion
      const [result] = await dbConnection
        .promise()
        .query(
          "INSERT INTO response ( AssessmentId, QuestionId, AnswerTypeId, ResponseValue, Comments) VALUES ( ?, ?, ?, ?, ?)",
          [assessmentID,  assessmentTypeID, questionCode, answerTypeID, value]
        );

      return result.insertId; // Return the ID of the inserted record if needed
    });

    // Wait for all insertions to complete
    const insertedIds = await Promise.all(insertPromises);

    return insertedIds; // Return array of inserted IDs or any other relevant data
  } catch (error) {
    console.error("Error adding answers in service:", error);
    throw error; // Propagate the error back to the controller
  }
};
