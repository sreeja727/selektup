
export class ApiStatus {
  constructor() {
    this._isTokenExpired = false;
    this._dataArray = [];
  }

  get tokenExpired() {
    return this._isTokenExpired;
  }

  set tokenExpired(value) {
    if (typeof value === 'boolean') {
      this._isTokenExpired = value;
    } else {
      throw new Error('Invalid value type. Expected boolean.');
    }
  }

  get dataArray() {
    return this._dataArray;
  }

  set dataArray(value) {
    if (Array.isArray(value)) {
      this._dataArray = value;
    } else {
      throw new Error('Invalid value type. Expected array.');
    }
  }
}
