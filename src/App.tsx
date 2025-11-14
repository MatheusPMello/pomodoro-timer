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

  // Effect hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setActualTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setIsRunning(false);
            const nextMode: Mode = actualMode === "work" 
            ? "shortBreak" 
            : "work";
            return POMODORO_TIMES[nextMode];
          }
        });
      }, 1000);
    }

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, [isRunning]); // Dependency array

  function formatTime(timeInSeconds: number) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    // Use padStart to add a leading zero if seconds < 10
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  function handleModeChange(newMode: Mode) {
    setActualMode(newMode);
    setActualTime(POMODORO_TIMES[newMode]);
    setIsRunning(false);

  }

  // Use a ternary operator for cleaner conditional rendering
  const buttonText = isRunning ? "Pause" : "Start";

  const handleReset = () => {
    setIsRunning(false);
    setActualTime(1500);
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