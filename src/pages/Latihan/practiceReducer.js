// State mesin latihan (dipakai dengan useReducer). Murni JS tanpa JSX supaya bisa dites.
import { computeScore } from '../../lib/practice.js';

export const initialPracticeState = {
  view: 'list', // 'list' | 'chat' | 'result'
  scenario: null,
  stepIndex: 0,
  answers: [], // { stepIndex, optionIndex, safe }
  picked: null, // indeks opsi yang dipilih di langkah sekarang
  endedByRisk: false,
};

function startScenario(scenario) {
  return { ...initialPracticeState, view: 'chat', scenario };
}

function isLastStep(state) {
  return state.stepIndex === state.scenario.steps.length - 1;
}

export function practiceReducer(state, action) {
  switch (action.type) {
    case 'start':
      return action.scenario ? startScenario(action.scenario) : state;

    case 'pick': {
      // Pick kedua di langkah yang sama diabaikan.
      if (state.view !== 'chat' || state.picked !== null || state.endedByRisk) return state;
      const option = state.scenario.steps[state.stepIndex].options[action.optionIndex];
      if (!option) return state;
      return {
        ...state,
        picked: action.optionIndex,
        answers: [...state.answers, { stepIndex: state.stepIndex, optionIndex: action.optionIndex, safe: option.safe }],
        // Pilihan berisiko mengakhiri putaran.
        endedByRisk: !option.safe,
      };
    }

    case 'next':
      if (state.view !== 'chat' || state.picked === null || state.endedByRisk) return state;
      if (isLastStep(state)) return { ...state, view: 'result' };
      return { ...state, stepIndex: state.stepIndex + 1, picked: null };

    case 'finish': {
      if (state.view !== 'chat') return state;
      const canFinish = state.endedByRisk || (isLastStep(state) && state.picked !== null);
      return canFinish ? { ...state, view: 'result' } : state;
    }

    case 'retry':
      return state.scenario ? startScenario(state.scenario) : state;

    case 'exit':
      return initialPracticeState;

    default:
      return state;
  }
}

export function getSafeCount(state) {
  return state.answers.filter((answer) => answer.safe).length;
}

// Langkah yang belum dijawab dihitung tidak aman.
export function getScore(state) {
  return computeScore(getSafeCount(state), state.scenario?.steps.length ?? 0);
}

export function getMissedFlags(state) {
  return state.answers
    .filter((answer) => !answer.safe)
    .flatMap((answer) => state.scenario.steps[answer.stepIndex].missedFlags);
}
