export function sumIntegers(first, second) {
  const integerPattern = /^[+-]?\d+$/;
  const left = first.trim();
  const right = second.trim();

  if (!integerPattern.test(left) || !integerPattern.test(right)) {
    throw new Error("Enter a valid integer in each field.");
  }

  return (BigInt(left) + BigInt(right)).toString();
}

export function axisPositions(first, second, sum) {
  const values = [BigInt(first), BigInt(second), BigInt(sum)];
  const min = values.reduce((smallest, value) => value < smallest ? value : smallest);
  const max = values.reduce((largest, value) => value > largest ? value : largest);
  const lower = min === max ? min - 1n : min;
  const upper = min === max ? max + 1n : max;
  const span = upper - lower;

  return {
    min: lower.toString(),
    max: upper.toString(),
    percentages: values.map((value) => Number((value - lower) * 1000000n / span) / 10000),
  };
}

const form = typeof document === "undefined" ? null : document.querySelector("#calculator-form");

if (form) {
  const message = document.querySelector("#message");
  const axis = document.querySelector("#number-axis");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      const result = sumIntegers(form.elements.first.value, form.elements.second.value);
      const values = [form.elements.first.value.trim(), form.elements.second.value.trim(), result];
      const positions = axisPositions(...values);
      message.textContent = `Sum: ${result}`;
      message.classList.remove("error");
      axis.querySelector("#axis-min").textContent = positions.min;
      axis.querySelector("#axis-max").textContent = positions.max;
      for (const [index, point] of ["first", "second", "sum"].entries()) {
        const row = axis.querySelector(`[data-point="${point}"]`);
        row.querySelector(".axis-value").textContent = values[index];
        row.querySelector(".axis-marker").style.left = `${positions.percentages[index]}%`;
      }
      axis.hidden = false;
    } catch (error) {
      message.textContent = error.message;
      message.classList.add("error");
      axis.hidden = true;
    }
  });
}
