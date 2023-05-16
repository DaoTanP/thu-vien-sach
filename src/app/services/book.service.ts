import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class BookService
{
  private books: Book[] = [];
  constructor(private httpService: HttpService)
  {
    this.httpService.getBooks().subscribe(data =>
      data.forEach((b: any) =>
        this.books.push({ imgUrl: b.image, publishDate: b.published, ...b })
      )
    );
  }

  get ()
  {
    return this.books;
  }

  getById (id: string)
  {
    return this.books.find(b => b.id === id);
  }

  search (keywords: string)
  {
    if (keywords.trim() == '' || !keywords)
      return [];
    let keywordTokens = keywords.trim().toLowerCase().split(' ');
    let result = [];

    for (let i = 0; i < this.books.length; i++)
    {
      let properties = Object.entries(this.books[i]);

      let score = 0;
      for (let j = 0; j < properties.length; j++)
      {
        console.log(properties[j]);
        let tokens = properties[j][1].toLowerCase().split(' ');
        for (let k = 0; k < tokens.length; k++)
        {
          for (let l = 0; l < keywordTokens.length; l++)
          {
            if (properties[j][0] == 'title')
              score += stringSimilarity(keywordTokens[l], tokens[k]) * 2;
            if (properties[j][0] == 'author')
              score += stringSimilarity(keywordTokens[l], tokens[k]) * 1.5;
            if (properties[j][0] == 'publisher')
              score += stringSimilarity(keywordTokens[l], tokens[k]) * 1.25;
          }
        }
      }
      if (score < 1)
        continue;

      result.push({ ...this.books[i], score });
    }

    result.sort((a, b) => b.score - a.score);

    return result;
  }
}

function getNGrams (s: string, len: number)
{
  s = ' '.repeat(len - 1) + s.toLowerCase() + ' '.repeat(len - 1);
  let v = new Array(s.length - len + 1);
  for (let i = 0; i < v.length; i++)
  {
    v[i] = s.slice(i, i + len);
  }
  return v;
}
function stringSimilarity (str1: string, str2: string, gramSize: number = 2)
{

  if (!str1?.length || !str2?.length) { return 0.0; }

  let s1 = str1.length < str2.length ? str1 : str2;
  let s2 = str1.length < str2.length ? str2 : str1;

  let pairs1 = getNGrams(s1, gramSize);
  let pairs2 = getNGrams(s2, gramSize);
  let set = new Set<string>(pairs1);

  let total = pairs2.length;
  let hits = 0;
  for (let item of pairs2)
  {
    if (set.delete(item))
    {
      hits++;
    }
  }
  return hits / total;
}

function get_bigrams (string: string)
{
  var s = string.toLowerCase()
  var v = s.split('');
  for (var i = 0; i < v.length; i++) { v[i] = s.slice(i, i + 2); }
  return v;
}

function string_similarity (str1: string, str2: string)
{
  if (str1.length > 0 && str2.length > 0)
  {
    var pairs1 = get_bigrams(str1);
    var pairs2 = get_bigrams(str2);
    var union = pairs1.length + pairs2.length;
    var hits = 0;
    for (var x = 0; x < pairs1.length; x++)
    {
      for (var y = 0; y < pairs2.length; y++)
      {
        if (pairs1[x] == pairs2[y]) hits++;
      }
    }
    if (hits > 0) return ((2.0 * hits) / union);
  }
  return 0.0
}