import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]); // changed to array

  const handleInputChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.get(`http://127.0.0.1:8000/ask?question=${encodeURIComponent(question)}`);
      setResponses(res.data.response); // assuming response is an array
    } catch (error) {
      console.error('Error during API request:', error);
    }
  };

  return (
    <div className="App">
      <h1>Compliance Agent</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask your question"
          value={question}
          onChange={handleInputChange}
        />
        <button type="submit">Ask</button>
      </form>

      {responses.length > 0 && (
        <div>
          <strong>Response:</strong>
          <ul>
            {responses.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
           {console.log(responses)}
    </div>

  );
}

export default App;
