import {flushSync} from 'react-dom';
import {registerAtlasTools} from './agent-tools';
import {useEffect,useMemo,useRef,useState} from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  FileText,
  Focus,
  GitFork,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Info,
  Layers3,
  Lightbulb,
  MapPin,
  Maximize2,
  Network,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Scissors,
  Search,
  Share2,
  ShieldAlert,
  Stethoscope,
  Trophy,
  Undo2,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import AnatomyScene from './scene';
import {
  DEFAULT_VISIBLE,
  SYSTEMS,
  EXPLANATIONS,
  explanation,
  type Atlas,
  type Concept,
  type SceneState,
  type SystemId,
  type View
} from './anatomy';
import {findKnowledgeForConcept} from './knowledge';
import {GUIDED_EXPLORATIONS, type GuidedExploration} from './guides';
import {
  QUESTION_BANK,
  filterQuestions,
  isSelectionMatchingTarget,
  type LearningQuestion,
  type LearningSessionConfig,
  type UserAnswerRecord
} from './learning';
import {
  DISSECTION_PRESETS,
  DISSECTION_LAYERS,
  INITIAL_CLIPPING_STATE,
  type ClippingState,
  type ClippingOrientation,
  type DissectionPreset,
  type ProgressiveLayer
} from './dissection';
import {
  VERIFIED_RELATIONSHIPS,
  RELATIONSHIP_CATEGORY_LABELS,
  RELATIONSHIP_TYPE_LABELS,
  getRelationshipsForConcept,
  hasRelationshipsForConcept,
  buildRelationshipGraph,
  type AnatomicalRelationship,
  type RelationshipCategory,
  type AnatomicalRelationshipType,
  type RelationshipGraphNode,
  type RelationshipGraphEdge,
  type RelationshipGraphData
} from './relationships';

const initial: SceneState = {
  explode: 0,
  visible: DEFAULT_VISIBLE,
  selected: [],
  isolate: false,
  view: 'three-quarter',
  rotate: false,
  reset: 0
};

