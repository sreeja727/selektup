// Frontend-only placeholder question bank. There is no backend for real
// question content yet — this cycles through a small pool of General
// Studies-style MCQs (with a correct answer + explanation) to fill out a
// full-length test, so scoring/review can work end-to-end until a real
// question bank endpoint exists.
const BASE_QUESTIONS = [
  {
    question: "Which of the following statements about the Indian Constitution is correct?",
    options: [
      "It was adopted on 26 January 1950.",
      "It was drafted by the British Parliament.",
      "It is the shortest constitution in the world.",
      "It came into force in 1947.",
    ],
    correctAnswer: "It was adopted on 26 January 1950.",
    explanation: "The Constitution was adopted on 26 November 1949 and came into force on 26 January 1950, celebrated as Republic Day.",
  },
  {
    question: "Who was the first President of India?",
    options: [
      "Dr. Rajendra Prasad",
      "Jawaharlal Nehru",
      "Dr. S. Radhakrishnan",
      "Zakir Hussain",
    ],
    correctAnswer: "Dr. Rajendra Prasad",
    explanation: "Dr. Rajendra Prasad served as the first President of India from 1950 to 1962.",
  },
  {
    question: "Which Schedule of the Constitution deals with the anti-defection law?",
    options: ["9th Schedule", "10th Schedule", "11th Schedule", "12th Schedule"],
    correctAnswer: "10th Schedule",
    explanation: "The 10th Schedule, added by the 52nd Amendment Act 1985, deals with disqualification on grounds of defection.",
  },
  {
    question: "The concept of 'Directive Principles of State Policy' was borrowed from which country's constitution?",
    options: ["USA", "UK", "Ireland", "Canada"],
    correctAnswer: "Ireland",
    explanation: "The Directive Principles were borrowed from the Irish Constitution.",
  },
  {
    question: "Who is known as the chief architect of the Indian Constitution?",
    options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
    correctAnswer: "Dr. B.R. Ambedkar",
    explanation: "Dr. B.R. Ambedkar chaired the Drafting Committee of the Constituent Assembly.",
  },
  {
    question: "How many Fundamental Duties are listed in the Constitution?",
    options: ["9", "10", "11", "12"],
    correctAnswer: "11",
    explanation: "There are 11 Fundamental Duties under Article 51A, the 11th added by the 86th Amendment Act, 2002.",
  },
  {
    question: "Which Part of the Constitution deals with Fundamental Rights?",
    options: ["Part II", "Part III", "Part IV", "Part V"],
    correctAnswer: "Part III",
    explanation: "Part III of the Constitution (Articles 12-35) deals with Fundamental Rights.",
  },
  {
    question: "The minimum age to become a member of the Lok Sabha is?",
    options: ["21 years", "25 years", "30 years", "35 years"],
    correctAnswer: "25 years",
    explanation: "A person must be at least 25 years old to be a member of the Lok Sabha.",
  },
  {
    question: "Which Article of the Constitution abolishes untouchability?",
    options: ["Article 15", "Article 16", "Article 17", "Article 18"],
    correctAnswer: "Article 17",
    explanation: "Article 17 abolishes untouchability and forbids its practice in any form.",
  },
  {
    question: "The Preamble of the Constitution was amended by which Amendment Act?",
    options: ["42nd Amendment", "44th Amendment", "52nd Amendment", "61st Amendment"],
    correctAnswer: "42nd Amendment",
    explanation: "The 42nd Amendment Act, 1976 added the words 'Socialist', 'Secular' and 'Integrity' to the Preamble.",
  },
  {
    question: "Which of these is NOT a Fundamental Right under the Indian Constitution?",
    options: ["Right to Equality", "Right to Property", "Right to Freedom", "Right against Exploitation"],
    correctAnswer: "Right to Property",
    explanation: "The Right to Property was removed from Fundamental Rights by the 44th Amendment Act, 1978, and made a legal right under Article 300A.",
  },
  {
    question: "The Election Commission of India was established in which year?",
    options: ["1947", "1950", "1952", "1962"],
    correctAnswer: "1950",
    explanation: "The Election Commission of India was established on 25 January 1950.",
  },
  {
    question: "Which body ratified the Constitution of India?",
    options: ["Parliament of India", "Constituent Assembly", "Supreme Court", "Rajya Sabha"],
    correctAnswer: "Constituent Assembly",
    explanation: "The Constituent Assembly adopted the Constitution on 26 November 1949.",
  },
  {
    question: "The 'Right to Education' was added as a Fundamental Right by which Amendment?",
    options: ["86th Amendment", "93rd Amendment", "97th Amendment", "101st Amendment"],
    correctAnswer: "86th Amendment",
    explanation: "The 86th Amendment Act, 2002 inserted Article 21A, making education a Fundamental Right for children aged 6-14.",
  },
  {
    question: "Who is the head of the Union Executive in India?",
    options: ["Prime Minister", "President", "Chief Justice", "Speaker of Lok Sabha"],
    correctAnswer: "President",
    explanation: "The President of India is the constitutional head of the Union Executive.",
  },
];

export function buildQuestionSet(count = 100) {
  return Array.from({ length: count }, (_, i) => ({
    ...BASE_QUESTIONS[i % BASE_QUESTIONS.length],
    id: i,
  }));
}
