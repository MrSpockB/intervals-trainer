type Note = {
  name: string;
  altName: string;
  accidental: boolean;
}

type Result = {
  type: string;
  quality: string;
};

const notes: Note[] = [
  { name: 'Do', altName: '', accidental: false },
  { name: 'Do♯', altName: "Re♭", accidental: true },
  { name: 'Re', altName: '', accidental: false },
  { name: 'Re♯', altName: "Mi♭", accidental: true },
  { name: 'Mi', altName: '', accidental: false },
  { name: 'Fa', altName: '', accidental: false },
  { name: 'Fa♯', altName: 'Sol♭', accidental: true },
  { name: 'Sol' , altName: '', accidental: false},
  { name: 'Sol♯', altName: 'La♭', accidental: true },
  { name: 'La', altName: '', accidental: false },
  { name: 'La♯', altName: 'Si♭', accidental: true },
  { name: 'Si', altName: '', accidental: false },
];

const typesMap: Record<number, string> = {
  2: 'Segunda',
  3: 'Tercera',
  4: 'Cuarta',
  5: 'Quinta',
  6: 'Sexta',
  7: 'Séptima'
};
const qualitiesMap: Record<number, string> = {
  1: 'Menor',
  2: 'Mayor',
  3: 'Menor',
  4: 'Mayor',
  5: 'Justa',
  7: 'Justa',
  8: 'Menor',
  9: 'Mayor',
  10: 'Menor',
  11: 'Mayor',
};

const random = (min: number, max: number): number => {
  let byteArray = new Uint8Array(1);
  crypto.getRandomValues(byteArray);
  let range = max - min + 1;
  let max_range = 256;
  if (byteArray[0] >= Math.floor(max_range / range) * range)
      return random(min, max);
  return min + (byteArray[0] % range);
};

const getNoteName = (note: Note): string => {
  if (!note.accidental) {
    return note.name;
  }
  const shouldChooseAltName = Math.random() < 0.5;
  if (shouldChooseAltName) {
    return note.altName;
  }
  return note.name
};

const filterNotes = (notesArr: Note[], name: string): Note[] => {
  let noteName = name;
  if (noteName.includes('♭') || noteName.includes('♯')) {
    noteName = name.slice(0, -1);
  }
  const arr: Note[] = [];
  notesArr.forEach(note => {
    if ((!note.accidental && !note.name.includes(noteName)) || (note.accidental && !note.altName.includes(noteName))) {
      arr.push(note);
    } else if (note.accidental && note.altName.includes(noteName)) {
      arr.push({ name: note.name, altName: note.name, accidental: true });
    } else if (note.accidental && note.name.includes(noteName)) {
      arr.push({ name: note.altName, altName: note.altName, accidental:true });
    }
  })
  return arr;
};

const getIntervalType = (firstNote: string, secondNote: string): string => {
  const mainNotes = notes.filter(note => !note.accidental).map(note => note.name);
  const startingIndex = mainNotes.findIndex(note => note === firstNote);
  let count = 1;
  const mainNotesLength = mainNotes.length;
  let found = false;
  while(!found) {
    const nextNote = mainNotes[(startingIndex + count) % mainNotesLength];
    if (nextNote === secondNote) {
      count += 1;
      found = true;
    } else {
      count += 1;
    }
  }
  return typesMap[count];
};

const getQualityType = (firstNote: string, secondNote: string, type: string): string => {
  const startingIndex = notes.findIndex(note => note.name === firstNote || note.altName === firstNote);
  let halfStepCount = 0;
  const mainNotesLength = notes.length;
  let found = false;
  while(!found) {
    const nextNote = notes[(startingIndex + halfStepCount + 1) % mainNotesLength];
    if (nextNote.name === secondNote || nextNote.altName === secondNote) {
      halfStepCount += 1;
      found = true;
    } else {
      halfStepCount += 1;
    }
  }
  if (halfStepCount === 6) {
    return type === 'Cuarta' ? 'Aumentada' : 'Disminuida';
  }
  return qualitiesMap[halfStepCount];
}

export const getTwoNotes = () => {
  const max = notes.length;
  const firstNotePos = random(0, max - 1);
  let tempNotes = [...notes];
  const [firstNote] = tempNotes.splice(firstNotePos, 1);
  const firstNoteName = getNoteName(firstNote);
  tempNotes = filterNotes(tempNotes, firstNoteName);
  const secondNotePos = random(0, tempNotes.length - 1);
  const secondNote = tempNotes[secondNotePos];
  return [firstNoteName, getNoteName(secondNote)];
};

export const getCorrectAnswers = (firstNoteName: string, secondNoteName: string): Result => {
  let firstNote = firstNoteName;
  if (firstNoteName.includes('♭') || firstNoteName.includes('♯')) {
    firstNote = firstNoteName.slice(0, -1);
  }
  let secondNote = secondNoteName;
  if (secondNoteName.includes('♭') || secondNoteName.includes('♯')) {
    secondNote = secondNoteName.slice(0, -1);
  }
  const type = getIntervalType(firstNote, secondNote);
  const quality = getQualityType(firstNoteName, secondNoteName, type);

  return { type, quality };
};