
var StatusMap = {
  P: 'pending',
  RS: 'resolve',
  RR: 'reject',
  F: 'fullfilled'
}

class PromiseD {
  constructor(fn, cbs = []) {
    this.value = null;
    this.error = null;
    this.cbs = cbs;
    this.cbCatch = null;
    this.status = StatusMap.P;

    this._resolve = this._resolve.bind(this)
    this._reject = this._reject.bind(this)
    fn(this._resolve, this._reject);
  }

  then(cb) {
    if (this.status === StatusMap.P) {
      this.cbs.push(cb);
    }

    if (this.status === StatusMap.RS) {
      cb(this.value);
    }

    // if (this.status === StatusMap.RR) {
    //   this._reject(this.error);
    // }

    return this;
  }

  catch(cb) {
    if (this.status === StatusMap.P) {
      this.cbCatch = cb;
    }

    if (this.status === StatusMap.RR) {
      cb(this.error);
    }

    return this;
  }

  _addCb(cbs) {
    const arr = Array.isArray(cbs) ? cbs : [cbs];
    this.cbs = this.cbs.concat(arr);
    return this;
  }

  _resolve(v) {
    this.status = StatusMap.RS;
    this.value = v;

    setTimeout(() => {
      const cb = this.cbs.shift();
      if (!cb) return;
      const p = cb(this.value);
      p && p._addCb && p._addCb(this.cbs);
      p && p.catch && p.catch(this._reject);
    }, 0)
  }

  _reject(e) {
    this.status = StatusMap.RR;
    this.error = e;

    setTimeout(() => {
      if (this.cbCatch) return this.cbCatch(e);
      throw Error(e);
    }, 0)
  }
}

/*******************************************测试例子******************************************* */
var fetchCompanyId = () => new PromiseD((resolve, reject) => {
  const n = +Math.random().toFixed(2);
  console.log('开始执行 fetchCompanyId', n);
  setTimeout(() => {
    if (n > 0.5) {
      resolve(n);
    } else {
      reject('fetchCompanyId失败')
    }
  }, 3000)
})

var fetchDepartmentId = (c) => new PromiseD((resolve, reject) => {
  const n = +Math.random().toFixed(2);
  console.log('开始执行 fetchDepartmentId', c, n);
  setTimeout(() => {
    if (n > 0.3) {
      resolve(c + n);
    } else {
      reject('fetchDepartmentId失败')
    }
  }, 2000)
})


var fetchUserId = (c) => new PromiseD((resolve, reject) => {
  const n = +Math.random().toFixed(2);
  console.log('开始执行 fetchUserId', c, n);
  setTimeout(() => {
    if (n > 0.1) {
      resolve(c + n);
    } else {
      reject('fetchUserId失败')
    }
  }, 2000)
})

fetchCompanyId().then(d => fetchDepartmentId(d)).then(d => fetchUserId(d)).then(d => {
  console.log('最终结果', d)
}).catch(e => {
  console.error('失败', e);
})


var dodo = fetchCompanyId();

dodo.then(d => {
  console.log('最终结果', d)
}).catch(e => {
  console.error('失败', e);
})

var dodo1 = new Promise((resolve, reject) => {
  const n = +Math.random().toFixed(2);
  console.log('开始执行 fetchCompanyId', n);
  setTimeout(() => {
    if (n > 0.5) {
      resolve(n);
    } else {
      reject('fetchCompanyId失败')
    }
  }, 3000)
})