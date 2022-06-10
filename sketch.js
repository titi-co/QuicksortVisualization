let sequence = [];
let barWidth = 10;

let states = [];

let finished = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  sequence = new Array(floor(width / barWidth));
  for (let i = 0; i < sequence.length; i++) {
    sequence[i] = random(height);
    states[i] = -1;
  }
  quickSort(sequence, 0, sequence.length - 1);
}

async function quickSort(arr, start, end) {
  if (start >= end) {
    return;
  }
  let index = await partition(arr, start, end);
  states[index] = -1;

  await Promise.all([
    quickSort(arr, start, index - 1),
    quickSort(arr, index + 1, end),
  ]);

  if (start == 0 && end == sequence.length - 1) {
    for (let i = 0; i < arr.length; i++) {
      await Promise.all([(states[i] = 1), sleep(25)]);
    }
  }
}

async function partition(arr, start, end) {
  for (let i = start; i < end; i++) {
    states[i] = 1;
  }

  let pivotValue = arr[end];
  let pivotIndex = start;
  states[pivotIndex] = 0;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      await swap(arr, i, pivotIndex);
      states[pivotIndex] = -1;
      pivotIndex++;
      states[pivotIndex] = 0;
    }
  }
  await swap(arr, pivotIndex, end);

  for (let i = start; i < end; i++) {
    if (i != pivotIndex) {
      states[i] = -1;
    }
  }

  return pivotIndex;
}

function draw() {
  background(0);

  for (let i = 0; i < sequence.length; i++) {
    if (states[i] == 0) {
      fill("#FF0000");
    } else if (states[i] == 1) {
      fill("#00FF00");
    } else {
      fill(255);
    }
    rect(i * barWidth, height - sequence[i], barWidth, sequence[i]);
  }
}

async function swap(arr, a, b) {
  await sleep(50);
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
