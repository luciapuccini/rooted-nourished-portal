import { format } from 'date-fns'
import { FileText, CheckCircle } from 'lucide-react'
import { DEMO_FORM } from '@/lib/demo'

export default function DemoForms() {
  const formData = JSON.parse(DEMO_FORM.data)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>Forms</h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          Your submitted health history and intake forms
        </p>
      </div>

      <div className="rounded-xl p-5 mb-6 flex items-center gap-4"
        style={{ background: '#e8f5ee', border: '1px solid #c5e0d0' }}>
        <CheckCircle size={22} color="#3d6b4f" />
        <div>
          <p className="font-medium text-sm" style={{ color: '#2d5a3d' }}>Intake form submitted</p>
          <p className="text-xs" style={{ color: '#4a7a5a' }}>
            Submitted {format(DEMO_FORM.submittedAt, 'MMMM d, yyyy')} · Sophia has reviewed your information
          </p>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e0d8cc' }}>
        <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#3d6b4f' }}>
          <FileText size={18} color="#fff" />
          <h2 className="font-semibold text-white">New Client Intake Form</h2>
        </div>

        <div className="p-6 space-y-6" style={{ background: '#ffffff' }}>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8a8a7a' }}>
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Date of Birth', formData.dob],
                ['Gender', formData.gender],
                ['Height', formData.height],
                ['Weight', formData.weight],
                ['Occupation', formData.occupation],
                ['How did you hear about us?', formData.referral],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg p-3" style={{ background: '#faf7f2' }}>
                  <p className="text-xs" style={{ color: '#8a8a7a' }}>{label}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: '#2c2c2c' }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8a8a7a' }}>
              Health History
            </h3>
            <div className="space-y-3">
              {[
                ['Current Diagnoses', formData.diagnoses],
                ['Medications / Supplements', formData.medications],
                ['Surgeries / Procedures', formData.surgeries],
                ['Family Health History', formData.familyHistory],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg p-3" style={{ background: '#faf7f2' }}>
                  <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>{label}</p>
                  <p className="text-sm" style={{ color: '#2c2c2c' }}>{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8a8a7a' }}>
              Current Symptoms
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.currentSymptoms.map((s: string) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: '#f5ebe0', color: '#c17a4a', border: '1px solid #e0d8cc' }}>
                  {s}
                </span>
              ))}
            </div>
            <div className="rounded-lg p-3" style={{ background: '#faf7f2' }}>
              <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>Most challenging symptom</p>
              <p className="text-sm" style={{ color: '#2c2c2c' }}>{formData.worstSymptom}</p>
            </div>
            <div className="rounded-lg p-3 mt-2" style={{ background: '#faf7f2' }}>
              <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>How long have you had these symptoms?</p>
              <p className="text-sm" style={{ color: '#2c2c2c' }}>{formData.symptomDuration}</p>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8a8a7a' }}>
              Diet & Lifestyle
            </h3>
            <div className="space-y-3">
              <div className="rounded-lg p-3" style={{ background: '#faf7f2' }}>
                <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>Typical daily diet</p>
                <p className="text-sm" style={{ color: '#2c2c2c' }}>{formData.typicalDiet}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Water intake (glasses/day)', formData.waterIntake],
                  ['Exercise frequency', formData.exerciseFrequency],
                  ['Sleep quality', formData.sleepQuality],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg p-3" style={{ background: '#faf7f2' }}>
                    <p className="text-xs" style={{ color: '#8a8a7a' }}>{label}</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: '#2c2c2c' }}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg p-3" style={{ background: '#faf7f2' }}>
                <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>Current stress level (1–10)</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: '#e0d8cc' }}>
                    <div className="h-2 rounded-full" style={{ background: '#ef4444', width: `${(Number(formData.stressLevel)/10)*100}%` }} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: '#ef4444' }}>{formData.stressLevel}/10</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#8a8a7a' }}>
              Goals & Expectations
            </h3>
            <div className="space-y-3">
              {[
                ['Health goals', formData.healthGoals],
                ['What does success look like for you?', formData.successVision],
                ['Potential barriers', formData.barriers],
                ['Anything else you\'d like Sophia to know?', formData.additionalNotes],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg p-3" style={{ background: '#faf7f2' }}>
                  <p className="text-xs mb-1" style={{ color: '#8a8a7a' }}>{label}</p>
                  <p className="text-sm" style={{ color: '#2c2c2c' }}>{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
