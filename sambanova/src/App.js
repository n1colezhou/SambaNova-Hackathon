import React, { useEffect } from 'react';

function App() {

  let text = 'Click Here';
  const returnText = () => {
    text = document.body.innerText;
    // console.log(document.body.innerText);
  }

  // useEffect(() => {
  //   returnText();
  // }, []);

  return (
    <div>
        <button onClick={returnText}>Hi {text}</button>
    </div>
  );
}

export default App;
