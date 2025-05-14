export interface NotificationDTO {
  id: string;
  message: string;
  recipientId: number;
  isRead: boolean;
  createdAt: string;
  entity: RelatedEntity;
}

export interface RelatedEntity {
  id: string;
  type: string;
}

export type NotificationFilter = 'all' | 'read' | 'unread';