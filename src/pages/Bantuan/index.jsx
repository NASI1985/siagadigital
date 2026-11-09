import { useState } from 'react';
import { buildActionPlan } from '../../lib/emergency.js';
import { useToast } from '../../components/Toast.jsx';
import { usePageFocus } from '../../hooks/usePageFocus.js';
import IncidentWizard from './IncidentWizard.jsx';
import ActionPlan from './ActionPlan.jsx';
import WarningMessage from './WarningMessage.jsx';
import ReadinessChecklist from './ReadinessChecklist.jsx';

// `intent` datang dari "Aku sudah transfer": kejadian sudah terpilih, platform belum.
export default function Bantuan({ intent }) {
  const [incidentId, setIncidentId] = useState(intent?.incidentId ?? null);
  const [platformId, setPlatformId] = useState(null);
  const [isPlanVisible, setPlanVisible] = useState(false);
  const showToast = useToast();
  usePageFocus(isPlanVisible);

  const plan = isPlanVisible ? buildActionPlan(incidentId, platformId) : null;

  const handleShowPlan = () => {
    if (!incidentId || !platformId) {
      showToast('Jawab kedua pertanyaan dulu ya');
      return;
    }
    setPlanVisible(true);
  };

  return (
    <div className="space-y-8">
      {plan ? (
        <div className="grid gap-8 two:grid-cols-2">
          <ActionPlan key={`${incidentId}-${platformId}`} plan={plan} onEditAnswers={() => setPlanVisible(false)} />
          <WarningMessage incidentId={incidentId} />
        </div>
      ) : (
        <IncidentWizard
          incidentId={incidentId}
          platformId={platformId}
          onIncidentChange={setIncidentId}
          onPlatformChange={setPlatformId}
          onSubmit={handleShowPlan}
        />
      )}
      <ReadinessChecklist />
    </div>
  );
}
