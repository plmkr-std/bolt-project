export interface ValidationSettingsDTO {
  sectionSettings: SectionSettings;
  paragraphSettings: ParagraphSettings;
  textSettings: TextSettings;
  structureElements: string[];
  toFix: boolean;
}

export interface SectionSettings {
  pageFormat: string;
  fieldTemplate: string;
}

export interface ParagraphSettings {
  firstLine: number;
  lineSpacing: number;
  intervalBeforeSpacing: number;
  intervalAfterSpacing: number;
}

export interface TextSettings {
  fontStyle: string;
  leftBorderFontSize: number;
  rightBorderFontSize: number;
}

export interface ValidationResponseDTO {
  success: boolean;
  message: string;
  data?: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    durationMs: number;
    commentsCount: number;
    fixCount: number;
  };
}