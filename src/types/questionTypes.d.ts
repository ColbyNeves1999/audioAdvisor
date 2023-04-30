type ArrayData = {
    songID: string;
  };
  
  type SongArrayRetrieval = {
    Song: ArrayData;
  };
  
  type QuestionNumberParam = {
    questionNumber: string;
    functionArray: [SongArrayRetrieval];
  };
  
  type QuestionsCorrectParam = {
    questionsCorrect: number;
  };
  