"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2022-11-18T21:31:17.178Z",
    "2022-12-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-12-26T17:01:17.194Z",
    "2022-12-27T23:36:17.929Z",
    "2022-12-28T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-12-27T14:43:26.374Z",
    "2022-12-28T18:49:59.371Z",
    "2022-12-29T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-12-27T14:43:26.374Z",
    "2022-12-28T18:49:59.371Z",
    "2022-12-29T08:01:20.894Z",
  ],
  currency: "YER",
  locale: "ar-YE",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-12-27T14:43:26.374Z",
    "2022-12-28T18:49:59.371Z",
    "2022-12-29T22:01:20.894Z",
  ],
  currency: "GEL",
  locale: "ka-GE",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

// const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");
const btnLogin = document.querySelector(".login__btn");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// <---------------------------- IMPLEMENTING ---------------------->

const timerUpdate = () => {
  // set time
  let [min, sec] = [5, 0];

  // Function for setInterval()

  const timer = () => {
    if (sec === 0 && min !== 0) {
      sec = 59;
      min--;
    }

    // each time its called, print remaining time

    labelTimer.textContent = `${String(min).padStart(2, 0)}:${String(
      sec
    ).padStart(2, 0)}`;

    sec--;

    // when its zero, logs out and clear interval

    if (min === 0 && sec === 0) {
      logOut();
      clearInterval(interval);
    }
  };

  // call every Second
  const interval = setInterval(timer, 1000);

  return interval;
};

// <------------------- currency display function -------------------->
const formatCurr = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(Math.abs(value));
};

//<-------------------- function display date ----------------->

const datesFormat = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  // days passed
  const daysPassed = calcDaysPassed(new Date(), date);

  // difference of hours
  const hoursPassed = (date1, date2) => {
    return Math.abs(date1.getHours() - date2.getHours());
  };

  //difference of minutes
  const minPassed = (date1, date2) => {
    return Math.abs(date1.getMinutes() - date2.getMinutes());
  };
  let hours = hoursPassed(new Date(), date);
  let min = minPassed(new Date(), date);

  // display message
  if (daysPassed === 0) return ` ${hours} hours and ${min} minutes ago`;
  if (daysPassed <= 3) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// <---------------- Displaying Movements------------>

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = "";

  // <------------------------ sorting movements -------------------->

  const movementsSorted = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // sort === false
  //   ? acc.movements
  //   : acc.movements.slice().sort((a, b) => a - b);

  movementsSorted.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    // <-----------date-------->
    const date = new Date(acc.movementsDates[i]);
    const displayDate = datesFormat(date, acc.locale);

    // template literal to add new movements

    let formatMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    }: ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// <----------------- computing usernames -------------->

const userName = (accountsArr) => {
  //for each account create a username property and give it a value;
  accountsArr.forEach((account) => {
    account.username = account.owner
      .split(" ")
      .map((el) => el[0].toLocaleLowerCase())
      .join("");
  });
};
userName(accounts);

// <-----------------------Display balance-------------------->

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((a, b) => a + b, 0);
  labelBalance.textContent = `${formatCurr(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

// <------------------- dislpay summary -------------------------->

const calcDisplaySummary = (acc) => {
  // money in
  let incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);

  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  //money out
  let out = Math.abs(
    acc.movements.filter((mov) => mov < 0).reduce((a, b) => a + b, 0)
  ).toFixed(2);

  labelSumOut.textContent = formatCurr(out, acc.locale, acc.currency);

  // interest
  let interest = acc.interestRate;
  let interestRate = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => mov * (interest / 100))
    .reduce((a, b) => a + b, 0)
    .toFixed(2);

  labelSumInterest.textContent = formatCurr(
    interestRate,
    acc.locale,
    acc.currency
  );
};

// <------------------------- Update UI --------------->

const updateUI = (currentAccount) => {
  // display movements
  displayMovements(currentAccount);

  //display balance
  calcDisplayBalance(currentAccount);

  // display summary
  calcDisplaySummary(currentAccount);
};

// <-------------------- log out ----------------->

const logOut = () => {
  containerApp.style.opacity = 0;
  document.querySelector(".log-out").remove();
  document.querySelector(".login").style.display = "flex";
  // inputLoginPin.value = inputLoginUsername.value = "";
  labelWelcome.textContent = `Log in to Get started`;
};

// <------------------------------log in---------------------->

let currentAccount, interval;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  // create dates

  const now = new Date();

  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  };

  const locale = navigator.language;
  console.log(locale);

  // display the date

  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

  if (currentAccount?.pin !== Number(inputLoginPin.value)) {
    alert("wrong credentials");
    inputLoginPin.value = inputLoginUsername.value = "";
  } else {
    // clear input feilds
    inputLoginPin.value = inputLoginUsername.value = "";
    // if (html) html.style.;
    let label = currentAccount.owner.split(" ")[0];
    inputLoginPin.value = inputLoginUsername.value = "";
    labelWelcome.textContent = `Welcome ${label}`;
    containerApp.style.opacity = 100;

    document.querySelector(".login").style.display = "none";

    // update UI
    updateUI(currentAccount);

    // <-------- create a log out button ---------->

    const logout = document.createElement("button");
    logout.className = "log-out";
    logout.innerHTML = "Log out";
    document.querySelector("nav").appendChild(logout);

    // add functionality of loging out

    logout.addEventListener("click", (e) => {
      e.preventDefault();
      logOut();
    });

    // timer

    if (interval) clearInterval(interval);
    interval = timerUpdate();
  }
});

// <------------------------ transfers ------------------------->
let transferToAcc;
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  // finding the account you want to transfer to

  transferToAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  if (
    amount > 0 &&
    transferToAcc &&
    currentAccount.balance >= amount &&
    transferToAcc.username !== currentAccount.username
  ) {
    inputTransferAmount.value = inputTransferTo.value = "";
    currentAccount.movements.push(-amount);
    transferToAcc.movements.push(amount);

    // add Dates;
    currentAccount.movementsDates.push(new Date().toISOString());
    transferToAcc.movementsDates.push(new Date().toISOString());
  }
  if (currentAccount.balance < amount) {
    alert("you are not that guy");
  }

  // update UI
  updateUI(currentAccount);
});

// <-------------------------- request a loan ----------------------->

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const requestedLoan = Math.floor(inputLoanAmount.value);

  if (currentAccount.movements.some((mov) => mov >= 0.1 * requestedLoan)) {
    setTimeout(() => {
      // add movements
      currentAccount.movements.push(requestedLoan);

      // add Dates;
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);
    }, 2500);
    inputLoanAmount.value = " ";
  }
});

// <-------------------------- deleting an account ---------------------->

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  const close = accounts.findIndex(
    (acc) => acc.username === inputCloseUsername.value
  );
  console.log(close);
  const closePin = Number(inputClosePin.value);
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === closePin
  ) {
    // delete account

    accounts.splice(close, 1);

    logOut();
  }
});

// <------------------------ sorting movements -------------------->

let sort = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sort);
  sort = !sort;
});
