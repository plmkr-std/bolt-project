export interface ValidationSettingsDTO {
  minWordCount: number;
  maxWordCount: number;
  allowedFileExtensions: string[];
  maxFileSize: number; // in bytes
  checkPlagiarism: boolean;
  plagiarismThreshold: number; // percentage
  checkGrammar: boolean;
  checkFormatting: boolean;
  languageCode: string;
}

export interface ValidationResponseDTO {
  success: boolean;
  message: string;
  errors?: {
    wordCount?: string;
    plagiarism?: string;
    grammar?: string;
    formatting?: string;
  };
  details?: {
    wordCount: number;
    plagiarismPercentage?: number;
    grammarErrors?: number;
    formattingErrors?: number;
  };
}