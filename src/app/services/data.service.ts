import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService
{
  private data = new Map();
  constructor() { }

  getData (key: string)
  {
    return this.data.get(key);
  }

  getAllData ()
  {
    return this.data.values();
  }

  setData (key: string, value: any)
  {
    this.data.set(key, value);
  }
}
