export interface IInterview {
  id: string;
  position: string;
  difficulty: number;
  experience: "Положительный" | "Нейтральный" | "Негативный";
  outcome: "Offer" | "No offer" | "In progress";
  date: string;
  location: string;
  application: string;
  details: string;
  interviewQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface ISalary {
  id: string;
  position: string;
  amount: string;
  min: number;
  max: number;
  median: number;
  additionalPay: number;
  currency: string;
  experienceLevel: string;
}
