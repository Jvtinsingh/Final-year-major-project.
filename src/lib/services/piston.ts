import axios from 'axios';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

const languageVersions: Record<string, string> = {
  javascript: '18.15.0',
  python: '3.10.0',
  java: '15.0.2',
  cpp: '10.2.0',
};

export const executeCode = async (language: string, source: string, stdin: string = '') => {
  const version = languageVersions[language.toLowerCase()];
  if (!version) {
    throw new Error(`Unsupported Language: ${language}`);
  }

  const payload = {
    language,
    version,
    files: [{ content: source }],
    stdin,
  };

  try {
    const response = await axios.post(`${PISTON_API_URL}/execute`, payload);
    return response.data;
  } catch (error: any) {
    console.error('[Piston-Service] Execution Error:', error.message);
    throw new Error('Code execution failed at the Piston engine.');
  }
};
