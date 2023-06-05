import { convertToJavaScriptDate } from "./Utils";

export class Book
{
    constructor(
        public id: string = '',
        public title: string = '',
        public category: string = '',
        public imgUrl: string = '',
        public author: string = '',
        public publisher: string = '',
        public publishDate: string | null = null,
        public overview: string = '',
        public numberOfPages: number = 0,
    )
    {
        this.publishDate = convertToJavaScriptDate(publishDate);

        if (!imgUrl || imgUrl === '')
            imgUrl = 'https://dummyimage.com/400x600/dddddd/aaa&text=No+image';
    }
}
