/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Waves, 
  Trophy, 
  RefreshCw, 
  ChevronRight, 
  Info, 
  CheckCircle2, 
  XCircle,
  Fish,
  Anchor,
  Droplets,
  User,
  Download,
  Printer,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Home,
  RotateCcw
} from 'lucide-react';

// --- Types ---
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  fact: string;
}

// --- Constants ---
const QUESTIONS: Question[] = [
  { id: 1, question: "ما هو أكبر حيوان على وجه الأرض؟", options: ["الفيل الأفريقي", "الحوت الأزرق", "القرش الأبيض الكبير", "حوت العنبر"], correctAnswer: 1, fact: "يمكن أن يصل طول الحوت الأزرق إلى 30 متراً ووزنه إلى 180 طناً!" },
  { id: 2, question: "أي من هذه الحيتان يُعرف بـ 'الحوت القاتل'؟", options: ["الحوت الأحدب", "الأوركا", "حوت المرقط", "الحوت الرمادي"], correctAnswer: 1, fact: "الأوركا هي في الواقع أكبر عضو في عائلة الدلافين." },
  { id: 3, question: "كيف تتنفس الحيتان؟", options: ["عن طريق الخياشيم", "عن طريق الجلد", "عن طريق الرئتين (فتحة النفث)", "لا تتنفس تحت الماء"], correctAnswer: 2, fact: "الحيتان ثدييات وتحتاج للصعود للسطح لتنفس الهواء." },
  { id: 4, question: "ما هو الحوت الذي يشتهر بغنائه الطويل والمعقد؟", options: ["الحوت الأحدب", "حوت البالين", "الدلفين", "حوت العنبر"], correctAnswer: 0, fact: "تغني ذكور الحيتان الحدباء أغاني يمكن أن تُسمع على بعد أميال." },
  { id: 5, question: "أي من هذه الحيتان يمتلك 'نابًا' طويلاً يشبه القرن؟", options: ["حوت العنبر", "حوت المرقط (ناروال)", "الحوت الأزرق", "الأوركا"], correctAnswer: 1, fact: "يُلقب الناروال بـ 'وحيد قرن البحر'." },
  { id: 6, question: "هل الحيتان من الثدييات أم الأسماك؟", options: ["أسماك", "ثدييات", "برمائيات", "زواحف"], correctAnswer: 1, fact: "الحيتان ثدييات: تلد وترضع صغارها ولديها دم حار." },
  { id: 7, question: "ما هو الحوت الذي يهاجر لمسافات طويلة جداً؟", options: ["الحوت الرمادي", "القرش الحوت", "الدلفين القاروري", "حوت المنك"], correctAnswer: 0, fact: "يقطع الحوت الرمادي حوالي 20,000 كيلومتر في هجرته السنوية." },
  { id: 8, question: "ماذا تأكل معظم الحيتان الكبيرة (مثل الحوت الأزرق)؟", options: ["الأسماك الكبيرة", "الأعشاب البحرية", "الكريل (قشريات صغيرة)", "الفقمات"], correctAnswer: 2, fact: "تتغذى الحيتان البالينية على الكريل وتصفيها من الماء." },
  { id: 9, question: "ما هو لقب حوت 'البيلوجا' بسبب أصواته المتنوعة؟", options: ["كناري البحر", "مغني المحيط", "ببغاء الماء", "عازف الموج"], correctAnswer: 0, fact: "يُعرف البيلوجا بـ 'كناري البحر' لقدرته العالية على إصدار أصوات متنوعة." },
  { id: 10, question: "أي حوت يمتلك أكبر دماغ بين جميع الكائنات الحية؟", options: ["الحوت الأزرق", "حوت العنبر", "الأوركا", "الحوت الأحدب"], correctAnswer: 1, fact: "حوت العنبر لديه أكبر دماغ، ويزن حوالي 8 كيلوغرامات." },
  { id: 11, question: "ما هي الحاسة التي تستخدمها الدلافين لتحديد المواقع؟", options: ["الشم", "تحديد الموقع بالصدى", "التذوق", "الرؤية الليلية"], correctAnswer: 1, fact: "تستخدم الدلافين الموجات الصوتية لرؤية محيطها بدقة عالية." },
  { id: 12, question: "ما هو الحيوان الذي يُلقب بـ 'بقرة البحر'؟", options: ["خروف البحر (الماناتي)", "الفقمة", "أسد البحر", "الدلفين"], correctAnswer: 0, fact: "الماناتي حيوان مسالم يتغذى على النباتات البحرية." },
  { id: 13, question: "أي حيوان بحري يمتلك أسمك فراء في العالم؟", options: ["الدب القطبي", "قضاعة البحر (Sea Otter)", "الفقمة الرمادية", "البطريق"], correctAnswer: 1, fact: "تمتلك قضاعة البحر حوالي مليون شعرة في البوصة المربعة الواحدة!" },
  { id: 14, question: "هل يُعتبر الدب القطبي من الثدييات البحرية؟", options: ["نعم", "لا", "فقط في الشتاء", "فقط عندما يسبح"], correctAnswer: 0, fact: "يُصنف الدب القطبي كثديي بحري لأنه يعتمد على المحيط المتجمد للغذاء والمأوى." },
  { id: 15, question: "ما هو الفرق الرئيسي بين 'الأطوم' (Dugong) و'خروف البحر'؟", options: ["الحجم", "شكل الذيل", "اللون", "نوع الغذاء"], correctAnswer: 1, fact: "ذيل الأطوم يشبه ذيل الحوت (متشعب)، بينما ذيل خروف البحر يشبه المجداف." },
  { id: 16, question: "ما هو الحوت الذي يمكنه العيش لأكثر من 200 عام؟", options: ["الحوت الأزرق", "حوت القوس الرأسي (Bowhead)", "حوت العنبر", "الأوركا"], correctAnswer: 1, fact: "حوت القوس الرأسي هو أطول الثدييات عمراً على الإطلاق." },
  { id: 17, question: "لماذا سُمي 'الحوت الصائب' (Right Whale) بهذا الاسم؟", options: ["لأنه يسبح لليمين", "لأنه كان الحوت 'الصائب' لصيده قديماً", "لأنه دائماً على حق", "لأنه يعيش في المناطق الصحيحة"], correctAnswer: 1, fact: "سماه الصيادون قديماً بهذا الاسم لأنه بطيء ويطفو بعد موته، مما جعله هدفاً سهلاً." },
  { id: 18, question: "ما هو أصغر أنواع الحيتان البالينية؟", options: ["حوت المنك", "الحوت الأزرق", "الحوت الزعنفي", "حوت ساي"], correctAnswer: 0, fact: "حوت المنك هو الأصغر، لكنه لا يزال كبيراً مقارنة بمعظم الحيوانات البرية." },
  { id: 19, question: "ما هو أندر ثديي بحري في العالم ومعرض للانقراض بشدة؟", options: ["الفقمة الراهبة", "الفاقويتا (Vaquita)", "الدلفين الوردي", "حوت العنبر"], correctAnswer: 1, fact: "الفاقويتا تعيش فقط في شمال خليج كاليفورنيا ولم يتبق منها سوى أعداد قليلة جداً." },
  { id: 20, question: "أي من هذه الثدييات البحرية يمتلك أنياباً طويلة يستخدمها للتسلق على الجليد؟", options: ["الفقمة", "حيوان الفظ (Walrus)", "أسد البحر", "خنزير البحر"], correctAnswer: 1, fact: "يستخدم الفظ أنيابه للدفاع، ولحفر الثقوب في الجليد، وللمساعدة في سحب جسمه الضخم." },
  { id: 21, question: "ما هو أكبر أنواع الفقمات في العالم؟", options: ["فقمة الميناء", "فيل البحر الجنوبي", "فقمة النمر", "الفقمة الرمادية"], correctAnswer: 1, fact: "يمكن أن يزن ذكر فيل البحر الجنوبي أكثر من 4,000 كيلوغرام." },
  { id: 22, question: "أي فقمة تشتهر بكونها مفترسة شرسة وتتغذى على البطاريق؟", options: ["فقمة النمر (Leopard Seal)", "فقمة الفراء", "فقمة الراهب", "فقمة القيثارة"], correctAnswer: 0, fact: "فقمة النمر هي المفترس الرئيسي في القارة القطبية الجنوبية بعد الأوركا." },
  { id: 23, question: "ما هي الثدييات البحرية التي تعيش في المياه العذبة (الأنهار)؟", options: ["الدلفين الوردي (البوتو)", "الحوت الأزرق", "الأوركا", "القرش الأبيض"], correctAnswer: 0, fact: "يعيش الدلفين الوردي في نهر الأمازون وهو متكيف تماماً مع المياه العذبة." },
  { id: 24, question: "ما هو أسرع حوت في المحيط؟", options: ["الحوت الأزرق", "الحوت الزعنفي (Fin Whale)", "حوت العنبر", "الحوت الأحدب"], correctAnswer: 1, fact: "يُلقب الحوت الزعنفي بـ 'كلب سلوقي البحار' لسرعته التي تصل لـ 45 كم/ساعة." },
  { id: 25, question: "كم تبلغ فترة حمل أنثى الحوت الأزرق تقريباً؟", options: ["9 أشهر", "12 شهرًا", "18 شهرًا", "24 شهرًا"], correctAnswer: 1, fact: "تستمر فترة الحمل حوالي سنة واحدة، ويولد الصغير بطول 7 أمتار!" },
  { id: 26, question: "ما هي المادة الشمعية الثمينة التي تُستخرج من أمعاء حوت العنبر وتُستخدم في العطور؟", options: ["الكهرمان", "العنبر الأشهب", "المسك", "المر"], correctAnswer: 1, fact: "العنبر الأشهب مادة نادرة جداً وتستخدم لتثبيت رائحة العطور الفاخرة." },
  { id: 27, question: "أي دلفين يشتهر بحركاته البهلوانية والدوران حول نفسه في الهواء؟", options: ["الدلفين الدوار (Spinner)", "الدلفين القاروري", "دلفين ريسو", "الأوركا"], correctAnswer: 0, fact: "يمكن للدلفين الدوار القيام بـ 7 دورات كاملة في قفزة واحدة." },
  { id: 28, question: "ما هو الحوت الذي يمتلك أكبر زعانف صدرية مقارنة بحجم جسمه؟", options: ["الحوت الأحدب", "الحوت الأزرق", "حوت ساي", "حوت المنك"], correctAnswer: 0, fact: "زعانف الحوت الأحدب الصدرية قد تصل لثلث طول جسمه." },
  { id: 29, question: "هل تنام الحيتان والدلافين بشكل كامل؟", options: ["نعم", "لا، ينام نصف دماغها فقط", "تنام فقط في الشتاء", "لا تنام أبداً"], correctAnswer: 1, fact: "تنام الحيتان بنصف دماغ واحد في كل مرة لتبقى واعية للتنفس ومراقبة الحيوانات المفترسة." },
  { id: 30, question: "ما هو العضو المسؤول عن إنتاج الأصوات في الدلافين؟", options: ["الحنجرة", "البطيخة (Melon)", "فتحة النفث", "الزعانف"], correctAnswer: 2, fact: "تنتج الدلافين الأصوات عبر أكياس هوائية تحت فتحة النفث مباشرة." }
];

