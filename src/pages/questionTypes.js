

export const QUESTION_KIND = {
  SINGLE_SELECT: 'SINGLE_SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  TEXT_ANSWER: 'TEXT_ANSWER',
  NUMERIC_ANSWER: 'NUMERIC_ANSWER',
};

const ASSERTION_REASON_OPTIONS = [
  'Both Assertion and Reason are true, and Reason is the correct explanation of Assertion',
  'Both Assertion and Reason are true, but Reason is NOT the correct explanation of Assertion',
  'Assertion is true, but Reason is false',
  'Assertion is false, but Reason is true',
];

export const QUESTION_TYPES = {
  SINGLE_CORRECT_MCQ: {
    kind: QUESTION_KIND.SINGLE_SELECT,
    label: 'Single MCQ',
    optionCount: 4,
  },
  STATEMENT_BASED: {
    kind: QUESTION_KIND.SINGLE_SELECT,
    label: 'Statement-based',
    optionCount: 4,
    hasStatements: true,
  },
  ASSERTION_AND_REASON: {
    kind: QUESTION_KIND.SINGLE_SELECT,
    label: 'Assertion & Reason',
    fixedOptions: ASSERTION_REASON_OPTIONS,
    hasAssertionReason: true,
  },
  PARAGRAPH_BASED: {
    kind: QUESTION_KIND.SINGLE_SELECT,
    label: 'Paragraph-based',
    optionCount: 4,
    hasPassage: true,
  },

  TABLE_BASED: {
    kind: QUESTION_KIND.SINGLE_SELECT,
    label: 'Table-based',
    optionCount: 4,
    hasTable: true,
  },
  IMAGE_BASED: {
    kind: QUESTION_KIND.SINGLE_SELECT,
    label: 'Image Question',
    optionCount: 4,
    hasImage: true,
  },
  LONG_ANSWER: {
    kind: QUESTION_KIND.TEXT_ANSWER,
    label: 'Long Answer',
    multiline: true,
    manualGrading: true,
  },
  FILL_IN_THE_BLANK: {
    kind: QUESTION_KIND.TEXT_ANSWER,
    label: 'Fill in the Blank',
  },
  MULTIPLE_CORRECT_MCQ: {
    kind: QUESTION_KIND.MULTI_SELECT,
    label: 'Multiple Correct',
    optionCount: 4,
  },
  TRUE_FALSE: {
    kind: QUESTION_KIND.SINGLE_SELECT,
    label: 'True / False',
    fixedOptions: ['True', 'False'],
  },
  ONE_WORD_ANSWER: {
    kind: QUESTION_KIND.TEXT_ANSWER,
    label: 'One Word Answer',
  },
  NUMERICAL: {
    kind: QUESTION_KIND.NUMERIC_ANSWER,
    label: 'Numerical',
  },
};

export const QUESTION_TYPE_LIST = Object.keys(QUESTION_TYPES);


export const SAVEABLE_QUESTION_TYPE_LIST = QUESTION_TYPE_LIST.filter((t) => !QUESTION_TYPES[t].comingSoon);

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function getTypeConfig(type) {
  return QUESTION_TYPES[type] || QUESTION_TYPES.SINGLE_CORRECT_MCQ;
}

export function isSaveable(type) {
  return !getTypeConfig(type).comingSoon;
}

function normalizeText(value) {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}


function makeDefaultOptions(config) {
  if (config.fixedOptions) return [...config.fixedOptions];
  return Array.from({ length: config.optionCount }, () => '');
}


export function emptyFields(type) {
  const config = getTypeConfig(type);
  const base = { text: '', explanation: '', marks: 1 };

  if (config.hasStatements) base.statements = [''];
  if (config.hasPassage) {
    base.passageTitle = '';
    base.passageText = '';
  }
  if (config.hasTable) {
    base.tableHeaders = ['', ''];
    base.tableRows = [['', '']];
  }

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    return { ...base, correctNumericAnswer: '', numericTolerance: '' };
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    return config.manualGrading ? base : { ...base, answerText: '' };
  }

  const fields = {
    ...base,
    options: makeDefaultOptions(config),
    correctOptionIndexes: [],
  };
  if (config.hasImage) fields.imageUrl = '';
  if (config.hasAssertionReason) fields.reason = '';
  return fields;
}

