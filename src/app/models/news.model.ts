import { NewsComment } from './comment.model';

export interface News {
    id: string;
    title: string;
    body: string;
    authorId: string;
    authorName: string;
    noOfComments: number;
    createdAt: string;
    comments?: NewsComment[];
}
