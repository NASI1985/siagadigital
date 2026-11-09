import { useEffect, useReducer } from 'react';
import { SCENARIOS } from '../../data/scenarios.js';
import { mergeBestScore } from '../../lib/practice.js';
import { STORAGE_KEYS, isScoreMap } from '../../lib/storage.js';
import { usePersistedState } from '../../hooks/usePersistedState.js';
import { usePageFocus } from '../../hooks/usePageFocus.js';
import { practiceReducer, initialPracticeState, getScore } from './practiceReducer.js';
import ScenarioList from './ScenarioList.jsx';
import ChatPanel from './ChatPanel.jsx';
import ReplyPanel from './ReplyPanel.jsx';
import RiskyFeedback from './RiskyFeedback.jsx';
import FinalResult from './FinalResult.jsx';

export default function Latihan() {
  const [state, dispatch] = useReducer(practiceReducer, initialPracticeState);
  const [scores, setScores] = usePersistedState(STORAGE_KEYS.practiceScores, {}, isScoreMap);
  const { view, scenario, stepIndex, endedByRisk } = state;
  usePageFocus(`${view}-${scenario?.id}-${stepIndex}-${endedByRisk}`);

  // Simpan skor terbaik saat hasil akhir dibuka.
  const finalScore = view === 'result' ? getScore(state) : null;
  useEffect(() => {
    if (finalScore === null || !scenario) return;
    setScores((previous) => mergeBestScore(previous, scenario.id, finalScore));
  }, [finalScore, scenario, setScores]);

  if (view === 'list' || !scenario) {
    return (
      <ScenarioList
        scenarios={SCENARIOS}
        scores={scores}
        onStart={(selected) => dispatch({ type: 'start', scenario: selected })}
      />
    );
  }

  if (view === 'result') {
    return <FinalResult state={state} scores={scores} onExit={() => dispatch({ type: 'exit' })} />;
  }

  const scenarioNumber = SCENARIOS.findIndex((item) => item.id === scenario.id) + 1;
  return (
    <div className="grid gap-8 two:grid-cols-2">
      <ChatPanel state={state} scenarioNumber={scenarioNumber} totalScenarios={SCENARIOS.length} />
      {endedByRisk ? (
        <RiskyFeedback
          step={scenario.steps[stepIndex]}
          onRetry={() => dispatch({ type: 'retry' })}
          onFinish={() => dispatch({ type: 'finish' })}
        />
      ) : (
        <ReplyPanel
          state={state}
          onPick={(optionIndex) => dispatch({ type: 'pick', optionIndex })}
          onNext={() => dispatch({ type: 'next' })}
          onExit={() => dispatch({ type: 'exit' })}
        />
      )}
    </div>
  );
}
