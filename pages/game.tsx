import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Vazirmatn } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { HARD_WORDS, MEDIUM_WORDS, WORDS } from "@/utils/words";
import useTimer from "@/utils/useTimer";
import Link from "next/link";
const vazir = Vazirmatn({ subsets: ["arabic"] });

const DIFFICULTY_NAMES = [
  { name: "easy_words", list: WORDS },
  { name: "medium_words", list: MEDIUM_WORDS },
  { name: "hard_words", list: HARD_WORDS },
];
export default function Game({
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const hasChosen = useRef(false);
  const { number, spyNumber, time, difficulty } = query;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReveiled, setIsReveiled] = useState(false);
  const [gameState, setGameState] = useState<"assign" | "on">("assign");
  const [people, setPeople] = useState(new Array(number));
  const { timer, getTime, startTimer, elapsedTime } = useTimer(time);

  const chooseWord = () => {
    const spies: number[] = [];
    let _words: string[] = JSON.parse(
      localStorage.getItem(DIFFICULTY_NAMES[difficulty].name)!
    );
    if (!_words.length) {
      _words = DIFFICULTY_NAMES[difficulty].list;
      localStorage.setItem(
        DIFFICULTY_NAMES[difficulty].name,
        JSON.stringify(_words)
      );
    }
    const randomIndex = Math.floor(Math.random() * _words!.length);
    const word = _words[randomIndex];
    _words.splice(randomIndex, 1);
    localStorage.setItem(
      DIFFICULTY_NAMES[difficulty].name,
      JSON.stringify(_words)
    );
    while (spies.length < spyNumber) {
      const randomIndex = Math.floor(Math.random() * number);
      if (!spies.includes(randomIndex)) {
        spies.push(randomIndex);
      }
    }
    setPeople((prev) => {
      const current = [...prev];
      for (let i = 0; i < number; i++) {
        if (spies.includes(i)) {
          current[i] = "spy";
        } else {
          current[i] = word;
        }
      }
      console.log(current, spies, word);
      return current;
    });
    hasChosen.current = true;
  };
  useEffect(() => {
    if (!hasChosen.current) {
      chooseWord();
    }
  }, []);
  return (
    <main
      dir="rtl"
      className={`flex min-h-screen flex-col items-center justify-around min-w-screen max-w-2xl mx-auto p-10 select-none ${vazir.className}`}
    >
      {gameState === "on" ? (
        <div className="flex justify-center items-center min-h-[80vh]">
          {timer - elapsedTime > 0 ? (
            <div className="text-6xl font-bold">{getTime()}</div>
          ) : (
            <Link href="/">بازگشت</Link>
          )}
        </div>
      ) : (
        <>
          {currentIndex < number && <div>نفر {currentIndex + 1}</div>}
          <div className="flex flex-col justify-center min-h-[50vh]">
            {isReveiled ? (
              people[currentIndex] === "spy" ? (
                <span>شما جاسوس هستید</span>
              ) : (
                <span>{people[currentIndex]}</span>
              )
            ) : currentIndex < number ? (
              <span>**********</span>
            ) : (
              <span></span>
            )}
          </div>
          {currentIndex < number ? (
            <button
              className="w-full mx-5 bg-slate-500 rounded-full h-10"
              type="button"
              onClick={() => {
                if (isReveiled) {
                  if (currentIndex < number) {
                    setCurrentIndex((prev) => prev + 1);
                    setIsReveiled(false);
                  }
                } else {
                  setIsReveiled(true);
                }
              }}
            >
              {isReveiled
                ? currentIndex < number - 1
                  ? "بعدی"
                  : "تمام"
                : "نمایش"}
            </button>
          ) : (
            <button
              className="w-full mx-5 bg-amber-600 rounded-full h-10"
              onClick={() => {
                setGameState("on");
                startTimer();
              }}
            >
              شروع بازی
            </button>
          )}
        </>
      )}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: { query },
  };
};
