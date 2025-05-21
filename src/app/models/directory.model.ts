export interface DocumentDirectoryDTO {
  id: string;
  name: string;
  creationTime: string;
  changeTime: string;
  totalSizeBytes: number;
  documentsCount: number;
  tags: string[];
}

export interface DirectoryTag {
  id: string;
  name: string;
  color: string;
}