export function toFormFields(question) {
  const empty = emptyFields(question.type);
  return {
    ...empty,
    text: question.text ?? empty.text,
    explanation: question.explanation ?? empty.explanation,
    marks: question.marks ?? empty.marks,
    options: question.options?.length ? question.options : empty.options,
    correctOptionIndexes: question.correctOptionIndexes ?? empty.correctOptionIndexes,
    answerText: question.answerText ?? empty.answerText,
    correctNumericAnswer: question.correctNumericAnswer ?? empty.correctNumericAnswer,
    numericTolerance: question.numericTolerance ?? empty.numericTolerance,
    imageUrl: question.imageUrl ?? empty.imageUrl,
    reason: question.reason ?? empty.reason,
    statements: question.statements?.length ? question.statements : empty.statements,
    passageTitle: question.passageTitle ?? empty.passageTitle,
    passageText: question.passageText ?? empty.passageText,
    tableHeaders: question.tableHeaders?.length ? question.tableHeaders : empty.tableHeaders,
    tableRows: question.tableRows?.length ? question.tableRows : empty.tableRows,
  };
}

export function validate(type, fields = {}) {
  const config = getTypeConfig(type);
  const errors = {};

  if (!fields.text?.trim()) {
    errors.text = config.hasAssertionReason ? 'Assertion statement is required' : 'Question text is required';
  }
  if (!fields.explanation?.trim()) errors.explanation = 'An explanation is required';
  if (!fields.marks || Number(fields.marks) <= 0) errors.marks = 'Marks must be a positive number';

  if (config.hasStatements) {
    const statements = (fields.statements || []).map((s) => s.trim()).filter(Boolean);
    if (statements.length === 0) errors.statements = 'At least one statement is required';
  }
  if (config.hasPassage) {
    if (!fields.passageTitle?.trim()) errors.passageTitle = 'Passage title is required';
    if (!fields.passageText?.trim()) errors.passageText = 'Passage text is required';
  }
  if (config.hasTable) {
    const headers = (fields.tableHeaders || []).map((h) => h.trim());
    if (headers.length === 0 || headers.some((h) => !h)) errors.tableHeaders = 'All column headers must be filled in';
    const rows = fields.tableRows || [];
    if (rows.length === 0 || rows.every((row) => row.every((cell) => !cell.trim()))) {
      errors.tableRows = 'At least one table row is required';
    }
  }

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    if (fields.correctNumericAnswer === '' || fields.correctNumericAnswer === undefined || Number.isNaN(Number(fields.correctNumericAnswer))) {
      errors.correctNumericAnswer = 'A numeric answer is required';
    }
    if (fields.numericTolerance !== '' && fields.numericTolerance !== undefined && Number.isNaN(Number(fields.numericTolerance))) {
      errors.numericTolerance = 'Tolerance must be a number';
    }
    return errors;
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    if (!config.manualGrading && !fields.answerText?.trim()) errors.answerText = 'The correct answer is required';
    return errors;
  }

  const options = fields.options || [];
  if (!config.fixedOptions && options.some((opt) => !opt.trim())) {
    errors.options = `All ${options.length} options must be filled in`;
  }

  const correctCount = (fields.correctOptionIndexes || []).length;
  if (correctCount === 0) {
    errors.correct = 'Mark at least one option as correct';
  } else if (config.kind === QUESTION_KIND.SINGLE_SELECT && correctCount > 1) {
    errors.correct = 'Only one option can be marked correct for this question type';
  }

  if (config.hasImage && !fields.imageUrl?.trim()) errors.imageUrl = 'An image URL is required';
  if (config.hasAssertionReason && !fields.reason?.trim()) errors.reason = 'Reason statement is required';

  return errors;
}

export function toggleCorrectOption(fields, index, kind) {
  const current = fields.correctOptionIndexes || [];
  if (kind === QUESTION_KIND.MULTI_SELECT) {
    const next = current.includes(index)
      ? current.filter((i) => i !== index)
      : [...current, index];
    return { ...fields, correctOptionIndexes: next };
  }
  return { ...fields, correctOptionIndexes: [index] };
}

export function addStatement(fields) {
  return { ...fields, statements: [...(fields.statements || []), ''] };
}

export function removeStatement(fields, index) {
  const list = (fields.statements || []).filter((_, i) => i !== index);
  return { ...fields, statements: list.length ? list : [''] };
}

export function addTableRow(fields) {
  const columnCount = (fields.tableHeaders || []).length;
  return { ...fields, tableRows: [...(fields.tableRows || []), Array.from({ length: columnCount }, () => '')] };
}

