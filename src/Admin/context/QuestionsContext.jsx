import { createContext, useContext, useState } from "react";

const seedQuestions = [
  {
    id: 1,
    categorySlug: "degree-mains",
    mockTestNumber: 1,
    difficulty: "Medium",
    text: "Which Article of the Indian Constitution deals with the Right to Equality?",
    options: ["Article 14", "Article 19", "Article 21", "Article 32"],
    correctIndex: 0,
    explanation: "Article 14 guarantees equality before the law and equal protection of the laws.",
  },
  {
    id: 2,
    categorySlug: "ktet-psychology",
    mockTestNumber: 1,
    difficulty: "Easy",
    text: "Who proposed the theory of Multiple Intelligences?",
    options: ["Jean Piaget", "Howard Gardner", "Lev Vygotsky", "B.F. Skinner"],
    correctIndex: 1,
    explanation: "Howard Gardner proposed the theory of Multiple Intelligences in 1983.",
  },
];

const QuestionsContext = createContext(null);

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState(seedQuestions);

  const addQuestion = (question) => {
    setQuestions((prev) => [
      ...prev,
      { ...question, id: prev.length ? Math.max(...prev.map((q) => q.id)) + 1 : 1 },
    ]);
  };

  const updateQuestion = (id, updates) => {
    setQuestions((prev) => prev.map((q) => (String(q.id) === String(id) ? { ...q, ...updates } : q)));
  };

  const deleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => String(q.id) !== String(id)));
  };

  const getQuestion = (id) => questions.find((q) => String(q.id) === String(id));

  return (
    <QuestionsContext.Provider
      value={{ questions, addQuestion, updateQuestion, deleteQuestion, getQuestion }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useQuestions() {
  const ctx = useContext(QuestionsContext);
  if (!ctx) throw new Error("useQuestions must be used within a QuestionsProvider");
  return ctx;
}
