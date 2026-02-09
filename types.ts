
export enum AppSlide {
  INTRO = 'INTRO',
  QUESTION = 'QUESTION',
  PROPOSAL = 'PROPOSAL',
  SUCCESS = 'SUCCESS'
}

export interface UserState {
  currentSlide: AppSlide;
  answerInput: string;
}
