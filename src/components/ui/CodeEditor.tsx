'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'react-hot-toast';
import { Play } from 'lucide-react';
import api from '@/lib/api';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onRun?: (results: any) => void;
  questionId: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = '// Write your code here...', 
  language = 'javascript', 
  onRun,
  questionId
}) => {
  const [code, setCode] = useState(initialCode);
  const [executing, setExecuting] = useState(false);

  const handleExecute = async () => {
    setExecuting(true);
    try {
      // Proxying through the backend for role-based processing
      const response = await api.post('/api/code/evaluate', {
        questionId,
        sourceCode: code,
        language,
      });

      if (onRun) onRun(response.data);
      toast.success('Code executed successfully!');
    } catch (error: any) {
      console.error('[Code-Editor] Execution Error:', error.message);
      toast.error('Code execution failed. Please check your syntax.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden glass-card">
      <div className="flex items-center justify-between p-3 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-400 uppercase">{language}</span>
        </div>
        <button 
          onClick={handleExecute}
          disabled={executing}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
        >
          <Play size={16} />
          {executing ? 'Running...' : 'Run Code'}
        </button>
      </div>

      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 20 },
            automaticLayout: true,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden'
            }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
