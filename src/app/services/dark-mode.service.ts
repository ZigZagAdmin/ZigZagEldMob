import { Injectable } from '@angular/core';
import { DarkModeType } from '../pages/others/others.page';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  constructor() {}

  updateDarkModeClass(darkMode: DarkModeType) {
    if (darkMode === 'dark') {
      document.body.classList.add('dark');
    } else if (darkMode === 'light') {
      document.body.classList.remove('dark');
    } else if (darkMode === 'system') {
      this.applySystemDarkMode();
    }
  }

  initializeDarkMode() {
    let darkMode = localStorage.getItem('darkMode');
    if (darkMode === undefined || darkMode === null || darkMode.length === 0) {
      darkMode = 'system';
      localStorage.setItem('darkMode', darkMode);
    }
    this.updateDarkModeClass(darkMode as DarkModeType);
  }

  applySystemDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