export function removeTableRow(fields, index) {
  const rows = (fields.tableRows || []).filter((_, i) => i !== index);
  const columnCount = (fields.tableHeaders || []).length;
  return { ...fields, tableRows: rows.length ? rows : [Array.from({ length: columnCount }, () => '')] };
}

export function addTableColumn(fields) {
  return {
    ...fields,
    tableHeaders: [...(fields.tableHeaders || []), ''],
    tableRows: (fields.tableRows || []).map((row) => [...row, '']),
  };
}

export function removeTableColumn(fields, index) {
  const headers = (fields.tableHeaders || []).filter((_, i) => i !== index);
  const rows = (fields.tableRows || []).map((row) => row.filter((_, i) => i !== index));
  if (headers.length === 0) {
    return { ...fields, tableHeaders: [''], tableRows: rows.map(() => ['']) };
  }
  return { ...fields, tableHeaders: headers, tableRows: rows };
}


export function toWireQuestion({
  type, text, explanation, marks, options = [], correctOptionIndexes = [],
  answerText, correctNumericAnswer, numericTolerance, imageUrl, reason,
  statements = [], passageTitle, passageText, tableHeaders = [], tableRows = [],
}) {
  const config = getTypeConfig(type);
  const wire = {
    questionType: type,
    questionText: text,
    explanation,
    marks: marks ?? 1,
  };

  if (config.hasStatements) {
    wire.statements = statements.map((s) => s.trim()).filter(Boolean).join('\n');
  }
  if (config.hasPassage) {
    wire.passageTitle = passageTitle || '';
    wire.passageText = passageText || '';
  }
  if (config.hasTable) {
    wire.tableData = { headers: tableHeaders, rows: tableRows };
  }

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    wire.correctNumericAnswer = correctNumericAnswer === '' || correctNumericAnswer === undefined
      ? null
      : Number(correctNumericAnswer);
    wire.numericTolerance = numericTolerance === '' || numericTolerance === undefined
      ? 0
      : Number(numericTolerance);
    return wire;
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    if (!config.manualGrading) wire.correctOption = (answerText || '').trim();
    return wire;
  }

  options.forEach((opt, i) => {
    if (OPTION_LETTERS[i]) wire[`option${OPTION_LETTERS[i]}`] = opt ?? '';
  });

  wire.correctOption = config.kind === QUESTION_KIND.MULTI_SELECT
    ? correctOptionIndexes.map((i) => OPTION_LETTERS[i]).filter(Boolean).join(',')
    : (OPTION_LETTERS[correctOptionIndexes[0]] ?? '');

  if (config.hasImage) wire.imageUrl = imageUrl || '';
  if (config.hasAssertionReason) wire.secondaryText = reason || '';

  return wire;
}

export function fromWireQuestion(raw) {
  if (!raw) return raw;

  const type = raw.questionType || raw.type || 'SINGLE_CORRECT_MCQ';
  const config = getTypeConfig(type);
  const hasWireShape = raw.questionText !== undefined || raw.optionA !== undefined;

  const base = {
    id: raw.id,
    type,
    text: hasWireShape ? (raw.questionText || raw.text || '') : (raw.text || ''),
    explanation: raw.explanation || '',
    marks: raw.marks ?? 1,
  };

  if (config.hasStatements) {
  
    base.statements = Array.isArray(raw.statements)
      ? raw.statements
      : String(raw.statements || '').split('\n').map((s) => s.trim()).filter(Boolean);
  }
  if (config.hasPassage) {
    base.passageId = raw.passageId ?? null;
    base.passageTitle = raw.passageTitle || '';
    base.passageText = raw.passageText || '';
  }
  if (config.hasTable) {
    const tableData = raw.tableData || {};
    base.tableHeaders = tableData.headers?.length ? tableData.headers : [''];
    base.tableRows = tableData.rows?.length ? tableData.rows : [Array.from({ length: base.tableHeaders.length }, () => '')];
  }

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    return {
      ...base,
      correctNumericAnswer: raw.correctNumericAnswer ?? null,
      numericTolerance: raw.numericTolerance ?? 0,
    };
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    return { ...base, answerText: raw.correctOption || raw.answerText || '' };
  }

  let options;
  if (hasWireShape) {
    options = OPTION_LETTERS
      .map((letter) => raw[`option${letter}`])
      .filter((v) => v !== undefined && v !== null && v !== '');
    if (options.length === 0) options = raw.options || [];
  } else {
    options = raw.options || [];
  }
  if (options.length === 0 && config.fixedOptions) options = [...config.fixedOptions];

  let correctOptionIndexes = [];
  if (raw.correctOption !== undefined && raw.correctOption !== null && raw.correctOption !== '') {
    correctOptionIndexes = String(raw.correctOption)
      .split(',')
      .map((letter) => OPTION_LETTERS.indexOf(letter.trim().toUpperCase()))
      .filter((i) => i >= 0);
  } else if (Array.isArray(raw.correctOptionIndexes)) {
    correctOptionIndexes = raw.correctOptionIndexes;
  }

  const result = { ...base, options, correctOptionIndexes };
  if (config.hasImage) result.imageUrl = raw.imageUrl || '';
  if (config.hasAssertionReason) result.reason = raw.secondaryText || '';
  return result;
}


