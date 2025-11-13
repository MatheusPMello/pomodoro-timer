import { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [actualTime, setActualTime] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [actualMode, setActualMode] = useState<string>("work");

  // Effect hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setActualTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            setIsRunning(false); // Stop the timer when it hits 0
            return 0; // Ensure it stays at 0
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