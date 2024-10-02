import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function CoinFlipCard({
  onFlip,
  onReset,
  statistics,
  userPrediction,
  setUserPrediction,
  onPredict,
  onBatchFlip,
  onStartChallenge,
}) {
  return (
    <Card className="max-w-md mx-auto mt-6 p-4 bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Advanced Coin Flip Simulator</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <CoinFlipAnimation result={statistics.result} />
        <StatisticsDisplay statistics={statistics} />
        <StreakDisplay streak={statistics.streak} />
        <Challenges onStartChallenge={onStartChallenge} currentChallenge={statistics.currentChallenge} />
        <PredictionMode
          userPrediction={userPrediction}
          setUserPrediction={setUserPrediction}
          onPredict={onPredict}
        />
        <PredictionHistory history={statistics.history} />
        {statistics.predictionFeedback && (
          <div className={`mt-2 text-lg ${statistics.isPredictionCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {statistics.predictionFeedback}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <button
          onClick={onFlip}
          className="px-4 py-2 bg-[#670962] text-white rounded-lg hover:bg-[#52044b] transition duration-300"
        >
          Flip Coin
        </button>
        <button
          onClick={onBatchFlip}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Flip 10 Coins
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Reset
        </button>
      </CardFooter>
    </Card>
  );
}

function CoinFlipAnimation({ result }) {
  return (
    <div className="coin-animation mb-4 transition-transform duration-500">
      <div className={`coin ${result ? 'flip-' + result.toLowerCase() : ''}`}>
        <div className="side heads">Heads</div>
        <div className="side tails">Tails</div>
      </div>
    </div>
  );
}

function StreakDisplay({ streak }) {
  return (
    <div>
      <h3 className="text-lg">Longest Streak:</h3>
      <p className="text-2xl">{streak} {streak > 1 ? 'consecutive flips' : ''}</p>
    </div>
  );
}

function Challenges({ onStartChallenge, currentChallenge }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg">Challenge Mode</h3>
      <p>Current Challenge: {currentChallenge ? currentChallenge.description : 'None'}</p>
      <button
        onClick={onStartChallenge}
        className="mt-2 px-4 py-2 bg-yellow-500 rounded-lg text-white hover:bg-yellow-600 transition duration-300"
      >
        Start a Challenge
      </button>
    </div>
  );
}

function StatisticsDisplay({ statistics }) {
  return (
    <div className="space-y-2">
      <p>Total Flips: {statistics.totalFlips}</p>
      <p>Heads: {statistics.heads}</p>
      <p>Tails: {statistics.tails}</p>
      <div className="flex items-center">
        <div className="h-4 bg-green-500 rounded-full" style={{ width: `${statistics.headsProbability * 100}%` }} />
        <div className="h-4 bg-red-500 rounded-full" style={{ width: `${statistics.tailsProbability * 100}%` }} />
      </div>
      <p>Heads Probability: {(statistics.headsProbability * 100).toFixed(2)}%</p>
      <p>Tails Probability: {(statistics.tailsProbability * 100).toFixed(2)}%</p>
    </div>
  );
}

function PredictionMode({ userPrediction, setUserPrediction, onPredict, predictionFeedback }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg">Make a Prediction:</h3>
      <input
        type="text"
        value={userPrediction}
        onChange={(e) => setUserPrediction(e.target.value)}
        placeholder="Type Heads or Tails"
        className="px-4 py-2 rounded-lg bg-gray-700 text-white"
      />
      <button
        onClick={onPredict}
        className="mt-4 px-4 py-2 bg-yellow-500 rounded-lg text-white hover:bg-yellow-600 transition duration-300"
      >
        Predict Outcome
      </button>
      {predictionFeedback && (
        <div className={`mt-2 text-lg ${isPredictionCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {predictionFeedback}
        </div>
      )}
    </div>
  );
}


function PredictionHistory({ history }) {
  return (
    <div className="mt-4">
      <h3 className="text-lg">Prediction History:</h3>
      <ul className="list-disc list-inside">
        {history.map((item, index) => (
          <li key={index} className={item.isCorrect ? 'text-green-400' : 'text-red-400'}>
            {item.prediction} → {item.result} ({item.isCorrect ? 'Correct' : 'Incorrect'})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  const [totalFlips, setTotalFlips] = useState(0);
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [result, setResult] = useState('');
  const [streak, setStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [userPrediction, setUserPrediction] = useState('');
  const [correctPredictions, setCorrectPredictions] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [predictionFeedback, setPredictionFeedback] = useState('');
  const [isPredictionCorrect, setIsPredictionCorrect] = useState(false);
  const [history, setHistory] = useState([]);

  const challenges = [
    { id: 1, description: 'Flip heads 5 times in a row', target: 5, type: 'Heads' },
    { id: 2, description: 'Get exactly 3 heads out of 10 flips', target: 3, total: 10 },
  ];

  const handleFlip = () => {
    const flipResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
    setResult(flipResult);
    setTotalFlips((prev) => prev + 1);
    if (flipResult === 'Heads') {
      setHeads((prev) => prev + 1);
      updateStreak(flipResult);
    } else {
      setTails((prev) => prev + 1);
      resetStreak();
    }
  };

  const handleBatchFlip = () => {
    for (let i = 0; i < 10; i++) {
      handleFlip();
    }
  };

  const handleReset = () => {
    setTotalFlips(0);
    setHeads(0);
    setTails(0);
    setResult('');
    setStreak(0);
    setCurrentStreak(0);
    setUserPrediction('');
    setCorrectPredictions(0);
    setPredictionFeedback('');
    setIsPredictionCorrect(false);
    setHistory([]);
  };

  const handlePredict = () => {
    if (userPrediction.trim() === '') {
      setPredictionFeedback('Please make a prediction before flipping the coin.');
      setIsPredictionCorrect(false);
      return;
    }
  
    const prediction = userPrediction.trim().toLowerCase();
    if (prediction !== 'heads' && prediction !== 'tails') {
      setPredictionFeedback('Invalid prediction! Please enter "Heads" or "Tails".');
      setIsPredictionCorrect(false);
      return;
    }
  
    const isCorrect =
      (prediction === 'heads' && result === 'Heads') ||
      (prediction === 'tails' && result === 'Tails');
  
    setHistory((prev) => [...prev, { prediction, result, isCorrect }]);
  
    if (isCorrect) {
      setCorrectPredictions((prev) => prev + 1);
      setPredictionFeedback('Correct prediction!');
      setIsPredictionCorrect(true);
    } else {
      setPredictionFeedback('Wrong prediction! Try again.');
      setIsPredictionCorrect(false);
    }
  };
  
  const handleStartChallenge = () => {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(challenge);
  };

  const updateStreak = (flipResult) => {
    if (flipResult === result) {
      setCurrentStreak((prev) => prev + 1);
      if (currentStreak + 1 > streak) {
        setStreak(currentStreak + 1);
      }
    } else {
      resetStreak();
    }
  };

  const resetStreak = () => {
    setCurrentStreak(0);
  };

  const statistics = {
    totalFlips,
    heads,
    tails,
    result,
    headsProbability: totalFlips > 0 ? heads / totalFlips : 0,
    tailsProbability: totalFlips > 0 ? tails / totalFlips : 0,
    streak,
    correctPredictions,
    currentChallenge,
    predictionFeedback,
    isPredictionCorrect,
    history,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <CoinFlipCard
        onFlip={handleFlip}
        onBatchFlip={handleBatchFlip}
        onReset={handleReset}
        statistics={statistics}
        userPrediction={userPrediction}
        setUserPrediction={setUserPrediction}
        onPredict={handlePredict}
        onStartChallenge={handleStartChallenge}
        predictionFeedback={predictionFeedback}
      />
    </div>
  );
}
