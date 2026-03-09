/* eslint-disable react-hooks/set-state-in-effect */
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Globe2, GraduationCap, Languages, Loader2, School, Target } from 'lucide-react'
import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/auth-context'
import { useLearningProfile } from '../contexts/learning-profile-context'
import type { GoalType } from '../lib/api'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'

const goalIcons = {
  school_learning: School,
  college_courses: GraduationCap,
  competitive_exams: Target,
  language_learning: Languages,
  skill_learning: Brain,
  general_knowledge: Globe2,
} satisfies Record<GoalType, ComponentType<{ className?: string }>>

const degreeTypes = ['Bachelor of Science', 'Bachelor of Technology', 'Bachelor of Commerce', 'Master Degree']
const selectClassName =
  'h-12 w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:bg-white/10'
const selectStyle = { colorScheme: 'dark' as const }
const optionClassName = 'bg-slate-950 text-white'

export function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { onboardingOptions, profile, saveProfile, isLoading } = useLearningProfile()

  const [goalType, setGoalType] = useState<GoalType>('competitive_exams')
  const [examName, setExamName] = useState('')
  const [schoolGrade, setSchoolGrade] = useState('10')
  const [degreeType, setDegreeType] = useState(degreeTypes[0])
  const [majorSubject, setMajorSubject] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [language, setLanguage] = useState('Spanish')
  const [skillTrack, setSkillTrack] = useState('Programming')
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [studyHours, setStudyHours] = useState('3')
  const [error, setError] = useState('')
  const goalUsesSubjects =
    goalType === 'school_learning' || goalType === 'competitive_exams' || goalType === 'general_knowledge'

  useEffect(() => {
    if (!profile) return
    setGoalType(profile.goal_type)
    setExamName(profile.exam_name ?? '')
    setSchoolGrade(profile.school_grade ? String(profile.school_grade) : '10')
    setDegreeType(profile.degree_type ?? degreeTypes[0])
    setMajorSubject(profile.major_subject ?? '')
    setSubjects(profile.subjects ?? [])
    setLanguage(profile.language ?? 'Spanish')
    setSkillTrack(profile.skill_track ?? 'Programming')
    setSkillLevel((profile.skill_level as 'beginner' | 'intermediate' | 'advanced' | null) ?? 'intermediate')
    setStudyHours(String(profile.study_hours ?? 3))
  }, [profile])

  useEffect(() => {
    if (!goalUsesSubjects && subjects.length > 0) {
      setSubjects([])
    }
    if (goalType !== 'competitive_exams' && examName) {
      setExamName('')
    }
    if (goalType !== 'college_courses') {
      if (majorSubject) setMajorSubject('')
      if (degreeType !== degreeTypes[0]) setDegreeType(degreeTypes[0])
    }
    if (goalType !== 'language_learning' && language !== 'Spanish') {
      setLanguage('Spanish')
    }
    if (goalType !== 'skill_learning' && skillTrack !== 'Programming') {
      setSkillTrack('Programming')
    }
  }, [degreeType, examName, goalType, goalUsesSubjects, language, majorSubject, skillTrack, subjects.length])

  const subjectChoices = useMemo(() => {
    if (!onboardingOptions) return []
    if (goalType === 'school_learning') return onboardingOptions.school_subjects
    if (goalType === 'competitive_exams' && examName === 'JEE Main') return ['Physics', 'Chemistry', 'Mathematics']
    if (goalType === 'competitive_exams' && examName === 'NEET') return ['Biology', 'Physics', 'Chemistry']
    if (goalType === 'competitive_exams' && examName === 'GATE') return ['Core Subject', 'Aptitude', 'Mathematics']
    if (goalType === 'competitive_exams') return ['Polity', 'History', 'Economics', 'Geography', 'Current Affairs']
    if (goalType === 'college_courses') return onboardingOptions.college_majors
    if (goalType === 'skill_learning') return onboardingOptions.skill_tracks
    if (goalType === 'general_knowledge') return ['Science', 'Technology', 'History', 'Current Affairs', 'Culture']
    return []
  }, [examName, goalType, onboardingOptions])

  const toggleSubject = (value: string) => {
    setSubjects((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value].slice(0, 6),
    )
  }

  const handleSubmit = async () => {
    setError('')
    if (goalType === 'competitive_exams' && !examName) {
      setError('Select an exam to continue.')
      return
    }
    if (goalType === 'school_learning' && subjects.length === 0) {
      setError('Choose at least one school subject.')
      return
    }
    if (goalType === 'college_courses' && !majorSubject.trim()) {
      setError('Enter your major subject.')
      return
    }
    if (goalType === 'language_learning' && !language) {
      setError('Choose a language to learn.')
      return
    }
    if (goalType === 'skill_learning' && !skillTrack) {
      setError('Choose a skill track.')
      return
    }

    await saveProfile({
      goal_type: goalType,
      exam_name: goalType === 'competitive_exams' ? examName : null,
      school_grade: goalType === 'school_learning' ? Number(schoolGrade) : null,
      degree_type: goalType === 'college_courses' ? degreeType : null,
      major_subject: goalType === 'college_courses' ? majorSubject.trim() : null,
      subjects: goalUsesSubjects ? subjects : [],
      language: goalType === 'language_learning' ? language : null,
      skill_track: goalType === 'skill_learning' ? skillTrack : null,
      skill_level: skillLevel,
      study_hours: Number(studyHours),
      preferences: {
        onboarding_version: '2026-03',
        source_strategy: 'open_education_plus_gemini',
      },
    })

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-hero-gradient px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden rounded-[2rem] p-8"
        >
          <span className="premium-pill">Personalized onboarding</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white">
            Set NeuroPrep up for <span className="text-gradient">your exact learning goal</span>.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            After this step, the dashboard, study planner, AI study companion, and recommended resources
            shift to your exam, course, language, or skill track automatically.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Logged in as</p>
              <p className="mt-3 text-xl font-semibold text-white">{user?.name ?? user?.username ?? 'Student'}</p>
              <p className="mt-2 text-sm text-slate-400">{user?.email}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">What changes after this</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>AI companion daily brief becomes goal-specific</li>
                <li>Planner and dashboard modules adapt automatically</li>
                <li>Open educational sources load for your selected topics</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <CardTitle className="text-2xl text-white">What are you using NeuroPrep for?</CardTitle>
            <CardDescription className="mt-2 text-slate-400">
              Choose one path. The platform will load the right modules, content sources, and AI guidance.
            </CardDescription>

            {!onboardingOptions ? (
              <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                Loading onboarding options...
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {onboardingOptions.goals.map((goal) => {
                  const isActive = goalType === goal.value
                  const Icon = goalIcons[goal.value as GoalType]
                  return (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => setGoalType(goal.value as GoalType)}
                      className={`rounded-[1.4rem] border p-4 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-2xl border border-white/10 bg-white/5 p-2.5 text-cyan-200">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-white">{goal.label}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">{goal.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {goalType === 'competitive_exams' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Exam</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={examName}
                      onChange={(event) => setExamName(event.target.value)}
                    >
                      <option className={optionClassName} value="">Select exam</option>
                      {onboardingOptions?.competitive_exams.map((exam) => (
                        <option className={optionClassName} key={exam} value={exam}>
                          {exam}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Daily study hours</label>
                    <Input value={studyHours} onChange={(event) => setStudyHours(event.target.value)} type="number" min="1" max="16" />
                  </div>
                </>
              )}

              {goalType === 'school_learning' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Grade level</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={schoolGrade}
                      onChange={(event) => setSchoolGrade(event.target.value)}
                    >
                      {Array.from({ length: 7 }, (_, index) => 6 + index).map((grade) => (
                        <option className={optionClassName} key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Daily study hours</label>
                    <Input value={studyHours} onChange={(event) => setStudyHours(event.target.value)} type="number" min="1" max="16" />
                  </div>
                </>
              )}

              {goalType === 'college_courses' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Degree type</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={degreeType}
                      onChange={(event) => setDegreeType(event.target.value)}
                    >
                      {degreeTypes.map((degree) => (
                        <option className={optionClassName} key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Major subject</label>
                    <Input
                      placeholder="Computer Science, Electronics, Business..."
                      value={majorSubject}
                      onChange={(event) => setMajorSubject(event.target.value)}
                    />
                  </div>
                </>
              )}

              {goalType === 'language_learning' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Language to learn</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={language}
                      onChange={(event) => setLanguage(event.target.value)}
                    >
                      {onboardingOptions?.languages.map((entry) => (
                        <option className={optionClassName} key={entry} value={entry}>
                          {entry}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Current skill level</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={skillLevel}
                      onChange={(event) => setSkillLevel(event.target.value as typeof skillLevel)}
                    >
                      {onboardingOptions?.skill_levels.map((level) => (
                        <option className={optionClassName} key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {goalType === 'skill_learning' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Skill track</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={skillTrack}
                      onChange={(event) => setSkillTrack(event.target.value)}
                    >
                      {onboardingOptions?.skill_tracks.map((track) => (
                        <option className={optionClassName} key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Current level</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={skillLevel}
                      onChange={(event) => setSkillLevel(event.target.value as typeof skillLevel)}
                    >
                      {onboardingOptions?.skill_levels.map((level) => (
                        <option className={optionClassName} key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {goalType === 'general_knowledge' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Focus level</label>
                    <select
                      className={selectClassName}
                      style={selectStyle}
                      value={skillLevel}
                      onChange={(event) => setSkillLevel(event.target.value as typeof skillLevel)}
                    >
                      {onboardingOptions?.skill_levels.map((level) => (
                        <option className={optionClassName} key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Daily study hours</label>
                    <Input value={studyHours} onChange={(event) => setStudyHours(event.target.value)} type="number" min="1" max="16" />
                  </div>
                </>
              )}
            </div>

            {subjectChoices.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-white">Pick your main focus areas</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {subjectChoices.map((item) => {
                    const active = subjects.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSubject(item)}
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          active
                            ? 'border border-cyan-300/20 bg-cyan-300/10 text-cyan-100'
                            : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">What the AI will do next</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <li>Build a learning roadmap aligned to your goal</li>
                <li>Load materials from Khan Academy, MIT OCW, OpenStax, and Wikipedia</li>
                <li>Generate Gemini notes if structured content is unavailable</li>
                <li>Adapt the dashboard, study planner, and AI companion automatically</li>
              </ul>
            </div>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={() => void handleSubmit()} className="gap-2" disabled={isLoading || !onboardingOptions}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Save onboarding and enter dashboard
              </Button>
              <Button variant="secondary" onClick={() => navigate('/')}>
                Back to landing
              </Button>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
