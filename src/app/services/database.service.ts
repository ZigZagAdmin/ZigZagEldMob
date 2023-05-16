import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable()
export class DatabaseService {

  constructor(private sqlite: SQLite) {}

  createTable() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('create table mytable (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32))', [])
        .then(() => console.log('Таблица создана'))
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
  }

}