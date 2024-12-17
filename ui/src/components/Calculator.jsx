import React, { useState, useEffect } from 'react';
import init, * as wasm from '../../pkg/calculator';

function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    const initializeWasm = async () => {
      try {
        // Use the default export to initialize
        await init();
        setWasmReady(true);
      } catch (error) {
        console.error('WASM Initialization Error:', error);
        setResult(`Initialization failed: ${error.message}`);
      }
    };

    initializeWasm();
  }, []);

  const handleCalculate = () => {
    if (!wasmReady) {
      setResult('WASM module not ready');
      return;
    }

    try {
      const calculatedResult = wasm.calculate(expression);
      setResult(calculatedResult.toString());
    } catch (error) {
      console.error('Calculation Error:', error);
      setResult('Invalid expression');
    }
  };

  return (
    <div className='calculator-container'>
        <div>Calculator using Rust and wasm</div>
      <input 
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        placeholder="Enter expression"
        disabled={!wasmReady}
      />
      <button 
        onClick={handleCalculate} 
        disabled={!wasmReady}
      >
        {wasmReady ? 'Calculate' : 'Loading...'}
      </button>
      <div>Result: {result}</div>
    </div>
  );
}

export default Calculator;