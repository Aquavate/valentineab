
import React, { useState, useCallback, useRef } from 'react';
import { AppSlide } from './types';
import FloatingHearts from './components/FloatingHearts';

/** 
 * NOTE ON IMAGES: 
 * Browsers block direct "C:\" paths for security. 
 * To use your local images, place them in the same folder as this project 
 * and change the paths below to "./champi.jpeg" and "./pic bf gf.jpeg".
 */
const BG_IMAGE_1 = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1920&auto=format&fit=crop"; 
const BG_IMAGE_2 = "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop";

const QUESTION_OPTIONS = [
  "2nd dec 2024",
  "2nd jan 2024",
  "2nd june 2025",
  "2nd june 2024"
];

const CORRECT_ANSWER = "2nd jan 2024";

const App: React.FC = () => {
  const [slide, setSlide] = useState<AppSlide>(AppSlide.INTRO);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  
  // No button runaway state
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noOpacity, setNoOpacity] = useState(1);
  const [noEscapeCount, setNoEscapeCount] = useState(0);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const handleNext = () => {
    if (slide === AppSlide.INTRO) {
      setSlide(AppSlide.QUESTION);
    } else if (slide === AppSlide.QUESTION) {
      if (selectedAnswer === CORRECT_ANSWER) {
        setSlide(AppSlide.PROPOSAL);
        setError(false);
      } else if (selectedAnswer) {
        setError(true);
      }
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option);
    if (option === CORRECT_ANSWER) {
      setError(false);
      setSuccessMsg(true);
      // Auto advance after a brief moment so they see the success message
      setTimeout(() => {
        setSlide(AppSlide.PROPOSAL);
        setSuccessMsg(false);
      }, 1000);
    } else {
      setSuccessMsg(false);
      setError(true);
    }
  };

  const moveNoButton = useCallback((e: React.MouseEvent) => {
    if (!noBtnRef.current || noOpacity <= 0) return;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const btnRect = noBtnRef.current.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mouseX - btnCenterX, 2) + Math.pow(mouseY - btnCenterY, 2)
    );

    // If cursor is close, jump to a random position
    if (distance < 140) {
      const randomX = (Math.random() - 0.5) * window.innerWidth * 0.7;
      const randomY = (Math.random() - 0.5) * window.innerHeight * 0.7;
      
      setNoPos({ x: randomX, y: randomY });
      setNoEscapeCount(prev => {
        const next = prev + 1;
        // After 15 attempts, it fades out
        if (next >= 15) {
          setNoOpacity(0);
        }
        return next;
      });
    }
  }, [noOpacity]);

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-cover bg-center transition-all duration-1000 select-none"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${BG_IMAGE_1}')` 
      }}
    >
      <FloatingHearts />

      {/* Slide 1: Intro */}
      {slide === AppSlide.INTRO && (
        <div className="z-10 text-center p-8 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl max-w-2xl transform transition-all animate-in fade-in zoom-in duration-700">
          <h1 className="text-4xl md:text-6xl font-romantic text-white mb-6 drop-shadow-lg">
            Hi Abhisree,
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-8 leading-relaxed">
            My USA joye kora super talented Harvard girlfriend... ✨
          </p>
          <button 
            onClick={handleNext}
            className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-xl shadow-lg hover:scale-110 transition-all duration-300 active:scale-95"
          >
            ebar egiye cholo, there is more
          </button>
        </div>
      )}

      {/* Slide 2: Question */}
      {slide === AppSlide.QUESTION && (
        <div className="z-10 text-center p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-xl w-full mx-4 animate-in slide-in-from-right duration-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            To be the valentine of the great Aditya Ghosh...
          </h2>
          <p className="text-gray-600 mb-4 italic">Answer the following question correctly:</p>
          
          <div className="mb-6 rounded-xl overflow-hidden border-4 border-white shadow-md mx-auto max-w-md">
            <img 
              src={BG_IMAGE_2} 
              alt="Memory" 
              className="w-full h-48 object-cover"
            />
          </div>

          <p className="text-lg font-semibold text-gray-800 mb-6">
            Which day was this pic taken?
          </p>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            {QUESTION_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all border-2 text-lg ${
                  selectedAnswer === option 
                    ? (option === CORRECT_ANSWER ? 'border-green-500 bg-green-50 text-green-600 scale-[1.02] shadow-md' : 'border-red-500 bg-red-50 text-red-600 scale-[1.02] shadow-md')
                    : 'border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="h-8 mb-4">
            {error && <p className="text-red-500 font-bold animate-bounce">Are you sure about that, my love? 😉</p>}
            {successMsg && <p className="text-green-500 font-bold animate-pulse text-xl">correct ans my love! ❤️</p>}
          </div>

          <button 
            onClick={handleNext}
            disabled={!selectedAnswer || successMsg}
            className={`w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xl shadow-lg transition-all active:scale-95 ${(!selectedAnswer || successMsg) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            Confirm Answer
          </button>
        </div>
      )}

      {/* Slide 3: Proposal */}
      {slide === AppSlide.PROPOSAL && (
        <div className="z-10 text-center p-12 bg-white/95 rounded-3xl shadow-2xl max-w-lg w-full relative animate-in zoom-in duration-500 overflow-visible">
          <div className="text-6xl mb-6 animate-pulse">💖</div>
          <h2 className="text-5xl font-romantic text-gray-800 mb-10">
            Pls be my Valentine?
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-8 min-h-[140px]">
            <button 
              onClick={() => setSlide(AppSlide.SUCCESS)}
              className="px-16 py-8 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-4xl shadow-[0_0_25px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] hover:scale-110 active:scale-110 transition-all duration-300 z-20"
            >
              YES!
            </button>
            
            <button 
              ref={noBtnRef}
              onMouseMove={moveNoButton}
              style={{ 
                transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                opacity: noOpacity,
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease',
                pointerEvents: noOpacity <= 0.1 ? 'none' : 'auto'
              }}
              className="px-12 py-6 bg-red-500 text-white rounded-full font-bold text-2xl shadow-lg cursor-default whitespace-nowrap"
            >
              {noEscapeCount > 8 ? "Trying hard?" : "No"}
            </button>
          </div>
          {noEscapeCount > 3 && noOpacity > 0 && (
            <p className="mt-8 text-gray-400 text-sm animate-pulse italic">
              Don't you dare try to click No!
            </p>
          )}
        </div>
      )}

      {/* Slide 4: Success */}
      {slide === AppSlide.SUCCESS && (
        <div className="z-10 text-center p-12 bg-white/95 rounded-3xl shadow-2xl max-w-2xl animate-in fade-in zoom-in duration-1000">
          <div className="text-7xl mb-6 animate-bounce">🎉❤️</div>
          <h2 className="text-6xl font-romantic text-red-600 mb-6">
            Yay! I knew it!
          </h2>
          <div className="space-y-4 text-2xl text-gray-700 leading-relaxed">
            <p>I'm the luckiest guy to have you.</p>
            <p>Can't wait to see you soon, Abhisree!</p>
            <p className="pt-4 italic font-medium">Forever yours,</p>
            <p className="font-bold text-4xl text-red-500 font-romantic">- Aditya</p>
          </div>
          <div className="mt-12 flex justify-center gap-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-4xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>❤️</span>
            ))}
          </div>
        </div>
      )}

      {/* Visual labels for the user context */}
      <div className="fixed bottom-4 left-4 text-[10px] text-white/40 select-none">
        Background: champi.jpeg | Question: pic bf gf.jpeg
      </div>
    </div>
  );
};

export default App;
