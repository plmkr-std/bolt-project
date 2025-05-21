export interface ValidationTemplateDTO {
  _id: string;
  userId: number;
  name: string;
  createdAt: string;
  settings: {
    sectionSettings: {
      pageTemplate: string;
      fieldTemplate: string;
    };
    paragraphSettings: {
      firstLine: number;
      lineSpacing: number;
      intervalBeforeSpacing: number;
      intervalAfterSpacing: number;
    };
    textSettings: {
      fontStyle: string;
      leftBorderSize: number;
      rightBorderSize: number;
    };
    autofix: boolean;
  };
}

export interface CreateTemplateDTO {
  name: string;
  settings: ValidationTemplateDTO['settings'];
}