// --- Audio Helper ---
const playSound = (type: 'correct' | 'wrong' | 'click') => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (type === 'correct') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.2); // C6
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } else if (type === 'wrong') {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
    oscillator.frequency.linearRampToValueAtTime(110, audioCtx.currentTime + 0.3); // A2
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.4);
  } else {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  }
};

// --- Components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden mb-8">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
    />
  </div>
);

const FloatingBubble = ({ delay = 0, size = 20, left = "50%" }: { delay?: number; size?: number; left?: string; key?: number | string }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 0.5, 0.5, 0],
      x: [0, 20, -20, 0]
    }}
    transition={{ 
      duration: 10 + Math.random() * 10, 
      repeat: Infinity, 
      delay,
      ease: "linear"
    }}
    className="absolute pointer-events-none rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
    style={{ width: size, height: size, left }}
  />
);

export default function App() {
  const [gameState, setGameState] = useState<'start' | 'name' | 'quiz' | 'result'>('start');
  const [userName, setUserName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{question: string, answer: string, correct: boolean, correctAnswer: string}[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showCertificate, setShowCertificate] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const getGuidance = (score: number) => {
    const percentage = (score / QUESTIONS.length) * 100;
    if (percentage >= 90) return "أنت خبير حقيقي في عالم البحار! استمر في شغفك ونشر الوعي عن هذه الكائنات العظيمة.";
    if (percentage >= 70) return "عمل رائع! لديك معلومات قيمة جداً، يمكنك قراءة المزيد لتصبح خبيراً محترفاً.";
    if (percentage >= 50) return "بداية جيدة! عالم الحيتان واسع جداً، حاول استكشاف المزيد من الحقائق في المرة القادمة.";
    return "لا تقلق، التعلم رحلة مستمرة. أعد المحاولة واقرأ 'هل تعلم' جيداً لتطوير معلوماتك.";
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'quiz' && !isPaused && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      // Time's up!
      setIsAnswered(true);
      triggerSound('wrong');
      setUserAnswers(prev => [...prev, {
        question: currentQuestion.question,
        answer: "انتهى الوقت",
        correct: false,
        correctAnswer: currentQuestion.options[currentQuestion.correctAnswer]
      }]);
    }
    return () => clearInterval(timer);
  }, [gameState, isPaused, isAnswered, timeLeft, currentQuestion]);

  const triggerSound = (type: 'correct' | 'wrong' | 'click') => {
    if (soundEnabled) playSound(type);
  };

  const handleStart = () => {
    triggerSound('click');
    setGameState('name');
  };

  const handleBeginQuiz = () => {
    if (!userName.trim()) return;
    triggerSound('click');
    setGameState('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setUserAnswers([]);
    setIsPaused(false);
    setTimeLeft(30);
    setShowCertificate(false);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered || isPaused) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      triggerSound('correct');
    } else {
      triggerSound('wrong');
    }

    setUserAnswers(prev => [...prev, {
      question: currentQuestion.question,
      answer: currentQuestion.options[index],
      correct: isCorrect,
      correctAnswer: currentQuestion.options[currentQuestion.correctAnswer]
    }]);
  };

  const handleNext = () => {
    triggerSound('click');
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      setGameState('result');
    }
  };

  const handleRestart = () => {
    triggerSound('click');
    handleBeginQuiz();
  };

  const handleQuit = () => {
    triggerSound('click');
    setGameState('start');
    setIsPaused(false);
  };

  const downloadResults = () => {
    const content = `
نتائج مسابقة عالم الحيتان
------------------------
اسم المشارك: ${userName}
التاريخ: ${new Date().toLocaleDateString('ar-EG')}
النتيجة النهائية: ${score} من ${QUESTIONS.length}
النسبة المئوية: ${Math.round((score / QUESTIONS.length) * 100)}%

تفاصيل الإجابات:
${userAnswers.map((ua, i) => `${i + 1}. ${ua.question}\n   إجابتك: ${ua.answer} (${ua.correct ? 'صحيحة' : 'خاطئة'})\n`).join('\n')}

شكراً لمشاركتك في استكشاف أعماق البحار!
    `;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `نتائج_مسابقة_الحيتان_${userName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printResults = () => {
    window.print();
  };

  const bubbles = useMemo(() => (
    Array.from({ length: 15 }).map((_, i) => (
      <FloatingBubble 
        key={i} 
        delay={i * 1.5} 
        size={10 + Math.random() * 30} 
        left={`${Math.random() * 100}%`} 
      />
    ))
  ), []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative dir-rtl" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e3a8a_0%,transparent_50%)] opacity-40" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_120%,#0e7490_0%,transparent_50%)] opacity-30" />
        {bubbles}
      </div>

      {/* Top Controls */}
      <div className="fixed top-6 left-6 z-50 flex gap-3 print:hidden">
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 bg-slate-900/50 border border-slate-800 rounded-full text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          title="الصوت"
        >
          {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
        
        {gameState === 'quiz' && (
          <>
            <button 
              onClick={() => { triggerSound('click'); setIsPaused(!isPaused); }}
              className={`p-3 border rounded-full transition-all ${isPaused ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-slate-900/50 border-slate-800 text-cyan-400 hover:bg-cyan-500/10'}`}
              title={isPaused ? "استمرار" : "توقف مؤقت"}
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </button>
            <button 
              onClick={handleRestart}
              className="p-3 bg-slate-900/50 border border-slate-800 rounded-full text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              title="إعادة التشغيل"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-12 pb-24 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="mb-8 relative inline-block">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Waves className="w-24 h-24 text-cyan-400 mx-auto mb-4" />
                </motion.div>
                <div className="absolute -top-2 -right-2">
                  <Droplets className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-300">
                عالم الحيتان
              </h1>
              <p className="text-xl text-cyan-100/70 mb-12 max-w-md mx-auto leading-relaxed">
                اختبر معلوماتك في 30 سؤالاً عن أضخم الكائنات التي تعيش في أعماق البحار والمحيطات.
              </p>

              <div className="mb-12">
                <button
                  onClick={handleStart}
                  className="group relative px-12 py-4 bg-cyan-500 text-slate-950 font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <span className="relative z-10 flex items-center gap-2 text-xl">
                    ابدأ المغامرة
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <div className="mt-8 text-cyan-400/60 font-medium">
                من تصميم جمعية أبطال الفنيدق
              </div>
            </motion.div>
          )}

          {gameState === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-md text-center"
            >
              <User className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-8 text-white">مرحباً بك أيها المستكشف!</h2>
              <div className="relative mb-8">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="اكتب اسمك هنا..."
                  className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-6 py-4 text-xl text-center focus:border-cyan-500 outline-none transition-all placeholder:text-slate-600 text-white"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleBeginQuiz()}
                />
              </div>
              <button
                onClick={handleBeginQuiz}
                disabled={!userName.trim()}
                className="w-full py-4 bg-cyan-500 text-slate-950 font-bold rounded-2xl text-xl hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                بدء المسابقة
              </button>
            </motion.div>
          )}

          {gameState === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                  <span className="text-cyan-400 font-mono text-sm tracking-tighter">
                    السؤال {currentQuestionIndex + 1} / {QUESTIONS.length}
                  </span>
                  <span className="text-xs text-slate-500">المستكشف: {userName}</span>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`text-2xl font-black font-mono transition-colors ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`}>
                    {timeLeft}s
                  </div>
                  <span className="text-slate-400 text-sm">
                    النتيجة: {score}
                  </span>
                </div>
              </div>
              <ProgressBar current={currentQuestionIndex + 1} total={QUESTIONS.length} />

              <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight text-white">
                {currentQuestion.question}
              </h2>

              <div className="grid gap-4 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const isSelected = index === selectedOption;
                  
                  let buttonClass = "w-full p-5 text-right rounded-2xl border transition-all duration-300 flex items-center justify-between group ";
                  
                  if (!isAnswered) {
                    buttonClass += "bg-slate-900/50 border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/5";
                  } else {
                    if (isCorrect) {
                      buttonClass += "bg-emerald-500/20 border-emerald-500 text-emerald-100";
                    } else if (isSelected) {
                      buttonClass += "bg-rose-500/20 border-rose-500 text-rose-100";
                    } else {
                      buttonClass += "bg-slate-900/30 border-slate-800 opacity-50";
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={!isAnswered ? { x: -4 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered || isPaused}
                      className={buttonClass}
                    >
                      <span className="text-lg font-medium">{option}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-rose-400" />}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex gap-4 items-start">
                      <div className="p-2 bg-cyan-500/20 rounded-lg shrink-0">
                        <Info className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-bold mb-1">هل تعلم؟</h4>
                        <p className="text-cyan-100/80 leading-relaxed">
                          {currentQuestion.fact}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleNext}
                      className="w-full py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-cyan-100 transition-colors flex items-center justify-center gap-2 text-lg"
                    >
                      {currentQuestionIndex === QUESTIONS.length - 1 ? "عرض النتيجة" : "السؤال التالي"}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full max-w-2xl print:max-w-full"
            >
              <div className="print:hidden">
                {!showCertificate ? (
                  <>
                    <div className="mb-8 relative inline-block">
                      <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
                      <Trophy className="w-24 h-24 text-yellow-400 mx-auto relative z-10" />
                    </div>

                    <h2 className="text-4xl font-bold mb-2 text-white">أحسنت يا {userName}!</h2>
                    <p className="text-cyan-100/60 mb-8 text-lg">لقد أتممت رحلة الاستكشاف بنجاح.</p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mb-8 backdrop-blur-xl">
                      <div className="text-6xl font-black text-white mb-2">
                        {score} <span className="text-2xl text-slate-500 font-normal">/ {QUESTIONS.length}</span>
                      </div>
                      <div className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6">إجمالي النقاط</div>
                      
                      <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 mb-6">
                        <h4 className="text-cyan-400 font-bold mb-2 flex items-center justify-center gap-2">
                          <Info className="w-4 h-4" />
                          توجيهات للمستكشف
                        </h4>
                        <p className="text-cyan-100/80 text-sm italic">
                          "{getGuidance(score)}"
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-800 flex justify-around">
                        <div>
                          <div className="text-2xl font-bold text-white">{Math.round((score / QUESTIONS.length) * 100)}%</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider">الدقة</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{QUESTIONS.length}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider">الأسئلة</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-8 text-right">
                      <h3 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        مراجعة الإجابات
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {userAnswers.map((ua, i) => (
                          <div key={i} className={`p-4 rounded-xl border ${ua.correct ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                            <p className="text-sm font-bold text-white mb-1">{i + 1}. {ua.question}</p>
                            <div className="flex justify-between text-xs">
                              <span className={ua.correct ? 'text-emerald-400' : 'text-rose-400'}>
                                إجابتك: {ua.answer}
                              </span>
                              {!ua.correct && (
                                <span className="text-emerald-400">
                                  الصحيحة: {ua.correctAnswer}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button
                        onClick={() => setShowCertificate(true)}
                        className="py-4 bg-cyan-500 text-slate-950 font-bold rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                      >
                        <Trophy className="w-5 h-5" />
                        عرض الشهادة
                      </button>
                      <button
                        onClick={downloadResults}
                        className="py-4 bg-slate-900 border border-slate-800 text-cyan-400 font-bold rounded-2xl hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        تحميل النتائج
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mb-8">
                    <div className="bg-white text-slate-950 p-12 rounded-lg border-[12px] border-double border-cyan-600 relative overflow-hidden shadow-2xl">
                      {/* Certificate Background Pattern */}
                      <div className="absolute inset-0 opacity-5 pointer-events-none">
                        <Waves className="w-full h-full scale-150" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-8">
                          <Waves className="w-12 h-12 text-cyan-600" />
                          <div className="text-center">
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-cyan-800">شهادة تقدير</h1>
                            <p className="text-xs text-slate-500">مسابقة عالم الحيتان</p>
                          </div>
                          <Trophy className="w-12 h-12 text-yellow-500" />
                        </div>

                        <div className="my-12">
                          <p className="text-lg mb-2">نشهد أن المستكشف البطل</p>
                          <h2 className="text-4xl font-black text-cyan-700 mb-4 underline decoration-cyan-200 underline-offset-8">{userName}</h2>
                          <p className="text-lg leading-relaxed">
                            قد أتم بنجاح مسابقة "عالم الحيتان" التعليمية<br />
                            بنتيجة مشرفة بلغت <span className="font-bold text-cyan-600">{score} من {QUESTIONS.length}</span>
                          </p>
                        </div>

                        <div className="flex justify-between items-end mt-16">
                          <div className="text-right">
                            <p className="text-xs text-slate-400 mb-1">التاريخ</p>
                            <p className="font-bold border-b border-slate-200 pb-1">{new Date().toLocaleDateString('ar-EG')}</p>
                          </div>
                          <div className="text-center">
                            <div className="w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center border-4 border-cyan-100 mb-2">
                              <CheckCircle2 className="w-12 h-12 text-cyan-500" />
                            </div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">ختم التميز</p>
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-slate-400 mb-1">التوقيع</p>
                            <p className="font-serif italic text-cyan-800 border-b border-slate-200 pb-1">جمعية أبطال الفنيدق</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <button
                        onClick={() => setShowCertificate(false)}
                        className="py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
                      >
                        العودة للنتائج
                      </button>
                      <button
                        onClick={printResults}
                        className="py-4 bg-cyan-500 text-slate-950 font-bold rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                      >
                        <Printer className="w-5 h-5" />
                        طباعة الشهادة (PDF)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  triggerSound('click');
                  setGameState('start');
                }}
                className="w-full py-5 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 text-xl print:hidden"
              >
                <RefreshCw className="w-6 h-6" />
                العب مرة أخرى
              </button>

              {/* Hidden Print Section - Optimized for Certificate */}
              <div className="hidden print:block text-slate-950 text-center">
                <div className="p-12 border-[15px] border-double border-cyan-700 rounded-lg bg-white">
                  <h1 className="text-4xl font-black mb-4">شهادة تفوق</h1>
                  <p className="text-xl mb-8">تمنح هذه الشهادة لـ</p>
                  <h2 className="text-5xl font-black text-cyan-800 mb-8">{userName}</h2>
                  <p className="text-2xl mb-12">لإتمامه مسابقة عالم الحيتان بنجاح</p>
                  <div className="flex justify-between mt-20">
                    <div className="text-right">
                      <p>التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div className="text-left">
                      <p>التوقيع: جمعية أبطال الفنيدق</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-20 text-right page-break-before">
                  <h3 className="text-2xl font-bold mb-8">تقرير الأداء التفصيلي</h3>
                  <div className="space-y-6">
                    {userAnswers.map((ua, i) => (
                      <div key={i} className="border-b border-slate-200 pb-4">
                        <p className="font-bold text-lg">{i + 1}. {ua.question}</p>
                        <p className={ua.correct ? 'text-green-700' : 'text-red-700'}>
                          إجابتك: {ua.answer} {ua.correct ? '(صحيحة)' : `(خاطئة - الصحيحة: ${ua.correctAnswer})`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 left-0 w-full text-center pointer-events-none opacity-40 print:hidden">
        <p className="text-xs uppercase tracking-[0.4em] font-light mb-1">Whale World Explorer • 2026</p>
        <p className="text-[10px] font-bold text-cyan-400">من تصميم جمعية أبطال الفنيدق</p>
      </footer>
    </div>
  );
}
