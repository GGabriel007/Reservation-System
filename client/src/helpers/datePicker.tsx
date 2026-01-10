const datepicker: HTMLElement = document.querySelector("[class^=_datepicker]")!;
const dateInput: HTMLInputElement = document.querySelector(
  "[class^=_date-input]"
)!;
const yearInput: HTMLSelectElement = datepicker?.querySelector(
  "[class^=_year-input]"
) as HTMLSelectElement;
const monthInput: HTMLSelectElement = datepicker?.querySelector(
  "[class^=_month-input]"
) as HTMLSelectElement;
const cancelBtn: HTMLElement = datepicker?.querySelector(
  "[class^=_cancel]"
) as HTMLSelectElement;
const applyBtn: HTMLElement = datepicker?.querySelector(
  "[class^=_apply]"
) as HTMLSelectElement;
const nextBtn: HTMLElement = datepicker?.querySelector(
  "[class^=_next]"
) as HTMLSelectElement;
const prevBtn: HTMLElement = datepicker?.querySelector(
  "[class^=_prev]"
) as HTMLSelectElement;
const dates: HTMLElement = datepicker?.querySelector(
  "[class^=_dates]"
) as HTMLSelectElement;

let selectedDate: Date = new Date();
let year: number = selectedDate.getFullYear();
let month: number = selectedDate.getMonth();

if (dateInput) {
  dateInput.addEventListener("click", () => {
    if (datepicker) {
      datepicker.hidden = false;
    }
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    if (datepicker) {
      datepicker.hidden = true;
    }
  });
}

document.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as Node;
  const datepickerContainer = datepicker?.parentNode;
  console.log("hey");
  if (datepickerContainer && !datepickerContainer.contains(target)) {
    if (datepicker) {
      datepicker.hidden = true;
    }
  }
});

if (applyBtn) {
  applyBtn.addEventListener("click", () => {
    if (dateInput && datepicker) {
      dateInput.value = selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      datepicker.hidden = true;
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    if (month === 11) year++;
    month = (month + 1) % 12;
    displayDates();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (month === 0) year--;
    month = (month - 1 + 12) % 12;
    displayDates();
  });
}

if (monthInput) {
  monthInput.addEventListener("change", () => {
    month = monthInput.selectedIndex;
    displayDates();
  });
}

if (yearInput) {
  yearInput.addEventListener("change", () => {
    const newYear: number =
      parseInt(yearInput.value, 10) || new Date().getFullYear();
    year = Math.min(2100, Math.max(1900, newYear));
    yearInput.value = year.toString();
    displayDates();
  });
}

const updateYearMonth = (): void => {
  if (monthInput && yearInput) {
    monthInput.selectedIndex = month;
    yearInput.value = year.toString();
  }
};

const handleDateClick = (e: MouseEvent): void => {
  const buttonTarget = e.target as HTMLElement;

  const selectedButton = dates?.querySelector("[class^=_.selected]");
  selectedButton && selectedButton.classList.remove("selected");

  buttonTarget.classList.add("selected");

  selectedDate = new Date(
    year,
    month,
    parseInt(buttonTarget.textContent || "0")
  );
};

const displayDates = (): void => {
  updateYearMonth();
  dates.innerHTML = "";

  const lastOfPrevMonth = new Date(year, month, 0);

  for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
    if (lastOfPrevMonth.getDay() === 6) break;

    const text = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
    const button = createButton(text, true);
    dates.appendChild(button);
  }

  const lastOfMonth = new Date(year, month + 1, 0);

  for (let i = 1; i <= lastOfMonth.getDate(); i++) {
    const button = createButton(i, false);
    button.addEventListener("click", handleDateClick);
    dates.appendChild(button);
  }

  const firstOfNextMonth = new Date(year, month + 1, 1);

  for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
    if (firstOfNextMonth.getDay() === 0) break;

    const text = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
    const button = createButton(text, true);
    dates.appendChild(button);
  }
};

const createButton = (
  text: number,
  isDisabled: boolean = false
): HTMLButtonElement => {
  const button = document.createElement("button");
  button.textContent = text.toString();
  button.disabled = isDisabled;

  if (!isDisabled) {
    const buttonDate = new Date(year, month, text).toDateString();
    const today = buttonDate === new Date().toDateString();
    const selected = buttonDate === selectedDate.toDateString();

    button.classList.toggle("today", today);
    button.classList.toggle("selected", selected);
  }

  return button;
};
