import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Coin = ({ result }) => (
  <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center text-white text-2xl">
    {result === 'heads' ? 'H' : 'T'}
  </div>
);

const Stats = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>Stats</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Total Flips: {stats.total}</p>
      <p>Heads: {stats.heads} ({((stats.heads / stats.total) * 100 || 0).toFixed(2)}%)</p>
      <p>Tails: {stats.tails} ({((stats.tails / stats.total) * 100 || 0).toFixed(2)}%)</p>
      <p>Longest Streak: {stats.longestStreak.type} ({stats.longestStreak.count})</p>
    </CardContent>
  </Card>
);

const History = ({ history }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>History</CardTitle>
    </CardHeader>
    <CardContent className="overflow-y-auto max-h-40">
      {history.map((entry, idx) => (
        <div key={idx} className={`mb-2 ${entry.correct ? 'text-green-500' : 'text-red-500'}`}>
          {`${idx + 1}: Predicted ${entry.prediction}, Result ${entry.result}`}
        </div>
      ))}
    </CardContent>
  </Card>
);

const ChallengeMode = ({ challenge, setChallenge }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Challenge Mode</CardTitle>
    </CardHeader>
    <CardContent>
      <Input type="number" placeholder="Set Heads goal" onChange={(e) => setChallenge({...challenge, headsGoal: parseInt(e.target.value)})} />
      <Button onClick={() => setChallenge({...challenge, active: true})}>Start Challenge</Button>
      {challenge.active && `Goal: ${challenge.headsGoal} Heads`}
    </CardContent>
  </Card>
);

export default function App() {
  const [result, setResult] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [stats, setStats] = useState({total: 0, heads: 0, tails: 0, longestStreak: {type: '', count: 0}});
  const [history, setHistory] = useState([]);
  const [challenge, setChallenge] = useState({headsGoal: 0, active: false});

  const flipCoin = (times = 1) => {
    for (let i = 0; i < times; i++) {
      const newResult = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(newResult);
      setStats(prev => {
        const newStats = {
          ...prev,
          total: prev.total + 1,
          [newResult]: prev[newResult] + 1,
          longestStreak: newResult === prev.longestStreak.type ? 
            {type: newResult, count: prev.longestStreak.count + 1} : 
            {type: newResult, count: 1}
        };
        return newStats;
      });
      setHistory(prev => [...prev, {result: newResult, prediction, correct: prediction === newResult}]);
    }
  };

  useEffect(() => {
    if (challenge.active && stats.heads >= challenge.headsGoal) {
      alert('Challenge completed!');
      setChallenge({...challenge, active: false});
    }
  }, [stats.heads, challenge]);

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <Card className="w-full max-w-lg mb-4">
        <CardHeader>
          <CardTitle>Coin Flip Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <Coin result={result} />
          <div className="flex gap-2 mb-4">
            <Button onClick={() => flipCoin()}>Flip Coin</Button>
            <Button onClick={() => flipCoin(10)}>Flip 10 Coins</Button>
          </div>
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Predict Heads or Tails" 
              value={prediction} 
              onChange={(e) => setPrediction(e.target.value.toLowerCase())} 
            />
            <Button onClick={() => setPrediction('')}>Predict Outcome</Button>
          </div>
          {prediction && <p className={`mb-4 ${prediction === result ? 'text-green-500' : 'text-red-500'}`}>
            {prediction === result ? 'Correct!' : 'Wrong!'}
          </p>}
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            setResult(null);
            setStats({total: 0, heads: 0, tails: 0, longestStreak: {type: '', count: 0}});
            setHistory([]);
            setChallenge({headsGoal: 0, active: false});
          }}>Reset All</Button>
        </CardFooter>
      </Card>
      <Stats stats={stats} />
      <History history={history} />
      <ChallengeMode challenge={challenge} setChallenge={setChallenge} />
    </div>
  );
}