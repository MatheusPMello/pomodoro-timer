import React, { useState } from 'react';
import { type FeedbackFormElement } from '../types';

const Feedback: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent<FeedbackFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
    })
      .then(() => {
        alert("Feedback sent successfully!");
        setShowFeedback(false); 
      })
      .catch((error) => {
        alert("Error sending feedback: " + error.message);
      });
  };

  return (
    <>
      <button className="feedback-button" onClick={() => setShowFeedback(true)}>
        Submit Feedback
      </button>
      
      {showFeedback && (
        <div className="feedback-modal">
          <form 
            className="settings-content"
            name="feedback-form" 
            method="post" 
            data-netlify="true" 
            onSubmit={handleFeedbackSubmit}
          >
            <input type="hidden" name="form-name" value="feedback-form" />
            
            <h3>Share Your Feedback</h3>
            <textarea name="message" required placeholder="Tell us what you think..."></textarea>

            <div className="action-buttons" style={{ marginTop: 0, justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="action-button reset-button" 
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
              <button type="submit" className="action-button start-button">
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Feedback;