export function isAnswered(question, value) {
  const config = getTypeConfig(question.type);
  if (config.kind === QUESTION_KIND.MULTI_SELECT) return Array.isArray(value) && value.length > 0;
  if (config.kind === QUESTION_KIND.TEXT_ANSWER) return Boolean(value && String(value).trim());
  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) return value !== undefined && value !== null && value !== '' && !Number.isNaN(Number(value));
  return value !== undefined && value !== null && value !== '';
}

export function isCorrect(question, value) {
  if (!isAnswered(question, value)) return false;
  const config = getTypeConfig(question.type);

 
  if (config.manualGrading) return false;

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    const expected = Number(question.correctNumericAnswer);
    const actual = Number(value);
    if (Number.isNaN(expected) || Number.isNaN(actual)) return false;
    const tolerance = Number(question.numericTolerance) || 0;
    return Math.abs(actual - expected) <= tolerance;
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    return normalizeText(question.answerText) === normalizeText(value);
  }

  const options = question.options || [];
  const correctIndexes = question.correctOptionIndexes || [];

  if (config.kind === QUESTION_KIND.MULTI_SELECT) {
    const selected = (Array.isArray(value) ? value : [])
      .map((v) => options.indexOf(v))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b);
    const correct = [...correctIndexes].sort((a, b) => a - b);
    return selected.length === correct.length && selected.every((v, i) => v === correct[i]);
  }

  const selectedIndex = options.indexOf(value);
  return selectedIndex >= 0 && correctIndexes.includes(selectedIndex);
}


export function buildSubmitAnswer(question, value) {
  const config = getTypeConfig(question.type);
  const options = question.options || [];
  const answer = { questionId: question.id };

  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    answer.numericAnswer = isAnswered(question, value) ? Number(value) : null;
    return answer;
  }

  if (config.kind === QUESTION_KIND.TEXT_ANSWER) {
    answer.textAnswer = isAnswered(question, value) ? String(value).trim() : null;
    return answer;
  }

  if (config.kind === QUESTION_KIND.MULTI_SELECT) {
    const letters = (Array.isArray(value) ? value : [])
      .map((v) => options.indexOf(v))
      .filter((i) => i >= 0)
      .map((i) => OPTION_LETTERS[i]);
    answer.selectedOption = letters.length ? letters.join(',') : null;
    return answer;
  }

  const selectedIndex = options.indexOf(value);
  answer.selectedOption = selectedIndex >= 0 ? OPTION_LETTERS[selectedIndex] : null;
  return answer;
}

export function getCorrectAnswerLabel(question) {
  const config = getTypeConfig(question.type);
  if (config.manualGrading) return 'Manually graded';
  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) {
    const tolerance = Number(question.numericTolerance) || 0;
    return tolerance ? `${question.correctNumericAnswer} (± ${tolerance})` : String(question.correctNumericAnswer ?? '—');
  }
  if (config.kind === QUESTION_KIND.TEXT_ANSWER) return question.answerText || '—';
  const options = question.options || [];
  const correct = (question.correctOptionIndexes || []).map((i) => options[i]).filter(Boolean);
  return correct.join(', ') || '—';
}

export function getSelectedAnswerLabel(question, value) {
  if (!isAnswered(question, value)) return null;
  const config = getTypeConfig(question.type);
  if (config.kind === QUESTION_KIND.NUMERIC_ANSWER) return String(value);
  if (config.kind === QUESTION_KIND.TEXT_ANSWER) return String(value).trim();
  if (config.kind === QUESTION_KIND.MULTI_SELECT) return (Array.isArray(value) ? value : []).join(', ');
  return value;
}

export { OPTION_LETTERS };
