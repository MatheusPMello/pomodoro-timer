import { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col } from 'react-bootstrap';

type Mode = "work" | "shortBreak" | "longBreak";

const POMODORO_TIMES = {
  work: 25*60,
  shortBreak: 5*60,
  longBreak: 15*60
}

function App() {
  const [actualTime, setActualTime] = useState(POMODORO_TIMES.work);
  const [isRunning, setIsRunning] = useState(false);
  const [actualMode, setActualMode] = useState<Mode>("work");
  const [sessionCount, setSessionCount] = useState(0);

  // Effect hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setActualTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          }
          
          handleTimerEnd(); 
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleTimerEnd = () => {
    setIsRunning(false);

    let nextMode: Mode = "work";
    let nextSessionCount = sessionCount;

    if (actualMode === "work") {
      nextSessionCount++;

      if (nextSessionCount === 4) {
        nextMode = "longBreak";
        nextSessionCount = 0;
      } else {
        nextMode = "shortBreak";
      }
    } else {
      nextMode = "work";
    }

    setActualMode(nextMode);
    setSessionCount(nextSessionCount);
    setActualTime(POMODORO_TIMES[nextMode]);
  };

  function formatTime(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function handleModeChange(newMode: Mode) {
    setActualMode(newMode);
    setActualTime(POMODORO_TIMES[newMode]);
    setIsRunning(false);

  }

  const buttonText = isRunning ? "Pause" : "Start";

  const handleReset = () => {
    setIsRunning(false);
    setActualTime(POMODORO_TIMES[actualMode]);
    setSessionCount(0);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <Container>
      <div className="pomodoro-container">
        <Row>
          <Col>
            <Button className="button-start" variant="primary" onClick={() => handleModeChange("work")}>Work</Button>
            <Button className="button-start" variant="primary" onClick={() => handleModeChange("shortBreak")}>Short Break</Button>
            <Button className="button-start" variant="primary" onClick={() => handleModeChange("longBreak")}>Long Break</Button>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className='timer'>
            {formatTime(actualTime)}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col>
            <Button className="button-start" variant="primary" size="lg" onClick={handleStartStop}>
              {buttonText}
            </Button>
          </Col>
          <Col>
            <Button className="button-reset" variant="primary" size="lg" onClick={handleReset}>
              Reset
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default App;