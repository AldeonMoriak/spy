import Image from "next/image";
import { Vazirmatn } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HARD_WORDS, MEDIUM_WORDS, WORDS } from "@/utils/words";

const vazir = Vazirmatn({ subsets: ["arabic"] });
type NamesType =
  | "time"
  | "number"
  | "difficulty"
  | "spyNumber"
  | "easy_words"
  | "medium_words"
  | "hard_words";

const DIFFICULTIES = ["آسان", "متوسط", "سخت"];
export default function Home() {
  const [number, setNumber] = useState(4);
  const [difficulty, setDifficulty] = useState(0);
  const [spyNumber, setSpyNumber] = useState(1);
  const [time, setTime] = useState(5);
  const [isSettingsShown, setIsSettingsShown] = useState(false);
  const handleClickNumber = (value: number) => {
    const toBeValue = number + value;
    if (toBeValue >= 2) {
      setNumber((prev) => prev + value);
      handleLocalStorage("number", toBeValue.toString());
    }
  };
  const handleClickSpy = (value: number) => {
    const toBeValue = spyNumber + value;
    if (toBeValue >= 1 && toBeValue < number) {
      setSpyNumber((prev) => prev + value);
      handleLocalStorage("spyNumber", toBeValue.toString());
    }
  };
  const handleClickTime = (value: number) => {
    const toBeValue = time + value;
    if (toBeValue >= 5) {
      setTime(toBeValue);
      handleLocalStorage("time", toBeValue.toString());
    }
  };
  const handleClickDifficulty = (value: number) => {
    const toBeValue = difficulty + value;
    if (toBeValue >= DIFFICULTIES.length) {
      setDifficulty(0);
      handleLocalStorage("difficulty", "0");
    } else if (toBeValue < 0) {
      const v = DIFFICULTIES.length - 1;
      setDifficulty(v);
      handleLocalStorage("difficulty", v.toString());
    } else {
      setDifficulty(toBeValue);
      handleLocalStorage("difficulty", toBeValue.toString());
    }
  };

  const getLocalStorageValue = (name: NamesType) => {
    return localStorage.getItem(name);
  };

  const setSettings = () => {
    setNumber(
      getLocalStorageValue("number")
        ? parseInt(getLocalStorageValue("number")!)
        : 4
    );
    setDifficulty(
      getLocalStorageValue("difficulty")
        ? parseInt(getLocalStorageValue("difficulty")!)
        : 0
    );
    setSpyNumber(
      getLocalStorageValue("spyNumber")
        ? parseInt(getLocalStorageValue("spyNumber")!)
        : 1
    );
    setTime(
      getLocalStorageValue("time") ? parseInt(getLocalStorageValue("time")!) : 5
    );
  };

  const handleLocalStorage = (name: NamesType, value: string) => {
    localStorage.setItem(name, value);
  };

  useEffect(() => {
    if (!localStorage.getItem("easy_words")) {
      handleLocalStorage("easy_words", JSON.stringify(WORDS));
    }
    if (!localStorage.getItem("medium_words")) {
      handleLocalStorage("medium_words", JSON.stringify(MEDIUM_WORDS));
    }
    if (!localStorage.getItem("hard_words")) {
      handleLocalStorage("hard_words", JSON.stringify(HARD_WORDS));
    }
  }, []);
  useEffect(() => {
    setSettings();
  }, []);
  return (
    <main
      dir="rtl"
      className={`flex min-h-screen flex-col items-center justify-between min-w-screen max-w-2xl mx-auto p-10 select-none ${vazir.className}`}
    >
      {isSettingsShown && (
        <div className="min-w-[300px] border rounded-lg p-5 leading-10">
          <div className="flex justify-between">
            <div>نفرات</div>
            <div className="flex min-w-[100px] justify-around">
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickNumber(1)}
              >
                {"<"}
              </span>
              <span>{number}</span>
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickNumber(-1)}
              >
                {">"}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div>جاسوس</div>
            <div className="flex min-w-[100px] justify-around">
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickSpy(1)}
              >
                {"<"}
              </span>
              <span>{spyNumber}</span>
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickSpy(-1)}
              >
                {">"}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div>دقیقه</div>
            <div className="flex min-w-[100px] justify-around">
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickTime(1)}
              >
                {"<"}
              </span>
              <span>{time}</span>
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickTime(-1)}
              >
                {">"}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div>سختی</div>
            <div className="flex min-w-[100px] justify-around">
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickDifficulty(1)}
              >
                {"<"}
              </span>
              <span>{DIFFICULTIES[difficulty]}</span>
              <span
                className="w-4 px-2 cursor-pointer"
                onClick={() => handleClickDifficulty(-1)}
              >
                {">"}
              </span>
            </div>
          </div>
          <div
            className="flex justify-center pt-3 cursor-pointer"
            onClick={() => setIsSettingsShown(false)}
          >
            بازگشت
          </div>
        </div>
      )}
      {!isSettingsShown && (
        <div className="min-w-[300px] flex items-center justify-center flex-col border rounded-lg p-5">
          <Link
            href={{
              pathname: "/game",
              query: { number, spyNumber, time, difficulty },
            }}
            className="py-4 cursor-pointer"
          >
            شروع
          </Link>
          <div
            className="py-4 cursor-pointer"
            onClick={() => setIsSettingsShown(true)}
          >
            تنظیمات
          </div>
        </div>
      )}
    </main>
  );
}
