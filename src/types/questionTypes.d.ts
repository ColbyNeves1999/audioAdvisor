type ArrayData = {
    songID: string;
  };
  
  type SongArrayRetrieval = {
    Song: ArrayData;
  };
  
  type QuestionNumberParam = {
    questionNumber: string;
    functionArray: [SongArrayRetrieval];
    updateQuestion: string;
  };
  
  type QuestionsCorrectParam = {
    questionsCorrect: number;
  };