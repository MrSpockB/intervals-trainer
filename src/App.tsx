import { useEffect, useState } from 'react';
import './App.scss';
import { getTwoNotes, getCorrectAnswers } from './logic';


function App() {
  const [firstNote, setFirstNote] = useState('');
  const [secondNote, setSecondNote] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('');
  const [result, setResult] = useState({
    type: '',
    quality: ''
  });
  const intervalTypes = [
    'Segunda',
    'Tercera',
    'Cuarta',
    'Quinta',
    'Sexta',
    'Séptima'
  ];
  const qualities = [
    'Menor',
    'Mayor',
    'Aumentada',
    'Disminuida',
    'Justa'
  ];
  useEffect(() => {
    const [firstNote, secondNote] = getTwoNotes();
    setFirstNote(firstNote);
    setSecondNote(secondNote);
    const res = getCorrectAnswers(firstNote, secondNote);
    setResult(res);
  }, []);

  const selectType = (type: string) => {
    setSelectedType(type);
  };

  const selectQuality = (quality: string) => {
    setSelectedQuality(quality);
  }

  const getClassesForType = (interval: string) => {
    if (selectedType === '') {
      return '';
    }
    let className = '';
    if (interval === result.type) {
      className += 'correct';
    } else {
      className += 'incorrect';
    }
    if (interval === selectedType) {
      className += ' border';
    }
    return className
  }

  const getClassesForQuality = (quality: string) => {
    if (selectedQuality === '') {
      return '';
    }
    let className = '';
    if (quality === result.quality) {
      className += 'correct';
    } else {
      className += 'incorrect';
    }
    if (quality === selectedQuality) {
      className += ' border';
    }
    return className
  }

  const generateNew = () => {
    setSelectedType('');
    setSelectedQuality('');
    const [firstNote, secondNote] = getTwoNotes();
    setFirstNote(firstNote);
    setSecondNote(secondNote);
    const res = getCorrectAnswers(firstNote, secondNote);
    setResult(res);
  }

  return (
    <div className="App">
      <h1>Entrenamiento de intervalos</h1>
      <div className="notes">
        <h2>{firstNote} - {secondNote}</h2>
      </div>
      <div className="type answers">
        {intervalTypes.map(interval => (
          <button
            className={getClassesForType(interval)}
            key={interval}
            onClick={() => selectType(interval)}
          >
            { interval }
            </button>
        ))}
      </div>
      <div className="quality answers">
        {qualities.map(quality => (
          <button
            className={getClassesForQuality(quality)}
            key={quality}
            onClick={() => selectQuality(quality)}
            >
              { quality }
          </button>
        ))}
      </div>
      {selectedQuality && selectedType ? (
        <button className="next-btn" onClick={() => generateNew()}>
          Siguiente
        </button>
      ): null}
    </div>
  );
}

export default App;
