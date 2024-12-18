import React, { useState } from 'react';
import Calculator from './components/Calculator';
import ShaderGenerator from './components/Shaders';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className='app-container'>
      <div className="tabs">
        <button onClick={() => setActiveTab('calculator')}>
          Rust Calculator
        </button>
        <button onClick={() => setActiveTab('shader')}>
          Text-to-Shader
        </button>
      </div>

      {activeTab === 'calculator' && <Calculator />}
      {activeTab === 'shader' && <ShaderGenerator />}
    </div>
  );
}

export default App;