export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [state, setState] = useState<SceneState>(initial);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [about, setAbout] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [chosen, setChosen] = useState<Concept | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'anatomy' | 'function' | 'clinical' | 'relationships'>('overview');
  const [guidesOpen, setGuidesOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState<GuidedExploration | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeGuideRef = useRef<GuidedExploration | null>(null);
  activeGuideRef.current = activeGuide;
  const currentStepIndexRef = useRef(0);
  currentStepIndexRef.current = currentStepIndex;

  // Learning Mode State
  const [learningSetupOpen, setLearningSetupOpen] = useState(false);
  const [learningResultsOpen, setLearningResultsOpen] = useState(false);
  const [sessionConfig, setSessionConfig] = useState<LearningSessionConfig>({
    category: 'all',
    difficulty: 'all',
    questionCount: 5
  });
  const [sessionQuestions, setSessionQuestions] = useState<LearningQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswerRecord>>({});
  const [currentAttemptStatus, setCurrentAttemptStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hintActive, setHintActive] = useState(false);
  const [revealedSolution, setRevealedSolution] = useState(false);
  const [lastIncorrectName, setLastIncorrectName] = useState('');
  const [identificationAttempts, setIdentificationAttempts] = useState(0);
  const [activeLearning, setActiveLearning] = useState(false);

  const activeLearningRef = useRef(false);
  activeLearningRef.current = activeLearning;
  const sessionQuestionsRef = useRef<LearningQuestion[]>([]);
  sessionQuestionsRef.current = sessionQuestions;
  const currentQIndexRef = useRef(0);
  currentQIndexRef.current = currentQIndex;
  const currentAttemptStatusRef = useRef<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  currentAttemptStatusRef.current = currentAttemptStatus;
  const hintActiveRef = useRef(false);
  hintActiveRef.current = hintActive;

  const score = useMemo(() => {
    return Object.values(userAnswers).filter(a => a.isCorrect).length;
  }, [userAnswers]);

  // Dissection & Cross-Section Mode State
  const [dissectionOpen, setDissectionOpen] = useState(false);
  const [activeDissectionPreset, setActiveDissectionPreset] = useState<string | null>('full-body');
  const [clippingState, setClippingState] = useState<ClippingState>(INITIAL_CLIPPING_STATE);
  const [dissectionTab, setDissectionTab] = useState<'presets' | 'layers' | 'cross-section'>('presets');
  const [dissectionHistory, setDissectionHistory] = useState<SystemId[][]>([]);

  // Anatomical Relationship Explorer State
  const [relationshipsOpen, setRelationshipsOpen] = useState(false);
  const [relationshipRootConceptId, setRelationshipRootConceptId] = useState('FMA7088');
  const [relationshipActiveConceptId, setRelationshipActiveConceptId] = useState('FMA7088');
  const [relationshipDepth, setRelationshipDepth] = useState<1 | 2>(1);
  const [relationshipViewMode, setRelationshipViewMode] = useState<'graph' | 'list'>('graph');
  const [selectedEdge, setSelectedEdge] = useState<RelationshipGraphEdge | null>(null);
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState<string | null>(null);
  const [graphZoom, setGraphZoom] = useState(1);
  const [graphPan, setGraphPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const abort = new AbortController();
    setProgress(0);
    setError('');
    setAtlas(null);
    setChosen(null);
    setDetails(false);
    setState({ ...initial, visible: DEFAULT_VISIBLE });
    fetch('/models/atlas.json', { signal: abort.signal })
      .then(r => {
        if (!r.ok) throw new Error('The anatomy catalogue could not be loaded.');
        return r.json();
      })
      .then(data => setAtlas(data as Atlas))
      .catch(e => {
        if (e.name !== 'AbortError') setError(e.message);
      });
    return () => abort.abort();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearching(true);
        setMobileSidebarOpen(true);
      }
      if (e.key === 'Escape') {
        setGuidesOpen(false);
        setLearningSetupOpen(false);
        setLearningResultsOpen(false);
        setDissectionOpen(false);
        setRelationshipsOpen(false);
        if (activeGuideRef.current) {
          setActiveGuide(null);
          setCurrentStepIndex(0);
        }
        if (activeLearningRef.current) {
          setActiveLearning(false);
        }
        setIsSearching(false);
        setQuery('');
        searchInputRef.current?.blur();
      }
      if (activeGuideRef.current && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          if (currentStepIndexRef.current < activeGuideRef.current.steps.length - 1) {
            e.preventDefault();
            navigateGuideStep(activeGuideRef.current, currentStepIndexRef.current + 1);
          }
        }
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          if (currentStepIndexRef.current > 0) {
            e.preventDefault();
            navigateGuideStep(activeGuideRef.current, currentStepIndexRef.current - 1);
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [atlas]);

  const parts = useMemo(() => new Map(atlas?.parts.map(p => [p.id, p])), [atlas]);
  const counts = useMemo(
    () => Object.fromEntries(SYSTEMS.map(s => [s.id, atlas?.parts.filter(p => p.system === s.id).length ?? 0])),
    [atlas]
  );
  const activeSystems = SYSTEMS.filter(s => counts[s.id] > 0);
  const selectedParts = state.selected.map(id => parts.get(id)).filter(p => !!p);
  const selected = selectedParts[0];
  const system = SYSTEMS.find(s => s.id === selected?.system);

  const visibleCount =
    atlas?.parts.filter(p =>
      state.isolate
        ? state.selected.includes(p.id)
        : state.visible.includes(p.system) || state.selected.includes(p.id)
    ).length ?? 0;

  const results = useMemo(() => {
    if (!atlas) return [];
    const term = query.toLowerCase().trim();
    if (!term) {
      return ['heart', 'brain', 'liver', 'stomach', 'spleen', 'pancreas', 'urinary bladder', 'trachea']
        .map(name => atlas.concepts.find(c => c.name.toLowerCase() === name))
        .filter((x): x is Concept => !!x);
    }
    return atlas.concepts
      .filter(c => c.name.toLowerCase().includes(term) || c.id.toLowerCase().includes(term))
      .sort((a, b) => a.name.length - b.name.length)
      .slice(0, 50);
  }, [atlas, query]);

  const choose = (c: Concept) => {
    setChosen(c);
    setState(s => ({ ...s, selected: c.elements, isolate: false, rotate: false }));
    setDetails(true);
    setIsSearching(false);
    setQuery('');
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (!atlas) return;
    return registerAtlasTools(atlas, c => flushSync(() => choose(c)));
  }, [atlas]);

  const choosePart = (id: string) => {
    const p = parts.get(id);
    if (!p) return;
    setChosen({ id: p.conceptId, name: p.name, elements: [id] });
    setState(s => ({ ...s, selected: [id], isolate: false, rotate: false }));
    setDetails(true);

    // Learning Mode structure identification evaluation
    if (activeLearningRef.current && sessionQuestionsRef.current.length > 0) {
      const q = sessionQuestionsRef.current[currentQIndexRef.current];
      if (q && q.type === 'identification' && currentAttemptStatusRef.current !== 'correct') {
        if (!atlas) return;
        const isMatch = isSelectionMatchingTarget(id, p.conceptId, q.targetConceptId ?? '', atlas);
        const targetConcept = q.targetConceptId ? atlas.concepts.find(c => c.id === q.targetConceptId) : null;
        setIdentificationAttempts(prev => prev + 1);

        if (isMatch) {
          setCurrentAttemptStatus('correct');
          if (targetConcept) {
            setChosen(targetConcept);
            setState(s => ({ ...s, selected: targetConcept.elements, isolate: false, rotate: false }));
          }
          setUserAnswers(prev => {
            if (prev[q.id]) return prev;
            return {
              ...prev,
              [q.id]: {
                questionId: q.id,
                questionType: 'identification',
                userSelection: p.name,
                isCorrect: true,
                attemptsUsed: identificationAttempts + 1,
                hintUsed: hintActiveRef.current,
                targetConceptId: q.targetConceptId
              }
            };
          });
        } else {
          setCurrentAttemptStatus('incorrect');
          setLastIncorrectName(p.name);
        }
      }
    }
  };

  const navigateToConcept = (conceptId: string) => {
    if (!atlas) return;
    const target = atlas.concepts.find(c => c.id === conceptId);
    if (!target) return;
    choose(target);
  };

  // Educational Knowledge Layer Lookup
  const knowledgeResult = useMemo(() => {
    if (!chosen) return { entry: null, parentConcept: null };
    return findKnowledgeForConcept(
      chosen.id,
      state.selected.length === 1 ? state.selected[0] : undefined,
      atlas?.concepts,
      parts
    );
  }, [chosen, state.selected, atlas, parts]);

  const knowledge = knowledgeResult.entry;
  const parentOrganConcept = knowledgeResult.parentConcept;

  const toggleSystem = (id: SystemId) => {
    setState(s => ({
      ...s,
      selected: [],
      isolate: false,
      visible: s.visible.includes(id) ? s.visible.filter(x => x !== id) : [...s.visible, id]
    }));
  };

  const soloSystem = (id: SystemId) => {
    setState(v => ({
      ...v,
      visible: [id],
      isolate: false,
      selected: []
    }));
  };

  const reset = () => {
    setState(s => ({ ...initial, visible: DEFAULT_VISIBLE, reset: s.reset + 1 }));
    setChosen(null);
    setDetails(false);
    setQuery('');
    setIsSearching(false);
    setActiveGuide(null);
    setCurrentStepIndex(0);
    setActiveLearning(false);
    setLearningSetupOpen(false);
    setLearningResultsOpen(false);
    setDissectionOpen(false);
    setActiveDissectionPreset('full-body');
    setClippingState(INITIAL_CLIPPING_STATE);
    setDissectionHistory([]);
    setRelationshipsOpen(false);
    setRelationshipDepth(1);
    setSelectedEdge(null);
  };

  // Dissection Mode Presets & Layer Peel Handlers
  const applyDissectionPreset = (preset: DissectionPreset) => {
    setDissectionHistory(prev => [...prev.slice(-10), state.visible]);
    setState(s => ({
      ...s,
      visible: [...preset.systems],
      isolate: false
    }));
    setActiveDissectionPreset(preset.id);
  };

  const toggleDissectionLayer = (layer: ProgressiveLayer) => {
    setDissectionHistory(prev => [...prev.slice(-10), state.visible]);
    const systemsToToggle: SystemId[] = layer.id === 'layer-vessels' ? ['arterial', 'venous'] : [layer.system];
    const allCurrentlyVisible = systemsToToggle.every(sys => state.visible.includes(sys));

    setState(s => {
      const nextVisible = allCurrentlyVisible
        ? s.visible.filter(sys => !systemsToToggle.includes(sys))
        : Array.from(new Set([...s.visible, ...systemsToToggle]));
      return {
        ...s,
        visible: nextVisible,
        isolate: false
      };
    });
    setActiveDissectionPreset(null);
  };

  const restoreAllDissection = () => {
    setDissectionHistory(prev => [...prev.slice(-10), state.visible]);
    setState(s => ({
      ...s,
      visible: DEFAULT_VISIBLE,
      isolate: false
    }));
    setActiveDissectionPreset('full-body');
    setClippingState(INITIAL_CLIPPING_STATE);
  };

  const undoDissection = () => {
    if (dissectionHistory.length === 0) return;
    const prevVisible = dissectionHistory[dissectionHistory.length - 1];
    setDissectionHistory(prev => prev.slice(0, -1));
    setState(s => ({
      ...s,
      visible: prevVisible,
      isolate: false
    }));
    const matchingPreset = DISSECTION_PRESETS.find(p =>
      p.systems.length === prevVisible.length && p.systems.every(sys => prevVisible.includes(sys))
    );
    setActiveDissectionPreset(matchingPreset ? matchingPreset.id : null);
  };

  const updateClipping = (partial: Partial<ClippingState>) => {
    setClippingState(prev => ({ ...prev, ...partial }));
  };

  const resetClipping = () => {
    setClippingState(INITIAL_CLIPPING_STATE);
  };

  // Anatomical Relationship Explorer Handlers
  const openRelationshipExplorer = (conceptId?: string) => {
    const targetId = conceptId || chosen?.id || 'FMA7088';
    setRelationshipRootConceptId(targetId);
    setRelationshipActiveConceptId(targetId);
    setRelationshipDepth(1);
    setSelectedEdge(null);
    setSelectedGraphNodeId(targetId);
    setGraphZoom(1);
    setGraphPan({ x: 0, y: 0 });
    setRelationshipsOpen(true);
    setGuidesOpen(false);
    setActiveGuide(null);
    setLearningSetupOpen(false);
    setActiveLearning(false);
  };

  const isConceptHiddenIn3D = (conceptId: string): { isHidden: boolean; system?: SystemId; systemName?: string } => {
    if (!atlas) return { isHidden: false };
    const c = atlas.concepts.find(item => item.id === conceptId);
    if (!c || c.elements.length === 0) return { isHidden: false };
    const firstPart = parts.get(c.elements[0]);
    if (!firstPart) return { isHidden: false };
    const isSysVisible = state.visible.includes(firstPart.system);
    const sysObj = SYSTEMS.find(s => s.id === firstPart.system);
    return {
      isHidden: !isSysVisible,
      system: firstPart.system,
      systemName: sysObj?.name ?? firstPart.system
    };
  };

  const revealSystemIn3D = (systemId: SystemId) => {
    if (!state.visible.includes(systemId)) {
      setState(s => ({
        ...s,
        visible: [...s.visible, systemId]
      }));
    }
  };

  const getRelDirectionalLabel = (type: AnatomicalRelationshipType, isOutgoing: boolean) => {
    if (type === 'part_of') return isOutgoing ? 'Part of' : 'Contains';
    if (type === 'contains') return isOutgoing ? 'Contains' : 'Part of';
    if (type === 'supplies') return isOutgoing ? 'Supplies' : 'Supplied by';
    if (type === 'drains_into') return isOutgoing ? 'Drains into' : 'Receives drainage from';
    if (type === 'surrounds') return isOutgoing ? 'Surrounds' : 'Surrounded by';
    return RELATIONSHIP_TYPE_LABELS[type]?.label ?? type;
  };

  const activeConceptRelationships = useMemo(() => {
    if (!chosen) return [];
    return getRelationshipsForConcept(chosen.id).map(rel => {
      const isOutgoing = rel.sourceConceptId === chosen.id;
      const otherConceptId = isOutgoing ? rel.targetConceptId : rel.sourceConceptId;
      const otherConcept = atlas?.concepts.find(c => c.id === otherConceptId);
      return {
        rel,
        isOutgoing,
        otherConceptId,
        otherConceptName: otherConcept?.name ?? otherConceptId,
        category: rel.category
      };
    });
  }, [chosen, atlas]);

  const activeGraphData = useMemo(() => {
    return buildRelationshipGraph(
      relationshipActiveConceptId,
      id => atlas?.concepts.find(c => c.id === id)?.name,
      id => {
        const c = atlas?.concepts.find(item => item.id === id);
        return c?.elements[0] ? parts.get(c.elements[0])?.system : undefined;
      },
      relationshipDepth
    );
  }, [relationshipActiveConceptId, relationshipDepth, atlas, parts]);

  const startLearningSession = (config: LearningSessionConfig) => {
    const filtered = filterQuestions(config);
    if (filtered.length === 0) return;

    setSessionQuestions(filtered);
    setCurrentQIndex(0);
    setUserAnswers({});
    setCurrentAttemptStatus('unanswered');
    setSelectedOption(null);
    setHintActive(false);
    setRevealedSolution(false);
    setLastIncorrectName('');
    setIdentificationAttempts(0);
    setActiveLearning(true);
    setLearningSetupOpen(false);
    setLearningResultsOpen(false);
    setActiveGuide(null);

    const q0 = filtered[0];
    if (q0 && q0.type === 'identification' && q0.targetConceptId && atlas) {
      const concept = atlas.concepts.find(c => c.id === q0.targetConceptId);
      if (concept) {
        const firstPart = parts.get(concept.elements[0]);
        const sysId = firstPart?.system;
        setState(s => ({
          ...s,
          visible: sysId && !s.visible.includes(sysId) ? [...s.visible, sysId] : s.visible,
          selected: [],
          isolate: false,
          rotate: false,
          view: q0.cameraView ?? s.view,
          reset: q0.cameraView ? s.reset + 1 : s.reset
        }));
      }
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < sessionQuestions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setCurrentAttemptStatus('unanswered');
      setSelectedOption(null);
      setHintActive(false);
      setRevealedSolution(false);
      setLastIncorrectName('');
      setIdentificationAttempts(0);

      const nextQ = sessionQuestions[nextIdx];
      if (nextQ && nextQ.type === 'identification' && nextQ.targetConceptId && atlas) {
        const concept = atlas.concepts.find(c => c.id === nextQ.targetConceptId);
        if (concept) {
          const firstPart = parts.get(concept.elements[0]);
          const sysId = firstPart?.system;
          setState(s => ({
            ...s,
            visible: sysId && !s.visible.includes(sysId) ? [...s.visible, sysId] : s.visible,
            selected: [],
            isolate: false,
            rotate: false,
            view: nextQ.cameraView ?? s.view,
            reset: nextQ.cameraView ? s.reset + 1 : s.reset
          }));
        }
      }
    } else {
      setActiveLearning(false);
      setLearningResultsOpen(true);
    }
  };

  const exitLearningSession = () => {
    setActiveLearning(false);
    setLearningSetupOpen(false);
    setLearningResultsOpen(false);
    setCurrentAttemptStatus('unanswered');
    setSelectedOption(null);
    setHintActive(false);
    setRevealedSolution(false);
    setLastIncorrectName('');
    setIdentificationAttempts(0);
  };

  const handleMultipleChoiceSelect = (opt: string) => {
    if (currentAttemptStatus !== 'unanswered') return;
    setSelectedOption(opt);
    const q = sessionQuestions[currentQIndex];
    if (!q) return;

    const isCorrect = opt === q.correctAnswer;
    setCurrentAttemptStatus(isCorrect ? 'correct' : 'incorrect');

    setUserAnswers(prev => {
      if (prev[q.id]) return prev;
      return {
        ...prev,
        [q.id]: {
          questionId: q.id,
          questionType: q.type,
          userSelection: opt,
          isCorrect,
          attemptsUsed: 1,
          hintUsed: hintActive,
          targetConceptId: q.targetConceptId
        }
      };
    });

    if (q.targetConceptId && atlas) {
      const target = atlas.concepts.find(c => c.id === q.targetConceptId);
      if (target) {
        setChosen(target);
        setState(s => ({ ...s, selected: target.elements, isolate: false, rotate: false }));
      }
    }
  };

  const revealSolution = () => {
    const q = sessionQuestions[currentQIndex];
    if (!q || !atlas) return;
    setRevealedSolution(true);
    setCurrentAttemptStatus('incorrect');
    if (q.targetConceptId) {
      const target = atlas.concepts.find(c => c.id === q.targetConceptId);
      if (target) {
        setChosen(target);
        setState(s => ({ ...s, selected: target.elements, isolate: false, rotate: false }));
        setDetails(true);
      }
    }
    setUserAnswers(prev => {
      if (prev[q.id]) return prev;
      return {
        ...prev,
        [q.id]: {
          questionId: q.id,
          questionType: q.type,
          userSelection: 'Solution Revealed',
          isCorrect: false,
          attemptsUsed: identificationAttempts,
          hintUsed: hintActive,
          targetConceptId: q.targetConceptId
        }
      };
    });
  };

  const navigateGuideStep = (guide: GuidedExploration, stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= guide.steps.length) return;
    const step = guide.steps[stepIndex];
    setCurrentStepIndex(stepIndex);

    if (!atlas) return;
    const concept = atlas.concepts.find(c => c.id === step.conceptId);
    if (concept) {
      const firstPart = parts.get(concept.elements[0]);
      const sysId = firstPart?.system;
      setState(s => {
        const nextVisible = sysId && !s.visible.includes(sysId)
          ? [...s.visible, sysId]
          : s.visible;
        return {
          ...s,
          visible: nextVisible,
          selected: concept.elements,
          isolate: false,
          rotate: false,
          view: step.cameraView ?? s.view,
          reset: step.cameraView ? s.reset + 1 : s.reset
        };
      });
      setChosen(concept);
      setDetails(true);
      setInspectorTab('overview');
    }
  };

  const startGuide = (guide: GuidedExploration) => {
    setActiveGuide(guide);
    setGuidesOpen(false);
    setMobileSidebarOpen(false);
    navigateGuideStep(guide, 0);
  };

  const exitGuide = () => {
    setActiveGuide(null);
    setCurrentStepIndex(0);
  };

  const onExplodeChange = (v: number | readonly number[]) => {
    const val = Array.isArray(v) ? v[0] : v;
    setState(s => ({
      ...s,
      explode: val / 100,
      view: val > 80 ? 'front' : s.view,
      rotate: false
    }));
  };

  const boundsDimensions = useMemo(() => {
    if (!selected) return null;
    const dx = Math.abs(selected.bounds[1][0] - selected.bounds[0][0]) * 100;
    const dy = Math.abs(selected.bounds[1][1] - selected.bounds[0][1]) * 100;
    const dz = Math.abs(selected.bounds[1][2] - selected.bounds[0][2]) * 100;
    return {
      w: dx < 0.1 ? '< 0.1' : dx.toFixed(1),
      h: dy < 0.1 ? '< 0.1' : dy.toFixed(1),
      d: dz < 0.1 ? '< 0.1' : dz.toFixed(1),
      cx: ((selected.bounds[0][0] + selected.bounds[1][0]) / 2).toFixed(2),
      cy: ((selected.bounds[0][1] + selected.bounds[1][1]) / 2).toFixed(2),
      cz: ((selected.bounds[0][2] + selected.bounds[1][2]) / 2).toFixed(2)
    };
  }, [selected]);

  return (
    <main className="studio">
      {/* 3D Scene Viewport */}
      {atlas && (
        <AnatomyScene
          atlas={atlas}
          state={{ ...state, clipping: clippingState, inspectorOpen: details && selectedParts.length > 0 }}
          onSelect={choosePart}
          onProgress={n => {
            setProgress(n);
            if (n === 100) setError('');
          }}
          onError={setError}
        />
      )}

      {/* Subtle scientific depth vignette */}
      <div className="vignette" />

      {/* 1. LEFT SIDEBAR — ANATOMY EXPLORER */}
      <aside
        className={`explorer-sidebar glass ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        aria-label="Anatomy Explorer Sidebar"
      >
        <div className="sidebar-header">
          <div className="brand-identity">
            <div className="brand-eyebrow">
              <span className="status-pulse" />
              HUMAN ATLAS
            </div>
            <h1 className="brand-title">
              Anatomy 3D
              <span className="brand-badge">REF</span>
            </h1>
            <span className="brand-meta">
              {atlas ? atlas.parts.length.toLocaleString() : '2,234'} Meshes · 15 Systems
            </span>
          </div>
          <Button
            variant="ghost"
            className="mobile-toggle-btn icon-button"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Embedded Anatomy Search */}
        <div className="sidebar-search">
          <div className="search-input-wrap">
            <Search size={15} className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search anatomy or FMA ID…"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              aria-label="Search named anatomical structures"
            />
            {query ? (
              <button
                className="search-clear"
                onClick={() => {
                  setQuery('');
                  setIsSearching(false);
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="search-shortcut">/</kbd>
            )}
          </div>

          {/* Live Search Results Overlay */}
          {isSearching && (
            <div className="search-results-overlay glass">
              <div className="search-results-list">
                {results.length > 0 ? (
                  results.map(c => (
                    <button
                      key={c.id}
                      className="search-result-item"
                      onClick={() => choose(c)}
                    >
                      <span className="search-result-name">{c.name}</span>
                      <span className="search-result-count">
                        {c.elements.length} {c.elements.length === 1 ? 'part' : 'parts'}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="search-empty">No anatomical structures match your search.</div>
                )}
              </div>
            </div>
          )}
        </div>

          {/* Guided Anatomy Exploration Trigger */}
          <button
            className="guided-tour-trigger-card"
            onClick={() => setGuidesOpen(true)}
            aria-label="Open Guided Anatomy Explorations"
          >
            <div className="guided-tour-trigger-left">
              <div className="guided-tour-trigger-icon">
                <Compass size={18} />
              </div>
              <div>
                <div className="guided-tour-trigger-title">Guided Exploration</div>
                <div className="guided-tour-trigger-sub">
                  <span>{GUIDED_EXPLORATIONS.length} Interactive Modules</span>
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="guided-tour-trigger-arrow" />
          </button>

          {/* Learning Mode Trigger */}
          <button
            className="learning-mode-trigger-card"
            onClick={() => {
              setLearningSetupOpen(true);
              setGuidesOpen(false);
            }}
            aria-label="Open Interactive Learning Mode"
          >
            <div className="learning-trigger-left">
              <div className="learning-trigger-icon">
                <GraduationCap size={18} />
              </div>
              <div>
                <div className="learning-trigger-title">Learning Mode</div>
                <div className="learning-trigger-sub">
                  <span>Interactive 3D Quiz</span>
                </div>
              </div>
            </div>
            <ChevronRight size={16} className="learning-trigger-arrow" />
          </button>

          {/* Dissection Mode Trigger */}
          <button
            className={`dissection-mode-trigger-card ${dissectionOpen ? 'active' : ''}`}
            onClick={() => {
              const nextOpen = !dissectionOpen;
              setDissectionOpen(nextOpen);
              if (nextOpen) {
                setGuidesOpen(false);
                setActiveGuide(null);
                setActiveLearning(false);
              }
            }}
            aria-label="Toggle Dissection & Cross-Section Mode"
          >
            <div className="dissection-trigger-left">
              <div className="dissection-trigger-icon">
                <Scissors size={18} />
              </div>
              <div>
                <div className="dissection-trigger-title">Dissection Mode</div>
                <div className="dissection-trigger-sub">
                  <span>
                    {activeDissectionPreset
                      ? (DISSECTION_PRESETS.find(p => p.id === activeDissectionPreset)?.name ?? 'Custom View')
                      : 'Layer Peel & Cross-Section'}
                  </span>
                </div>
              </div>
            </div>
            <span className="dissection-trigger-badge">
              {clippingState.enabled ? 'CUT ACTIVE' : dissectionOpen ? 'ACTIVE' : 'READY'}
            </span>
          </button>

          {/* Anatomical Relationship Explorer Trigger */}
          <button
            className={`relationships-trigger-card ${relationshipsOpen ? 'active' : ''}`}
            onClick={() => openRelationshipExplorer(chosen?.id ?? 'FMA7088')}
            aria-label="Open Anatomical Relationship Explorer"
          >
            <div className="relationships-trigger-left">
              <div className="relationships-trigger-icon">
                <Network size={18} />
              </div>
              <div>
                <div className="relationships-trigger-title">Relationships</div>
                <div className="relationships-trigger-sub">
                  <span>Explore Connected Organs</span>
                </div>
              </div>
            </div>
            <span className="relationships-trigger-badge">
              EXPLORE
            </span>
          </button>

          {/* Preset Filters */}
          <div className="preset-bar">
          <button
            className={`preset-chip ${activeSystems.every(x => state.visible.includes(x.id)) ? 'active' : ''}`}
            onClick={() => setState(s => ({ ...s, selected: [], isolate: false, visible: activeSystems.map(x => x.id) }))}
          >
            All
          </button>
          <button
            className={`preset-chip ${state.visible.length === 1 && state.visible[0] === 'skeletal' ? 'active' : ''}`}
            onClick={() => setState(s => ({ ...s, selected: [], isolate: false, visible: ['skeletal'] }))}
          >
            Skeleton
          </button>
          <button
            className={`preset-chip ${
              state.visible.length === 6 &&
              ['cardiac', 'respiratory', 'digestive', 'urinary', 'endocrine', 'reproductive'].every(id =>
                state.visible.includes(id as SystemId)
              )
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setState(s => ({
                ...s,
                selected: [],
                isolate: false,
                visible: ['cardiac', 'respiratory', 'digestive', 'urinary', 'endocrine', 'reproductive']
              }))
            }
          >
            Organs
          </button>
          <button
            className="preset-chip"
            onClick={() => setState(s => ({ ...s, visible: [], selected: [], isolate: false }))}
          >
            Clear
          </button>
        </div>

        {/* Anatomical System Categories */}
        <div className="systems-section-header">
          <span>Anatomical Systems</span>
          <Badge variant="outline" className="brand-badge">
            {activeSystems.length}
          </Badge>
        </div>

        <div className="systems-scroll">
          {activeSystems.map(s => {
            const isEnabled = state.visible.includes(s.id);
            return (
              <div className={`system-row ${isEnabled ? 'active' : ''}`} key={s.id}>
                <button
                  className="system-button"
                  title={`Focus on ${s.name.toLowerCase()}`}
                  onClick={() => soloSystem(s.id)}
                >
                  <span className="system-indicator" style={{ background: s.color }} />
                  <span className="system-label">{s.name}</span>
                  <span className="system-count-tag">{counts[s.id]}</span>
                </button>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => toggleSystem(s.id)}
                  aria-label={`Toggle ${s.name.toLowerCase()}`}
                />
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <span className="visible-count">{visibleCount.toLocaleString()} pieces visible</span>
          <button className="sidebar-foot-action" onClick={() => setAbout(true)}>
            Sources & Info <ArrowUpRight size={11} style={{ display: 'inline', verticalAlign: '-1px' }} />
          </button>
        </div>
      </aside>

      {/* 2. CENTER — INTERACTIVE 3D VIEWER OVERLAYS */}

      {/* Scene Mode Caption (Top Center) */}
      <div className="scene-caption-wrap">
        <div className={`scene-mode-badge ${state.isolate ? 'is-isolated' : ''}`}>
          <span className="mode-dot" />
          <span>
            {state.isolate
              ? `ISOLATED · ${(knowledge?.canonicalName ?? chosen?.name)?.toUpperCase() ?? 'STRUCTURE'}`
              : state.explode > 0.95
              ? 'ANATOMICAL INVENTORY'
              : state.explode > 0.05
              ? `EXPLODED VIEW · ${Math.round(state.explode * 100)}%`
              : 'ADULT MALE · 3D REFERENCE'}
          </span>
        </div>
      </div>

      {/* Camera Toolbar (Top Right) */}
      <nav className="camera-toolbar glass" aria-label="Camera Controls">
        <button
          className="camera-btn mobile-toggle-btn"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle Systems Sidebar"
          title="Toggle Systems"
        >
          <Layers3 size={16} />
        </button>
        {(['three-quarter', 'front', 'side', 'back'] as View[]).map((v, i) => (
          <button
            key={v}
            className={`camera-btn ${state.view === v ? 'active' : ''}`}
            disabled={state.explode > 0.8 && v !== 'front'}
            onClick={() => setState(s => ({ ...s, view: v, reset: s.reset + 1, rotate: false }))}
            title={`${v} view`}
            aria-label={`${v} view`}
          >
            {['¾', 'F', 'S', 'B'][i]}
          </button>
        ))}
        <div className="toolbar-divider" />
        <button
          className={`camera-btn ${state.rotate ? 'active' : ''}`}
          disabled={state.explode >= 0.4}
          onClick={() => setState(s => ({ ...s, rotate: !s.rotate }))}
          aria-label={state.rotate ? 'Pause auto-rotation' : 'Start auto-rotation'}
          title="Auto rotate"
        >
          {state.rotate ? <Pause size={15} /> : <RotateCw size={15} />}
        </button>
        <button
          className="camera-btn"
          onClick={reset}
          aria-label="Reset Camera and View"
          title="Reset Camera & View"
        >
          <RotateCcw size={15} />
        </button>
        <button
          className="camera-btn"
          onClick={() => setAbout(true)}
          aria-label="About this Atlas"
          title="Atlas Details & Citation"
        >
          <Info size={15} />
        </button>
      </nav>

      {/* Bottom Control Dock */}
      <div className="bottom-dock glass">
        <div className="dock-slider-group">
          <div className="dock-slider-header">
            <span className="dock-label">Exploded View</span>
            <span className="dock-readout">{Math.round(state.explode * 100)}%</span>
          </div>
          <Slider
            aria-label="Explode anatomical pieces"
            min={0}
            max={100}
            step={1}
            value={[state.explode * 100]}
            onValueChange={onExplodeChange}
          />
          <div className="dock-slider-footer">
            <span>Assembled Body</span>
            <span>Spaced Inventory</span>
          </div>
        </div>
        <button className="dock-reset-btn" onClick={reset} aria-label="Reset Anatomy Assembly">
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {/* Active Guided Exploration Floating Dock */}
      {activeGuide && (() => {
        const step = activeGuide.steps[currentStepIndex];
        const isFirst = currentStepIndex === 0;
        const isLast = currentStepIndex === activeGuide.steps.length - 1;
        const targetConcept = atlas?.concepts.find(c => c.id === step.conceptId);

        return (
          <div className="active-guide-dock glass" role="region" aria-label="Guided Exploration Active Step">
            <div className="active-guide-header">
              <div className="active-guide-identity">
                <span className="active-guide-tag">GUIDED TOUR</span>
                <span className="active-guide-title" title={activeGuide.title}>
                  {activeGuide.title}
                </span>
              </div>
              <div className="active-guide-controls">
                <span className="active-guide-counter">
                  Step {currentStepIndex + 1} of {activeGuide.steps.length}
                </span>
                <button
                  className="active-guide-exit-btn"
                  onClick={exitGuide}
                  aria-label="Exit Guided Exploration"
                  title="Exit Guide and return to free exploration"
                >
                  <X size={13} />
                  <span>Exit Guide</span>
                </button>
              </div>
            </div>

            {/* Progress Segments */}
            <div className="guide-progress-segments" aria-hidden="true">
              {activeGuide.steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`guide-progress-bar-seg ${idx <= currentStepIndex ? 'completed' : ''} ${idx === currentStepIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            {/* Step Body */}
            <div className="guide-step-body">
              <div className="guide-step-title-row">
                <h3 className="guide-step-title">{step.title}</h3>
                <span className="guide-target-badge">
                  {targetConcept?.name ? `${targetConcept.name.toUpperCase()} (${step.conceptId})` : step.conceptId}
                </span>
              </div>
              <p className="guide-step-explanation">{step.explanation}</p>

              {step.learningObjectives && step.learningObjectives.length > 0 && (
                <div className="guide-step-objectives">
                  <span className="guide-objectives-heading">Key Learning Objectives</span>
                  {step.learningObjectives.map((obj, i) => (
                    <div key={i} className="guide-objective-item">
                      <span className="guide-obj-bullet">•</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Navigation Controls */}
            <div className="guide-nav-bar">
              <button
                className="guide-nav-btn guide-nav-btn-prev"
                disabled={isFirst}
                onClick={() => navigateGuideStep(activeGuide, currentStepIndex - 1)}
                aria-label="Go to previous step"
              >
                <ChevronLeft size={15} />
                <span>Previous</span>
              </button>

              <span className="guide-nav-hint">
                <kbd className="search-shortcut">&lt;</kbd> <kbd className="search-shortcut">&gt;</kbd> keys
              </span>

              {isLast ? (
                <button
                  className="guide-nav-btn guide-nav-btn-complete"
                  onClick={exitGuide}
                  aria-label="Complete Guided Exploration"
                >
                  <CheckCircle2 size={15} />
                  <span>Complete Guide</span>
                </button>
              ) : (
                <button
                  className="guide-nav-btn guide-nav-btn-next"
                  onClick={() => navigateGuideStep(activeGuide, currentStepIndex + 1)}
                  aria-label="Advance to next step"
                >
                  <span>Next Step</span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Active Learning Session Floating Dock */}
      {activeLearning && sessionQuestions.length > 0 && (() => {
        const currentQ = sessionQuestions[currentQIndex];
        if (!currentQ) return null;
        const isLast = currentQIndex === sessionQuestions.length - 1;
        const isIdQuestion = currentQ.type === 'identification';
        const targetConcept = currentQ.targetConceptId
          ? atlas?.concepts.find(c => c.id === currentQ.targetConceptId)
          : null;

        return (
          <div className="active-learning-dock glass" role="region" aria-label="Learning Mode Active Question">
            {/* Top Header */}
            <div className="active-guide-header">
              <div className="active-guide-identity">
                <span className="active-learning-tag">LEARNING MODE</span>
                <span className="quiz-type-badge">
                  {isIdQuestion ? '3D Identification' : currentQ.type === 'true-false' ? 'True / False' : 'Multiple Choice'}
                </span>
                <span className="active-guide-counter">
                  Q{currentQIndex + 1} of {sessionQuestions.length}
                </span>
              </div>
              <div className="active-guide-controls">
                <span className="quiz-score-pill">
                  Score: {score} / {currentQIndex + (currentAttemptStatus === 'correct' ? 1 : 0)}
                </span>
                <button
                  className="active-guide-exit-btn"
                  onClick={exitLearningSession}
                  aria-label="Exit Learning Mode"
                  title="Exit Learning Mode and return to free exploration"
                >
                  <X size={13} />
                  <span>Exit Quiz</span>
                </button>
              </div>
            </div>

            {/* Progress Segments */}
            <div className="guide-progress-segments" aria-hidden="true">
              {sessionQuestions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCurrent = idx === currentQIndex;
                const isDone = !!ans;
                return (
                  <div
                    key={q.id}
                    className={`quiz-progress-bar-seg ${isDone ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                  />
                );
              })}
            </div>

            {/* Question Prompt */}
            <div className="guide-step-body">
              <h3 className="quiz-question-prompt">{currentQ.title}</h3>

              {/* 1. Multiple-Choice / True-False Interaction */}
              {!isIdQuestion && currentQ.options && (
                <div className="quiz-options-list">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === opt;
                    const isSubmitted = currentAttemptStatus !== 'unanswered';
                    const isCorrectOpt = opt === currentQ.correctAnswer;
                    let optClass = 'quiz-option-btn';
                    if (isSubmitted) {
                      if (isCorrectOpt) optClass += ' is-correct';
                      else if (isSelected) optClass += ' is-incorrect';
                    }

                    return (
                      <button
                        key={optIdx}
                        className={optClass}
                        disabled={isSubmitted}
                        onClick={() => handleMultipleChoiceSelect(opt)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="quiz-option-indicator">
                            {['A', 'B', 'C', 'D'][optIdx] ?? (optIdx + 1)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSubmitted && isCorrectOpt && <Check size={15} className="text-emerald-400" />}
                        {isSubmitted && isSelected && !isCorrectOpt && <X size={15} className="text-rose-400" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. 3D Structure Identification Interaction */}
              {isIdQuestion && (
                <div className="quiz-id-box">
                  <div className="quiz-id-instruction">
                    <span className="quiz-id-pulse-dot" />
                    <span>Click on the structure directly on the 3D model.</span>
                  </div>

                  {currentAttemptStatus === 'unanswered' && (
                    <div className="quiz-id-feedback" style={{ background: 'rgba(255,255,255,0.03)', color: '#94a3b8' }}>
                      <Compass size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>
                        {selectedParts.length > 0
                          ? `Selected: ${selectedParts[0]?.name}. (Click to select target structure)`
                          : 'Rotate the model and click to test your identification.'}
                      </span>
                    </div>
                  )}

                  {currentAttemptStatus === 'correct' && (
                    <div className="quiz-id-feedback correct">
                      <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Correct!</strong> You successfully identified the {targetConcept?.name ?? currentQ.targetConceptName}.
                      </div>
                    </div>
                  )}

                  {currentAttemptStatus === 'incorrect' && (
                    <div className="quiz-id-feedback incorrect">
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Incorrect selection.</strong> {lastIncorrectName ? `You selected ${lastIncorrectName}. ` : ''}
                        Try again or use the hint below.
                      </div>
                    </div>
                  )}

                  {currentAttemptStatus === 'incorrect' && !revealedSolution && (
                    <div className="quiz-id-actions">
                      <button
                        className="quiz-id-action-btn"
                        onClick={() => {
                          setCurrentAttemptStatus('unanswered');
                        }}
                      >
                        <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Try Again
                      </button>
                      <button
                        className="quiz-id-action-btn"
                        onClick={revealSolution}
                      >
                        Show Solution
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Hint Callout */}
              {hintActive ? (
                <div className="quiz-hint-box">
                  <Lightbulb size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Hint:</strong> {currentQ.hint}
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    className="quiz-hint-trigger-btn"
                    onClick={() => setHintActive(true)}
                  >
                    <HelpCircle size={13} />
                    <span>Need a hint?</span>
                  </button>
                </div>
              )}

              {/* Educational Explanation */}
              {(currentAttemptStatus === 'correct' || (currentAttemptStatus === 'incorrect' && (!isIdQuestion || revealedSolution))) && (
                <div className="quiz-explanation-box">
                  <span className="quiz-explanation-heading">Educational Context</span>
                  <p style={{ margin: 0 }}>{currentQ.explanation}</p>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="guide-nav-bar">
              <span className="guide-nav-hint">
                {currentAttemptStatus !== 'unanswered' ? 'Answer recorded' : 'Select an answer to proceed'}
              </span>

              {currentAttemptStatus !== 'unanswered' && (
                isLast ? (
                  <button
                    className="guide-nav-btn guide-nav-btn-complete"
                    onClick={nextQuestion}
                    aria-label="View Quiz Results"
                  >
                    <Trophy size={14} />
                    <span>View Results</span>
                  </button>
                ) : (
                  <button
                    className="guide-nav-btn guide-nav-btn-next"
                    onClick={nextQuestion}
                    aria-label="Next Question"
                  >
                    <span>Next Question</span>
                    <ChevronRight size={15} />
                  </button>
                )
              )}
            </div>
          </div>
        );
      })()}

      {/* Active Dissection & Cross-Section Floating Dock */}
      {dissectionOpen && !activeGuide && !activeLearning && (
        <div
          className="active-dissection-dock glass"
          role="region"
          aria-label="Dissection and Cross-Section Controls"
        >
          {/* Header */}
          <div className="dissection-dock-header">
            <div className="dissection-dock-identity">
              <span className="dissection-dock-tag">DISSECTION &amp; CROSS-SECTION</span>
              <span className="dissection-preset-active-indicator">
                {activeDissectionPreset
                  ? `Preset: ${DISSECTION_PRESETS.find(p => p.id === activeDissectionPreset)?.name ?? 'Custom View'}`
                  : 'Custom Layer Configuration'}
              </span>
            </div>
            <div className="dissection-dock-actions">
              <button
                className="dissection-action-btn"
                disabled={dissectionHistory.length === 0}
                onClick={undoDissection}
                title="Undo last dissection visibility change"
                aria-label="Undo Dissection"
              >
                <Undo2 size={13} />
                <span>Undo</span>
              </button>
              <button
                className="dissection-action-btn"
                onClick={restoreAllDissection}
                title="Restore all 14 systems and reset cross-section plane"
                aria-label="Restore Full Anatomy"
              >
                <RotateCcw size={13} />
                <span>Restore All</span>
              </button>
              <button
                className="dissection-exit-btn"
                onClick={() => setDissectionOpen(false)}
                title="Close Dissection Mode and return to Free Exploration"
                aria-label="Close Dissection Mode"
              >
                <X size={13} />
                <span>Free Exploration</span>
              </button>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="dissection-tabs-bar" role="tablist" aria-label="Dissection Mode Modes">
            <button
              className={`dissection-tab-btn ${dissectionTab === 'presets' ? 'active' : ''}`}
              role="tab"
              aria-selected={dissectionTab === 'presets'}
              onClick={() => setDissectionTab('presets')}
            >
              <Layers3 size={13} />
              <span>Anatomy Presets</span>
            </button>
            <button
              className={`dissection-tab-btn ${dissectionTab === 'layers' ? 'active' : ''}`}
              role="tab"
              aria-selected={dissectionTab === 'layers'}
              onClick={() => setDissectionTab('layers')}
            >
              <Eye size={13} />
              <span>Layer Reveal</span>
            </button>
            <button
              className={`dissection-tab-btn ${dissectionTab === 'cross-section' ? 'active' : ''}`}
              role="tab"
              aria-selected={dissectionTab === 'cross-section'}
              onClick={() => setDissectionTab('cross-section')}
            >
              <Scissors size={13} />
              <span>3D Cross-Section</span>
              {clippingState.enabled && (
                <span className="status-pulse" style={{ width: 6, height: 6, display: 'inline-block' }} />
              )}
            </button>
          </div>

          {/* Tab 1: Presets Grid */}
          {dissectionTab === 'presets' && (
            <div className="dissection-presets-grid">
              {DISSECTION_PRESETS.map(preset => {
                const isActive = activeDissectionPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    className={`dissection-preset-card ${isActive ? 'active' : ''}`}
                    onClick={() => applyDissectionPreset(preset)}
                    title={preset.description}
                  >
                    <div className="dissection-preset-top">
                      <span className="dissection-preset-name">{preset.name}</span>
                      <span className="dissection-preset-badge">{preset.badge}</span>
                    </div>
                    <p className="dissection-preset-desc">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Progressive Layer Peeling */}
          {dissectionTab === 'layers' && (
            <div className="dissection-layers-list">
              {DISSECTION_LAYERS.map(layer => {
                const systemsToCheck: SystemId[] = layer.id === 'layer-vessels' ? ['arterial', 'venous'] : [layer.system];
                const isVisible = systemsToCheck.some(sys => state.visible.includes(sys));

                return (
                  <div key={layer.id} className="dissection-layer-row">
                    <div className="dissection-layer-info">
                      <span className="dissection-layer-name">{layer.name}</span>
                      <span className="dissection-layer-desc">{layer.description}</span>
                    </div>
                    <button
                      className={`dissection-layer-toggle-btn ${isVisible ? 'is-visible' : 'is-peeled'}`}
                      onClick={() => toggleDissectionLayer(layer)}
                      aria-label={`${isVisible ? 'Peel away' : 'Reveal'} ${layer.name}`}
                    >
                      {isVisible ? (
                        <>
                          <Eye size={13} />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} />
                          <span>Peeled Away</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: 3D Cross-Section (Planar Clipping Plane) */}
          {dissectionTab === 'cross-section' && (
            <div className="dissection-cross-section-box">
              <div className="cross-section-top-controls">
                <div className="cross-section-enable-toggle">
                  <Switch
                    checked={clippingState.enabled}
                    onCheckedChange={enabled => updateClipping({ enabled })}
                    aria-label="Enable 3D planar cross-section clipping"
                  />
                  <span>Planar Cross-Section Cut</span>
                </div>

                <div className="cross-section-plane-selector" role="radiogroup" aria-label="Clipping Orientation">
                  {(['axial', 'sagittal', 'coronal'] as ClippingOrientation[]).map(ori => (
                    <button
                      key={ori}
                      className={`plane-selector-btn ${clippingState.orientation === ori ? 'active' : ''}`}
                      onClick={() => updateClipping({ orientation: ori, enabled: true })}
                      aria-label={`Cut plane orientation ${ori}`}
                    >
                      {ori === 'axial' ? 'Axial (Y)' : ori === 'sagittal' ? 'Sagittal (X)' : 'Coronal (Z)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Row */}
              <div className="cross-section-slider-row">
                <div className="cross-section-slider-header">
                  <span>
                    Cut Position ({clippingState.orientation === 'axial' ? 'Superior / Inferior' : clippingState.orientation === 'sagittal' ? 'Lateral / Medial' : 'Anterior / Posterior'})
                  </span>
                  <span className="cross-section-slider-readout">
                    {Math.round(clippingState.offset)}%
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[clippingState.offset]}
                  disabled={!clippingState.enabled}
                  onValueChange={v => updateClipping({ offset: Array.isArray(v) ? v[0] : v })}
                  aria-label="Cross-section cut depth position"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="cross-section-actions-row">
                <button
                  className="dissection-action-btn"
                  onClick={() => updateClipping({ inverted: !clippingState.inverted })}
                  title="Invert clipping normal to reveal opposing anatomical half"
                >
                  <RotateCw size={13} />
                  <span>Flip Cut Direction ({clippingState.inverted ? 'Inverted' : 'Standard'})</span>
                </button>
                <button
                  className="dissection-action-btn"
                  onClick={resetClipping}
                  title="Reset clipping plane to default thoracic position"
                >
                  <RotateCcw size={13} />
                  <span>Reset Plane</span>
                </button>
              </div>

              {/* Disclaimer */}
              <div className="cross-section-disclaimer">
                <Info size={14} className="cross-section-disclaimer-icon" />
                <span>
                  Rendering-based planar cutaway via Three.js GPU local clipping planes. Non-destructive anatomical cross-section with double-sided interior surface rendering.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RIGHT SIDEBAR — ANATOMY INSPECTOR */}
      {details && selectedParts.length > 0 && (
        <aside className="inspector-panel glass detail-sheet" aria-label="Anatomical Structure Inspector">
          {/* Header */}
          <div className="inspector-header">
            <div className="inspector-header-top">
              <span className="system-tag">
                <span className="system-indicator" style={{ background: system?.color }} />
                {knowledge ? knowledge.anatomicalSystem.toUpperCase() : system?.name ?? 'ANATOMY'}
              </span>
              <button
                className="inspector-close-btn"
                onClick={() => {
                  setDetails(false);
                  setState(s => ({ ...s, selected: [], isolate: false }));
                }}
                aria-label="Close Inspector"
              >
                <X size={16} />
              </button>
            </div>
            <div className="structure-title-row">
              <h2 className="inspector-structure-title">
                {knowledge?.canonicalName ?? chosen?.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="structure-fma-badge">ID: {chosen?.id}</span>
                {knowledge && (
                  <span className="verification-badge">
                    <CheckCircle2 size={11} /> Verified Entry
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="inspector-actions-bar">
            <button
              className={`action-isolate-btn ${state.isolate ? 'is-active' : ''}`}
              onClick={() => setState(s => ({ ...s, isolate: !s.isolate, explode: 0 }))}
            >
              <Focus size={15} />
              {state.isolate ? 'Show Surrounding Anatomy' : 'Isolate Structure'}
            </button>
            <button
              className="action-clear-btn"
              onClick={() => {
                setState(s => ({ ...s, selected: [], isolate: false }));
                setDetails(false);
              }}
            >
              Deselect
            </button>
          </div>

          {/* 4 Tabs: Overview, Anatomy, Function, Clinical Notes */}
          <nav className="inspector-tabs-nav" aria-label="Inspector Information Tabs">
            <button
              className={`inspector-tab-btn ${inspectorTab === 'overview' ? 'active' : ''}`}
              onClick={() => setInspectorTab('overview')}
            >
              Overview
            </button>
            <button
              className={`inspector-tab-btn ${inspectorTab === 'anatomy' ? 'active' : ''}`}
              onClick={() => setInspectorTab('anatomy')}
            >
              Anatomy
            </button>
            <button
              className={`inspector-tab-btn ${inspectorTab === 'function' ? 'active' : ''}`}
              onClick={() => setInspectorTab('function')}
            >
              Function
            </button>
            <button
              className={`inspector-tab-btn ${inspectorTab === 'clinical' ? 'active' : ''}`}
              onClick={() => setInspectorTab('clinical')}
            >
              Clinical Notes
            </button>
            <button
              className={`inspector-tab-btn ${inspectorTab === 'relationships' ? 'active' : ''}`}
              onClick={() => setInspectorTab('relationships')}
            >
              Relationships {activeConceptRelationships.length > 0 && <span className="tab-count-badge">{activeConceptRelationships.length}</span>}
            </button>
          </nav>

          {/* Tab Body */}
          <div className="inspector-tab-body">
            {/* TAB 1: OVERVIEW */}
            {inspectorTab === 'overview' && (
              <>
                {/* Parent Organ Callout (if clicked sub-part belonging to a major organ) */}
                {parentOrganConcept && (
                  <div className="parent-concept-callout">
                    <p className="parent-concept-text">
                      This piece is a constituent component of <strong>{parentOrganConcept.name}</strong> ({parentOrganConcept.id}).
                    </p>
                    <button
                      className="parent-concept-btn"
                      onClick={() => navigateToConcept(parentOrganConcept.id)}
                    >
                      Inspect {parentOrganConcept.name} <ChevronRight size={13} />
                    </button>
                  </div>
                )}

                <div className="inspector-section">
                  <span className="section-label">
                    <FileText size={13} />
                    Educational Overview
                  </span>
                  <div className="section-card">
                    <p className="prose-text">
                      {knowledge
                        ? knowledge.overview
                        : chosen && selected
                        ? explanation(chosen.name, selected.system)
                        : 'Educational monograph not yet compiled for this specific substructure.'}
                    </p>
                  </div>
                </div>

                {knowledge?.location && (
                  <div className="inspector-section">
                    <span className="section-label">
                      <MapPin size={13} />
                      Anatomical Location
                    </span>
                    <div className="section-card">
                      <p className="prose-text">{knowledge.location}</p>
                    </div>
                  </div>
                )}

                <div className="inspector-section">
                  <span className="section-label">Specifications</span>
                  <div className="meta-grid">
                    <div className="meta-item">
                      <span className="meta-item-label">Atlas Ref</span>
                      <span className="meta-item-value mono">{chosen?.id}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-item-label">System</span>
                      <span className="meta-item-value">{knowledge ? knowledge.anatomicalSystem : system?.name}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-item-label">Mesh Pieces</span>
                      <span className="meta-item-value mono">{state.selected.length}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-item-label">Bounding Extents</span>
                      <span className="meta-item-value mono">
                        {boundsDimensions
                          ? `${boundsDimensions.w} × ${boundsDimensions.h} × ${boundsDimensions.d} cm`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {knowledge?.sources && knowledge.sources.length > 0 && (
                  <div className="inspector-section">
                    <span className="section-label">
                      <BookOpen size={13} />
                      Authoritative Sources & Citations
                    </span>
                    <div className="source-citations-list">
                      {knowledge.sources.map((s, idx) => (
                        <a
                          key={idx}
                          className="source-card-item"
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div>
                            <div>{s.title}</div>
                            {s.authoritativeBody && (
                              <span className="source-meta-tag">{s.authoritativeBody}</span>
                            )}
                          </div>
                          <ArrowUpRight size={13} style={{ flexShrink: 0 }} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  className="source-citation-link"
                  href="https://lifesciencedb.jp/bp3d/"
                  target="_blank"
                  rel="noreferrer"
                >
                  View BodyParts3D Source Database <ArrowUpRight size={13} />
                </a>
              </>
            )}

            {/* TAB 2: ANATOMY */}
            {inspectorTab === 'anatomy' && (
              <>
                {knowledge?.anatomicalFeatures && knowledge.anatomicalFeatures.length > 0 && (
                  <div className="inspector-section">
                    <span className="section-label">
                      <Boxes size={13} />
                      Anatomical Architecture & Features
                    </span>
                    <div className="features-list">
                      {knowledge.anatomicalFeatures.map((feat, idx) => (
                        <div key={idx} className="feature-item">
                          <span className="feature-bullet" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Structures with Click-to-Navigate (Phase 5) */}
                {knowledge?.relatedStructures && knowledge.relatedStructures.length > 0 && (
                  <div className="inspector-section">
                    <span className="section-label">
                      <ChevronRight size={13} />
                      Related Anatomical Structures ({knowledge.relatedStructures.length})
                    </span>
                    <div className="related-structures-list">
                      {knowledge.relatedStructures.map(rel => (
                        <button
                          key={rel.conceptId}
                          className="related-struct-btn"
                          onClick={() => navigateToConcept(rel.conceptId)}
                          title={`Select ${rel.name} in 3D viewer`}
                        >
                          <div className="related-info">
                            <span className="related-name">{rel.name}</span>
                            <span className="related-rel-badge">{rel.relationship}</span>
                          </div>
                          <ArrowUpRight size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedParts.length > 1 ? (
                  <div className="inspector-section">
                    <span className="section-label">
                      <Boxes size={13} />
                      Constituent Structures ({selectedParts.length})
                    </span>
                    <div className="member-list-wrap">
                      {selectedParts.map(p => (
                        <button
                          key={p.id}
                          className="member-part-btn"
                          onClick={() => choosePart(p.id)}
                          title={`Focus on ${p.name}`}
                        >
                          <span>{p.name}</span>
                          <ChevronRight size={13} />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="inspector-section">
                    <span className="section-label">
                      <Boxes size={13} />
                      Mesh Geometry
                    </span>
                    <div className="section-card">
                      <p className="prose-text">
                        Single continuous anatomical mesh modeled in the BodyParts3D 4.0 adult male reference dataset.
                      </p>
                      {selected && (
                        <div className="meta-grid" style={{ marginTop: '10px' }}>
                          <div className="meta-item">
                            <span className="meta-item-label">Vertices</span>
                            <span className="meta-item-value mono">
                              {selected.vertexCount.toLocaleString()}
                            </span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-item-label">Triangles</span>
                            <span className="meta-item-value mono">
                              {Math.round(selected.indexCount / 3).toLocaleString()}
                            </span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-item-label">Center Point</span>
                            <span className="meta-item-value mono">
                              {boundsDimensions
                                ? `(${boundsDimensions.cx}, ${boundsDimensions.cy}, ${boundsDimensions.cz}) m`
                                : '—'}
                            </span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-item-label">Coordinate Chunk</span>
                            <span className="meta-item-value mono">Chunk #{selected.chunk}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB 3: FUNCTION */}
            {inspectorTab === 'function' && (
              <>
                {knowledge?.function ? (
                  <div className="inspector-section">
                    <span className="section-label">
                      <HeartPulse size={13} />
                      Physiological Function & Mechanism
                    </span>
                    <div className="section-card">
                      <p className="prose-text">{knowledge.function}</p>
                    </div>
                  </div>
                ) : chosen && EXPLANATIONS[chosen.name.toLowerCase()] ? (
                  <div className="inspector-section">
                    <span className="section-label">
                      <HeartPulse size={13} />
                      Physiological Summary
                    </span>
                    <div className="section-card">
                      <p className="prose-text">{EXPLANATIONS[chosen.name.toLowerCase()]}</p>
                    </div>
                  </div>
                ) : (
                  <div className="empty-tab-state">
                    <Activity size={26} className="empty-tab-icon" />
                    <h3 className="empty-tab-title">Function Data Not Available</h3>
                    <p className="empty-tab-desc">
                      Verified physiological function data is not currently recorded for this specific structure in the reference catalog.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* TAB 4: CLINICAL NOTES */}
            {inspectorTab === 'clinical' && (
              <>
                <div className="medical-disclaimer-pill">
                  <ShieldAlert size={14} style={{ flexShrink: 0 }} />
                  <span>Educational Reference Only · Not Medical Advice</span>
                </div>

                {knowledge?.clinicalNotes ? (
                  <div className="inspector-section">
                    <span className="section-label">
                      <Stethoscope size={13} />
                      Clinical Significance & Pathology
                    </span>
                    <div className="section-card">
                      <p className="prose-text">{knowledge.clinicalNotes}</p>
                    </div>
                  </div>
                ) : (
                  <div className="empty-tab-state">
                    <Stethoscope size={26} className="empty-tab-icon" />
                    <h3 className="empty-tab-title">Clinical Notes Not Available</h3>
                    <p className="empty-tab-desc">
                      Clinical and pathological annotations are not part of the standard BodyParts3D 4.0 reference geometry for this structure ({chosen?.id}).
                    </p>
                  </div>
                )}
              </>
            )}

            {/* TAB 5: RELATIONSHIPS */}
            {inspectorTab === 'relationships' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div className="inspector-badge" style={{ margin: 0 }}>
                    <Network size={12} />
                    <span>Verified Connections ({activeConceptRelationships.length})</span>
                  </div>
                  {activeConceptRelationships.length > 0 && (
                    <button
                      className="rel-open-graph-btn"
                      onClick={() => openRelationshipExplorer(chosen?.id || '')}
                      title="Open Interactive Graph View"
                    >
                      <Share2 size={13} />
                      <span>Explore Graph</span>
                    </button>
                  )}
                </div>

                {activeConceptRelationships.length > 0 ? (
                  <div className="inspector-section">
                    {(['structural', 'spatial', 'circulatory', 'functional'] as RelationshipCategory[]).map(catKey => {
                      const rels = activeConceptRelationships.filter(r => r.category === catKey);
                      if (rels.length === 0) return null;
                      const catInfo = RELATIONSHIP_CATEGORY_LABELS[catKey];
                      return (
                        <div key={catKey} className="rel-cat-group">
                          <span className="section-label" style={{ marginBottom: '6px' }}>
                            <span className="rel-cat-dot" style={{ backgroundColor: catInfo.color }} />
                            {catInfo.label} Relationships ({rels.length})
                          </span>
                          <div className="rel-cards-list">
                            {rels.map(({ rel, isOutgoing, otherConceptId, otherConceptName }) => {
                              const hiddenInfo = isConceptHiddenIn3D(otherConceptId);
                              return (
                                <div key={rel.id} className="rel-card">
                                  <div className="rel-card-header">
                                    <span className="rel-type-tag" style={{ borderLeftColor: catInfo.color }}>
                                      {getRelDirectionalLabel(rel.type, isOutgoing)}
                                    </span>
                                    <span className="rel-badge-kind">{rel.sourceKind === 'atlas' ? 'Atlas' : 'Verified'}</span>
                                  </div>
                                  <div className="rel-target-title">
                                    <strong>{otherConceptName}</strong>
                                    <span className="rel-target-id">({otherConceptId})</span>
                                  </div>
                                  <p className="rel-card-explanation">{rel.explanation}</p>
                                  <div className="rel-card-citation">
                                    <BookOpen size={11} style={{ flexShrink: 0 }} />
                                    <span>{rel.sourceReference}</span>
                                  </div>
                                  <div className="rel-card-actions">
                                    <button
                                      className="rel-card-action-btn primary"
                                      onClick={() => {
                                        navigateToConcept(otherConceptId);
                                      }}
                                    >
                                      <Eye size={12} />
                                      <span>Select in 3D</span>
                                    </button>
                                    <button
                                      className="rel-card-action-btn"
                                      onClick={() => openRelationshipExplorer(otherConceptId)}
                                    >
                                      <Network size={12} />
                                      <span>Graph</span>
                                    </button>
                                    {hiddenInfo.isHidden && hiddenInfo.system && (
                                      <button
                                        className="rel-card-action-btn reveal"
                                        onClick={() => revealSystemIn3D(hiddenInfo.system!)}
                                        title={`System '${hiddenInfo.systemName}' is currently hidden. Click to reveal in 3D.`}
                                      >
                                        <AlertTriangle size={12} />
                                        <span>Reveal ({hiddenInfo.systemName})</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-tab-state">
                    <Network size={26} className="empty-tab-icon" />
                    <h3 className="empty-tab-title">No Verified Relationships Recorded</h3>
                    <p className="empty-tab-desc">
                      There are currently no verified structural, spatial, or circulatory relationships curated for <strong>{chosen?.name}</strong> ({chosen?.id}).
                    </p>
                    <p className="empty-tab-desc" style={{ marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                      Relationships are strictly limited to authoritative, verified anatomical records to prevent inaccuracies.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>
      )}

      {/* Loading Progress State */}
      {progress < 100 && !error && (
        <div className="loading-overlay glass" role="status">
          <Activity size={22} className="text-teal-400 animate-spin" />
          <div className="loading-info">
            <h4 className="loading-title">Loading 3D Anatomy</h4>
            <div className="loading-detail">
              {progress}% · Preparing {atlas?.parts.length.toLocaleString() ?? '2,234'} anatomical structures
            </div>
            <div className="loading-progress-bar">
              <div className="loading-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Error Alert State */}
      {error && (
        <div className="error-overlay glass" role="alert">
          <p className="error-text">{error}</p>
          <button className="reload-btn" onClick={() => location.reload()}>
            Reload Viewer
          </button>
        </div>
      )}

      {/* About Drawer */}
      <Sheet open={about} onOpenChange={setAbout}>
        <SheetContent className="about-sheet glass">
          <div className="brand-eyebrow">SOURCE & SCOPE</div>
          <SheetTitle>Human Atlas 3D</SheetTitle>
          <SheetDescription>
            High-fidelity interactive reference anatomy based on BodyParts3D.
          </SheetDescription>
          <div className="about-copy">
            <p>
              <strong>Adult Male · BodyParts3D 4.0</strong>
              <br />
              2,234 individually modeled polygonal meshes, 15 physiological systems, and 3,432 ontological concepts.
            </p>
            <p>
              This atlas provides a web-optimized 3D spatial reference. Meshes are grouped into ontological concepts; each source geometry is rendered with normalized vertex normals and real-time GPU displacement.
            </p>
            <p>
              Colors and system groupings are designed for exploration and educational visualization. This is a morphological reference, not a diagnostic or surgical instrument.
            </p>
            <h3>Dataset Attribution</h3>
            <p>
              BodyParts3D, © The Database Center for Life Science (DBCLS), licensed under Creative Commons Attribution 4.0 International.
            </p>
            <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer">
              Dataset License <ArrowUpRight size={13} />
            </a>
            <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noreferrer">
              Original Geometry & Metadata <ArrowUpRight size={13} />
            </a>
            <a href="https://academic.oup.com/nar/article/37/suppl_1/D782/1000752" target="_blank" rel="noreferrer">
              Read Scientific Publication <ArrowUpRight size={13} />
            </a>
          </div>
        </SheetContent>
      </Sheet>

      {/* Guided Explorations Library Modal */}
      {guidesOpen && (
        <div
          className="guides-modal-overlay"
          onClick={() => setGuidesOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Guided Anatomy Explorations"
        >
          <div className="guides-modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="guides-modal-header">
              <div className="guides-modal-title-wrap">
                <div className="brand-eyebrow">
                  <Compass size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  CURATED MODULES
                </div>
                <h2 className="guides-modal-title">
                  Guided Anatomy Explorations
                </h2>
                <p className="guides-modal-subtitle">
                  Follow structured interactive walkthroughs synchronizing 3D anatomical models, optimal camera viewpoints, and peer-reviewed educational monographs.
                </p>
              </div>
              <button
                className="guides-modal-close"
                onClick={() => setGuidesOpen(false)}
                aria-label="Close Guide Library"
              >
                <X size={18} />
              </button>
            </div>

            <div className="guides-grid">
              {GUIDED_EXPLORATIONS.map(guide => (
                <div key={guide.id} className="guide-card">
                  <div className="guide-card-top">
                    <div className="guide-card-badges">
                      <span className={`guide-diff-badge guide-diff-${guide.difficulty.toLowerCase()}`}>
                        {guide.difficulty}
                      </span>
                      <span className="guide-meta-pill">⏱ {guide.estimatedMinutes} mins</span>
                      <span className="guide-meta-pill">{guide.steps.length} Steps</span>
                    </div>
                    <h3 className="guide-card-title">{guide.title}</h3>
                    <p className="guide-card-desc">{guide.description}</p>

                    <div className="guide-card-steps-preview">
                      <span className="guide-steps-preview-label">Step Sequence</span>
                      <div className="guide-steps-preview-list">
                        {guide.steps.map((s, idx) => (
                          <div key={s.id} className="guide-step-preview-item">
                            <span className="guide-step-preview-num">{idx + 1}.</span>
                            <span>{s.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className="guide-card-start-btn"
                    onClick={() => startGuide(guide)}
                    aria-label={`Start ${guide.title}`}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Start Exploration</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Learning Setup Modal */}
      {learningSetupOpen && (
        <div
          className="guides-modal-overlay"
          onClick={() => setLearningSetupOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Learning Mode Setup"
        >
          <div className="learning-setup-modal-content glass" onClick={e => e.stopPropagation()}>
            <div className="guides-modal-header">
              <div className="guides-modal-title-wrap">
                <div className="brand-eyebrow">
                  <GraduationCap size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  KNOWLEDGE TESTING
                </div>
                <h2 className="guides-modal-title">
                  Interactive Learning Mode
                </h2>
                <p className="guides-modal-subtitle">
                  Challenge yourself with 3D structure location challenges and peer-reviewed multiple-choice questions.
                </p>
              </div>
              <button
                className="guides-modal-close"
                onClick={() => setLearningSetupOpen(false)}
                aria-label="Close Learning Setup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Category selection */}
            <div className="learning-setup-section">
              <span className="learning-setup-label">Anatomical Focus</span>
              <div className="learning-chips-grid">
                {[
                  { id: 'all', label: 'All Systems (Comprehensive Mix)' },
                  { id: 'cardiopulmonary', label: 'Cardiopulmonary (Heart & Lungs)' },
                  { id: 'skeletal', label: 'Skeletal Framework' },
                  { id: 'visceral', label: 'Visceral Organs (Digestive & Urinary)' },
                  { id: 'neuro', label: 'Nervous System' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    className={`learning-chip-btn ${sessionConfig.category === cat.id ? 'active' : ''}`}
                    onClick={() => setSessionConfig(c => ({ ...c, category: cat.id as any }))}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selection */}
            <div className="learning-setup-section">
              <span className="learning-setup-label">Difficulty Level</span>
              <div className="learning-chips-grid">
                {[
                  { id: 'all', label: 'All Levels' },
                  { id: 'Beginner', label: 'Beginner' },
                  { id: 'Intermediate', label: 'Intermediate' }
                ].map(diff => (
                  <button
                    key={diff.id}
                    className={`learning-chip-btn ${sessionConfig.difficulty === diff.id ? 'active' : ''}`}
                    onClick={() => setSessionConfig(c => ({ ...c, difficulty: diff.id as any }))}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count selection */}
            <div className="learning-setup-section">
              <span className="learning-setup-label">Session Length</span>
              <div className="learning-chips-grid">
                {[
                  { count: 5, label: '5 Questions (Quick)' },
                  { count: 8, label: '8 Questions (Standard)' },
                  { count: 18, label: 'All Available' }
                ].map(len => (
                  <button
                    key={len.count}
                    className={`learning-chip-btn ${sessionConfig.questionCount === len.count ? 'active' : ''}`}
                    onClick={() => setSessionConfig(c => ({ ...c, questionCount: len.count }))}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="learning-start-btn"
              onClick={() => startLearningSession(sessionConfig)}
            >
              <Play size={15} fill="currentColor" />
              <span>Start Learning Challenge</span>
            </button>
          </div>
        </div>
      )}

      {/* Learning Results Modal */}
      {learningResultsOpen && (
        <div
          className="guides-modal-overlay"
          onClick={() => setLearningResultsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Learning Mode Session Results"
        >
          <div className="learning-results-content glass" onClick={e => e.stopPropagation()}>
            <div className="brand-eyebrow">
              <Trophy size={12} style={{ display: 'inline', marginRight: '4px' }} />
              SESSION COMPLETE
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>
              Knowledge Assessment Results
            </h2>

            {/* Score Circle */}
            <div className="learning-score-circle">
              <span className="learning-score-num">
                {score} / {sessionQuestions.length}
              </span>
              <span className="learning-score-sub">
                {Math.round((score / Math.max(1, sessionQuestions.length)) * 100)}%
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              {score === sessionQuestions.length
                ? 'Outstanding mastery! You answered every question correctly.'
                : score >= sessionQuestions.length * 0.7
                ? 'Great job! Strong anatomical knowledge demonstrated.'
                : 'Good effort! Review the structures and explanations below to strengthen your understanding.'}
            </p>

            {/* Stats Breakdown */}
            <div className="learning-results-stats-row">
              <div className="learning-stat-card">
                <span className="learning-stat-val">{sessionQuestions.length}</span>
                <span className="learning-stat-lbl">Questions</span>
              </div>
              <div className="learning-stat-card">
                <span className="learning-stat-val" style={{ color: '#34d399' }}>{score}</span>
                <span className="learning-stat-lbl">Correct</span>
              </div>
              <div className="learning-stat-card">
                <span className="learning-stat-val" style={{ color: '#f87171' }}>{sessionQuestions.length - score}</span>
                <span className="learning-stat-lbl">Incorrect</span>
              </div>
            </div>

            {/* Question Review List */}
            <div className="learning-review-list">
              {sessionQuestions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCorrect = ans?.isCorrect ?? false;
                return (
                  <div
                    key={q.id}
                    className={`learning-review-item ${isCorrect ? 'was-correct' : 'was-incorrect'}`}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                        {idx + 1}. {q.title}
                      </div>
                      <div style={{ color: isCorrect ? '#34d399' : '#f87171', fontSize: '11px' }}>
                        {isCorrect ? '✓ Correct' : `✗ Missed (Correct: ${q.correctAnswer})`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                className="learning-start-btn"
                onClick={() => {
                  setLearningResultsOpen(false);
                  setLearningSetupOpen(true);
                }}
              >
                <RotateCcw size={14} />
                <span>New Session</span>
              </button>
              <button
                className="guide-nav-btn guide-nav-btn-prev"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setLearningResultsOpen(false)}
              >
                Return to Explorer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anatomical Relationship Explorer Modal */}
      {relationshipsOpen && (
        <div className="rel-modal-overlay" role="dialog" aria-modal="true" aria-label="Anatomical Relationship Explorer">
          <div className="rel-modal-window">
            {/* Header */}
            <div className="rel-modal-header">
              <div className="rel-header-identity">
                <div className="rel-header-icon-box">
                  <Network size={20} className="text-teal-400" />
                </div>
                <div>
                  <div className="rel-modal-title-row">
                    <h2 className="rel-modal-title">Anatomical Relationship Explorer</h2>
                    <span className="rel-badge-curated">Verified Medical Data</span>
                  </div>
                  <p className="rel-modal-subtitle">
                    Interactive relational atlas mapping structural, circulatory, spatial, and functional dependencies between anatomical organs.
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="rel-header-controls">
                {/* View Mode Toggle: Graph vs List */}
                <div className="rel-view-toggle-group">
                  <button
                    className={`rel-view-toggle-btn ${relationshipViewMode === 'graph' ? 'active' : ''}`}
                    onClick={() => setRelationshipViewMode('graph')}
                    title="Interactive Node-Edge Graph View"
                  >
                    <Share2 size={13} />
                    <span>Graph</span>
                  </button>
                  <button
                    className={`rel-view-toggle-btn ${relationshipViewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setRelationshipViewMode('list')}
                    title="Categorized List View"
                  >
                    <FileText size={13} />
                    <span>List</span>
                  </button>
                </div>

                {/* Graph Level / Expansion Toggle */}
                {relationshipViewMode === 'graph' && (
                  <button
                    className={`rel-depth-toggle-btn ${relationshipDepth === 2 ? 'active' : ''}`}
                    onClick={() => setRelationshipDepth(d => d === 1 ? 2 : 1)}
                    title={relationshipDepth === 1 ? 'Expand graph to show secondary (+1 level) neighbor connections' : 'Collapse graph to direct 1st-level connections'}
                  >
                    <Boxes size={13} />
                    <span>Level {relationshipDepth} {relationshipDepth === 1 ? '(+ Expand)' : '(Collapse)'}</span>
                  </button>
                )}

                {/* Return to Root Button */}
                {relationshipActiveConceptId !== relationshipRootConceptId && (
                  <button
                    className="rel-return-root-btn"
                    onClick={() => {
                      setRelationshipActiveConceptId(relationshipRootConceptId);
                      setSelectedEdge(null);
                      setSelectedGraphNodeId(relationshipRootConceptId);
                    }}
                    title="Return to the initial organ chosen when opening Explorer"
                  >
                    <RotateCcw size={13} />
                    <span>Return to Root</span>
                  </button>
                )}

                {/* Close Button */}
                <button
                  className="rel-close-btn"
                  onClick={() => setRelationshipsOpen(false)}
                  title="Close Explorer (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Hub Navigator Strip */}
            <div className="rel-hub-strip">
              <span className="rel-hub-label">Quick Hubs:</span>
              {[
                { id: 'FMA7088', name: 'Heart' },
                { id: 'FMA3736', name: 'Ascending Aorta' },
                { id: 'FMA50801', name: 'Brain' },
                { id: 'FMA7148', name: 'Stomach' },
                { id: 'FMA7197', name: 'Liver' },
                { id: 'FMA7203', name: 'Kidneys' },
                { id: 'FMA7195', name: 'Lungs' },
                { id: 'FMA7394', name: 'Trachea' }
              ].map(hub => {
                const isActive = relationshipActiveConceptId === hub.id;
                return (
                  <button
                    key={hub.id}
                    className={`rel-hub-chip ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setRelationshipActiveConceptId(hub.id);
                      setRelationshipRootConceptId(hub.id);
                      setSelectedGraphNodeId(hub.id);
                      setSelectedEdge(null);
                      navigateToConcept(hub.id);
                    }}
                  >
                    {hub.name}
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="rel-modal-body">
              {/* GRAPH VIEW */}
              {relationshipViewMode === 'graph' ? (
                <div className="rel-graph-workspace">
                  {/* SVG Canvas */}
                  {activeGraphData.edges.length > 0 ? (
                    <div
                      className="rel-graph-viewport"
                      onMouseDown={e => {
                        if (e.button === 0) {
                          setIsPanning(true);
                          panStartRef.current = { x: e.clientX - graphPan.x, y: e.clientY - graphPan.y };
                        }
                      }}
                      onMouseMove={e => {
                        if (isPanning) {
                          setGraphPan({
                            x: e.clientX - panStartRef.current.x,
                            y: e.clientY - panStartRef.current.y
                          });
                        }
                      }}
                      onMouseUp={() => setIsPanning(false)}
                      onMouseLeave={() => setIsPanning(false)}
                    >
                      {/* Zoom & Pan Overlay Toolbar */}
                      <div className="rel-graph-tools">
                        <button
                          className="rel-tool-btn"
                          onClick={() => setGraphZoom(z => Math.min(2.5, +(z + 0.2).toFixed(1)))}
                          title="Zoom In"
                        >
                          <ZoomIn size={14} />
                        </button>
                        <span className="rel-zoom-readout">{Math.round(graphZoom * 100)}%</span>
                        <button
                          className="rel-tool-btn"
                          onClick={() => setGraphZoom(z => Math.max(0.4, +(z - 0.2).toFixed(1)))}
                          title="Zoom Out"
                        >
                          <ZoomOut size={14} />
                        </button>
                        <button
                          className="rel-tool-btn"
                          onClick={() => {
                            setGraphZoom(1);
                            setGraphPan({ x: 0, y: 0 });
                          }}
                          title="Reset View"
                        >
                          <Maximize2 size={13} />
                        </button>
                      </div>

                      {/* Legend */}
                      <div className="rel-graph-legend">
                        {(['structural', 'spatial', 'circulatory', 'functional'] as RelationshipCategory[]).map(catKey => {
                          const catInfo = RELATIONSHIP_CATEGORY_LABELS[catKey];
                          return (
                            <div key={catKey} className="rel-legend-item">
                              <span className="rel-legend-swatch" style={{ backgroundColor: catInfo.color }} />
                              <span>{catInfo.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Render Graph SVG */}
                      {(() => {
                        // Calculate radial layout
                        const svgWidth = 920;
                        const svgHeight = 620;
                        const cx = svgWidth / 2;
                        const cy = svgHeight / 2;

                        const l1Nodes = activeGraphData.nodes.filter(n => n.depth === 1);
                        const l2Nodes = activeGraphData.nodes.filter(n => n.depth === 2);
                        const r1 = 210;
                        const r2 = 330;

                        const nodePos = new Map<string, { x: number; y: number }>();
                        nodePos.set(activeGraphData.centerConceptId, { x: cx, y: cy });

                        // Position Level 1
                        l1Nodes.forEach((node, i) => {
                          const angle = (2 * Math.PI * i) / Math.max(l1Nodes.length, 1) - Math.PI / 2;
                          nodePos.set(node.id, {
                            x: cx + r1 * Math.cos(angle),
                            y: cy + r1 * Math.sin(angle)
                          });
                        });

                        // Position Level 2
                        l2Nodes.forEach((node, j) => {
                          const angle = (2 * Math.PI * (j + 0.5)) / Math.max(l2Nodes.length, 1) - Math.PI / 2;
                          nodePos.set(node.id, {
                            x: cx + r2 * Math.cos(angle),
                            y: cy + r2 * Math.sin(angle)
                          });
                        });

                        return (
                          <svg
                            className="rel-svg-canvas"
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
                          >
                            <defs>
                              <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                              </filter>
                              {/* Colored arrowheads */}
                              {(['structural', 'spatial', 'circulatory', 'functional'] as RelationshipCategory[]).map(cat => (
                                <marker
                                  key={cat}
                                  id={`arrow-${cat}`}
                                  viewBox="0 0 10 10"
                                  refX="8"
                                  refY="5"
                                  markerWidth="6"
                                  markerHeight="6"
                                  orient="auto-start-reverse"
                                >
                                  <path d="M 0 1 L 10 5 L 0 9 z" fill={RELATIONSHIP_CATEGORY_LABELS[cat].color} />
                                </marker>
                              ))}
                            </defs>

                            <g transform={`translate(${graphPan.x}, ${graphPan.y}) scale(${graphZoom})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
                              {/* Draw Edges */}
                              {activeGraphData.edges.map(edge => {
                                const p1 = nodePos.get(edge.source);
                                const p2 = nodePos.get(edge.target);
                                if (!p1 || !p2) return null;

                                const dx = p2.x - p1.x;
                                const dy = p2.y - p1.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < 1) return null;

                                const ux = dx / dist;
                                const uy = dy / dist;

                                const rSrc = edge.source === activeGraphData.centerConceptId ? 38 : 28;
                                const rTgt = edge.target === activeGraphData.centerConceptId ? 38 : 28;

                                const sx = p1.x + ux * rSrc;
                                const sy = p1.y + uy * rSrc;
                                const ex = p2.x - ux * (rTgt + 6);
                                const ey = p2.y - uy * (rTgt + 6);

                                const mx = (p1.x + p2.x) / 2;
                                const my = (p1.y + p2.y) / 2;

                                const isSelected = selectedEdge?.id === edge.id;
                                const catColor = RELATIONSHIP_CATEGORY_LABELS[edge.category]?.color ?? '#38bdf8';
                                const badgeText = RELATIONSHIP_TYPE_LABELS[edge.type]?.badge ?? edge.type;

                                return (
                                  <g key={edge.id} className="rel-graph-edge-group">
                                    {/* Line */}
                                    <line
                                      x1={sx}
                                      y1={sy}
                                      x2={ex}
                                      y2={ey}
                                      stroke={catColor}
                                      strokeWidth={isSelected ? 3.5 : 2}
                                      strokeOpacity={isSelected ? 1 : 0.65}
                                      strokeDasharray={edge.type === 'functionally_related' ? '4 3' : undefined}
                                      markerEnd={`url(#arrow-${edge.category})`}
                                    />
                                    {/* Transparent thicker hit area for clicking edge */}
                                    <line
                                      x1={sx}
                                      y1={sy}
                                      x2={ex}
                                      y2={ey}
                                      stroke="transparent"
                                      strokeWidth={16}
                                      style={{ cursor: 'pointer' }}
                                      onClick={() => setSelectedEdge(edge)}
                                    />
                                    {/* Midpoint Label Badge */}
                                    <g
                                      transform={`translate(${mx}, ${my})`}
                                      onClick={() => setSelectedEdge(edge)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <rect
                                        x={-(badgeText.length * 3.6 + 8)}
                                        y={-10}
                                        width={badgeText.length * 7.2 + 16}
                                        height={20}
                                        rx={10}
                                        ry={10}
                                        fill={isSelected ? '#14b8a6' : '#0f172a'}
                                        stroke={catColor}
                                        strokeWidth={1.5}
                                      />
                                      <text
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill={isSelected ? '#042f2e' : '#f8fafc'}
                                        fontSize={10}
                                        fontWeight={600}
                                        style={{ pointerEvents: 'none' }}
                                      >
                                        {badgeText}
                                      </text>
                                    </g>
                                  </g>
                                );
                              })}

                              {/* Draw Nodes */}
                              {activeGraphData.nodes.map(node => {
                                const pos = nodePos.get(node.id);
                                if (!pos) return null;
                                const isCenter = node.isCenter;
                                const isFocused = selectedGraphNodeId === node.id;
                                const radius = isCenter ? 36 : node.depth === 1 ? 26 : 22;
                                const hiddenInfo = isConceptHiddenIn3D(node.id);

                                return (
                                  <g
                                    key={node.id}
                                    transform={`translate(${pos.x}, ${pos.y})`}
                                    className={`rel-graph-node-group ${isCenter ? 'node-center' : ''}`}
                                    onClick={() => {
                                      setSelectedGraphNodeId(node.id);
                                      navigateToConcept(node.id);
                                    }}
                                    onDoubleClick={() => {
                                      setRelationshipActiveConceptId(node.id);
                                      setSelectedEdge(null);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    {/* Center pulse ring */}
                                    {isCenter && (
                                      <circle
                                        r={radius + 8}
                                        fill="none"
                                        stroke="#14b8a6"
                                        strokeWidth={1.5}
                                        strokeOpacity={0.4}
                                        className="animate-pulse"
                                      />
                                    )}

                                    {/* Selection highlight ring */}
                                    {isFocused && (
                                      <circle
                                        r={radius + 4}
                                        fill="none"
                                        stroke="#f59e0b"
                                        strokeWidth={2.5}
                                        strokeDasharray="3 3"
                                      />
                                    )}

                                    {/* Node Circle */}
                                    <circle
                                      r={radius}
                                      fill={isCenter ? '#0d9488' : '#1e293b'}
                                      stroke={isCenter ? '#2dd4bf' : hiddenInfo.isHidden ? '#f59e0b' : '#475569'}
                                      strokeWidth={isCenter ? 3 : 2}
                                      filter={isCenter ? 'url(#glow-teal)' : undefined}
                                    />

                                    {/* Node Abbr or Icon text inside circle */}
                                    <text
                                      textAnchor="middle"
                                      dominantBaseline="central"
                                      fill={isCenter ? '#ffffff' : '#e2e8f0'}
                                      fontSize={isCenter ? 12 : 11}
                                      fontWeight={700}
                                      style={{ pointerEvents: 'none' }}
                                    >
                                      {node.name.slice(0, isCenter ? 4 : 3).toUpperCase()}
                                    </text>

                                    {/* Node Name Label Pill below */}
                                    <g transform={`translate(0, ${radius + 16})`}>
                                      <rect
                                        x={-(Math.min(node.name.length * 3.8 + 10, 110))}
                                        y={-9}
                                        width={Math.min(node.name.length * 7.6 + 20, 220)}
                                        height={18}
                                        rx={5}
                                        ry={5}
                                        fill="#020617"
                                        fillOpacity={0.85}
                                        stroke={isFocused ? '#f59e0b' : '#334155'}
                                        strokeWidth={1}
                                      />
                                      <text
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fill={isCenter ? '#2dd4bf' : isFocused ? '#fbbf24' : '#f8fafc'}
                                        fontSize={11}
                                        fontWeight={isCenter ? 700 : 500}
                                        style={{ pointerEvents: 'none' }}
                                      >
                                        {node.name.length > 24 ? node.name.slice(0, 22) + '…' : node.name}
                                      </text>
                                    </g>

                                    {/* Hidden badge warning indicator */}
                                    {hiddenInfo.isHidden && (
                                      <g transform={`translate(${radius - 4}, ${-radius + 4})`}>
                                        <circle r={8} fill="#ef4444" />
                                        <text
                                          textAnchor="middle"
                                          dominantBaseline="central"
                                          fill="#ffffff"
                                          fontSize={9}
                                          fontWeight={700}
                                        >
                                          !
                                        </text>
                                      </g>
                                    )}
                                  </g>
                                );
                              })}
                            </g>
                          </svg>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Graph Empty State */
                    <div className="rel-empty-workspace">
                      <Network size={36} className="text-slate-500 mb-3" />
                      <h3 className="rel-empty-title">
                        No Verified Graph Connections Recorded
                      </h3>
                      <p className="rel-empty-desc">
                        No verified structural, spatial, or circulatory relationship records are available for concept ID: <strong>{relationshipActiveConceptId}</strong>.
                      </p>
                      <p className="rel-empty-desc" style={{ marginTop: '6px', fontSize: '12px' }}>
                        Relationships are strictly grounded in authoritative anatomical literature (NCBI StatPearls, Gray's Anatomy) to avoid inaccurate connections.
                      </p>
                      <div className="rel-empty-actions">
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Explore Major Hubs:</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="rel-hub-chip active"
                            onClick={() => {
                              setRelationshipActiveConceptId('FMA7088');
                              navigateToConcept('FMA7088');
                            }}
                          >
                            Heart (Cardiovascular Hub)
                          </button>
                          <button
                            className="rel-hub-chip"
                            onClick={() => {
                              setRelationshipActiveConceptId('FMA50801');
                              navigateToConcept('FMA50801');
                            }}
                          >
                            Brain (CNS Hub)
                          </button>
                          <button
                            className="rel-hub-chip"
                            onClick={() => {
                              setRelationshipActiveConceptId('FMA7148');
                              navigateToConcept('FMA7148');
                            }}
                          >
                            Stomach (Digestive Hub)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected Edge Detail Drawer */}
                  {selectedEdge && (
                    <div className="rel-edge-drawer">
                      <div className="rel-edge-drawer-header">
                        <div className="rel-edge-type-row">
                          <span
                            className="rel-edge-category-pill"
                            style={{
                              backgroundColor: `${RELATIONSHIP_CATEGORY_LABELS[selectedEdge.category].color}25`,
                              borderColor: RELATIONSHIP_CATEGORY_LABELS[selectedEdge.category].color,
                              color: RELATIONSHIP_CATEGORY_LABELS[selectedEdge.category].color
                            }}
                          >
                            {RELATIONSHIP_CATEGORY_LABELS[selectedEdge.category].label}
                          </span>
                          <span className="rel-edge-type-title">
                            {RELATIONSHIP_TYPE_LABELS[selectedEdge.type].label}
                          </span>
                        </div>
                        <button
                          className="rel-edge-drawer-close"
                          onClick={() => setSelectedEdge(null)}
                          title="Dismiss Edge Details"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      {/* Source -> Target Nodes */}
                      <div className="rel-edge-endpoints">
                        <div className="rel-edge-endpoint">
                          <span className="rel-endpoint-role">Source:</span>
                          <strong className="rel-endpoint-name">
                            {atlas?.concepts.find(c => c.id === selectedEdge.source)?.name ?? selectedEdge.source}
                          </strong>
                          <span className="rel-endpoint-id">({selectedEdge.source})</span>
                        </div>
                        <ArrowRight size={14} className="text-slate-400 mx-2" />
                        <div className="rel-edge-endpoint">
                          <span className="rel-endpoint-role">Target:</span>
                          <strong className="rel-endpoint-name">
                            {atlas?.concepts.find(c => c.id === selectedEdge.target)?.name ?? selectedEdge.target}
                          </strong>
                          <span className="rel-endpoint-id">({selectedEdge.target})</span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="rel-edge-explanation">{selectedEdge.explanation}</p>

                      {/* Citation */}
                      <div className="rel-edge-citation">
                        <BookOpen size={12} className="text-teal-400 flex-shrink-0" />
                        <span>{selectedEdge.sourceReference}</span>
                      </div>

                      {/* Actions */}
                      <div className="rel-edge-actions">
                        <button
                          className="rel-card-action-btn primary"
                          onClick={() => navigateToConcept(selectedEdge.source)}
                        >
                          <Eye size={12} />
                          <span>Select Source in 3D</span>
                        </button>
                        <button
                          className="rel-card-action-btn primary"
                          onClick={() => navigateToConcept(selectedEdge.target)}
                        >
                          <Eye size={12} />
                          <span>Select Target in 3D</span>
                        </button>
                        <button
                          className="rel-card-action-btn"
                          onClick={() => {
                            setRelationshipActiveConceptId(selectedEdge.target);
                            setSelectedEdge(null);
                          }}
                        >
                          <Network size={12} />
                          <span>Center Graph on Target</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="rel-list-workspace">
                  <div className="rel-list-header-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} className="text-teal-400" />
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
                        Related Structures for {atlas?.concepts.find(c => c.id === relationshipActiveConceptId)?.name ?? relationshipActiveConceptId}
                      </h3>
                      <span className="rel-badge-kind">{activeGraphData.edges.length} Connections</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Showing verified direct & contextual anatomical relationships
                    </span>
                  </div>

                  {activeGraphData.edges.length > 0 ? (
                    <div className="rel-list-grid">
                      {activeGraphData.edges.map(edge => {
                        const isOutgoing = edge.source === relationshipActiveConceptId;
                        const otherId = isOutgoing ? edge.target : edge.source;
                        const otherConcept = atlas?.concepts.find(c => c.id === otherId);
                        const otherName = otherConcept?.name ?? otherId;
                        const hiddenInfo = isConceptHiddenIn3D(otherId);
                        const catInfo = RELATIONSHIP_CATEGORY_LABELS[edge.category];

                        return (
                          <div key={edge.id} className="rel-list-card">
                            <div className="rel-list-card-top">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  className="rel-type-tag"
                                  style={{ borderLeftColor: catInfo.color }}
                                >
                                  {getRelDirectionalLabel(edge.type, isOutgoing)}
                                </span>
                                <span className="rel-badge-kind">{catInfo.label}</span>
                              </div>
                              <span className="rel-target-id">{otherId}</span>
                            </div>

                            <div className="rel-list-card-name">
                              <strong>{otherName}</strong>
                            </div>

                            <p className="rel-card-explanation">{edge.explanation}</p>

                            <div className="rel-card-citation">
                              <BookOpen size={11} style={{ flexShrink: 0 }} />
                              <span>{edge.sourceReference}</span>
                            </div>

                            <div className="rel-list-card-actions">
                              <button
                                className="rel-card-action-btn primary"
                                onClick={() => navigateToConcept(otherId)}
                              >
                                <Eye size={12} />
                                <span>Select in 3D</span>
                              </button>
                              <button
                                className="rel-card-action-btn"
                                onClick={() => {
                                  setRelationshipActiveConceptId(otherId);
                                  setRelationshipViewMode('graph');
                                }}
                              >
                                <Network size={12} />
                                <span>Graph View</span>
                              </button>
                              {hiddenInfo.isHidden && hiddenInfo.system && (
                                <button
                                  className="rel-card-action-btn reveal"
                                  onClick={() => revealSystemIn3D(hiddenInfo.system!)}
                                  title={`System '${hiddenInfo.systemName}' is currently hidden in 3D. Click to reveal.`}
                                >
                                  <AlertTriangle size={12} />
                                  <span>Reveal ({hiddenInfo.systemName})</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rel-empty-workspace" style={{ height: '300px' }}>
                      <Network size={32} className="text-slate-500 mb-2" />
                      <h4 className="rel-empty-title">No Relationships Available</h4>
                      <p className="rel-empty-desc">
                        No verified relationship records found for {relationshipActiveConceptId}.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="rel-modal-footer">
              <div className="rel-footer-status">
                <span className="rel-status-dot" />
                <span>
                  Active Hub: <strong>{atlas?.concepts.find(c => c.id === relationshipActiveConceptId)?.name ?? relationshipActiveConceptId}</strong> ({relationshipActiveConceptId}) · {activeGraphData.nodes.length} Connected Nodes · {activeGraphData.edges.length} Verified Edges
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="guide-nav-btn guide-nav-btn-prev"
                  onClick={() => setRelationshipsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
