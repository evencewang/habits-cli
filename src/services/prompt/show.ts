import { inquirer } from "./inquirer";

const prompt = inquirer.createPromptModule();

export const show = <T>(
  questions: inquirer.QuestionCollection<T>,
  initialAnswers?: Partial<T>
) => {
  return prompt<T>(questions, initialAnswers);
};