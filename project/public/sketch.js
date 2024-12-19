let displayBlocks = []; // {x, y, color, layer} を要素にもつ配列。1文字につき1ブロック
let currentText = "";   // 現在のテキスト
let lastText = "";      // 前回のテキスト
let blockSize = 5;      // ブロックのサイズ
let blockSpacing = 15;  // ブロックの間隔
let accumulatedText = ""; // 累積されたテキスト
let layerCount = 0; // 新しいレイヤーが追加されるごとに増加
let isGridFilled = false; // 4:3エリアが埋まったかどうかを判定するフラグ
let maxBlocks = Math.floor((windowWidth * windowHeight) / (blockSize * blockSize * 1.5)); // 最大ブロック数（4:3エリアで埋めるために必要なブロック数）

function setup() {
  let canvasWidth = windowWidth * 0.8;
  let canvasHeight = (canvasWidth * 3) / 4;
  createCanvas(canvasWidth, canvasHeight);

  // サーバーから入力テキストを受け取って処理
  socket.on('inputText', (text) => {
    console.log('Received text:', text);  // デバッグ用
    currentText = text;
    updateTextDisplay();
  });
}

function draw() {
  background(240);
  noStroke();

  // 画面に表示されるブロックの描画
  for (let block of displayBlocks) {
    fill(block.color);
    rect(block.x, block.y, blockSize, blockSize);
  }
}

// 新しい文字が追加されたときにブロックを追加
function addBlocksForText(textSegment) {
  if (!isGridFilled) {
    for (let ch of textSegment) {
      let r = random(50, 200);
      let g = random(50, 200);
      let b = random(50, 200);

      // 1文字につき1ブロックを追加
      let x = random(width);
      let y = random(height);

      displayBlocks.push({ x, y, color: color(r, g, b), layer: layerCount });
    }
  } else {
    // 画面が埋まった後はブロックを重ねる
    let r = random(50, 200);
    let g = random(50, 200);
    let b = random(50, 200);

    // 新しいレイヤーを追加（重なり合う形で）
    let x = random(width);
    let y = random(height);
    displayBlocks.push({ x, y, color: color(r, g, b), layer: layerCount });
  }
}

// 累積された文字数が300に達したときにブロックを整列
function arrangeBlocksInGrid() {
  let cols = Math.floor(width / blockSize); // 列数（幅に合わせて計算）
  let rows = Math.floor(height / blockSize); // 行数（高さに合わせて計算)

  let cellW = width / cols; // セルの幅（ブロックサイズに合わせて調整）
  let cellH = height / rows; // セルの高さ（ブロックサイズに合わせて調整）

  // ランダム配置されたブロックを整列
  for (let i = 0; i < displayBlocks.length; i++) {
    let c = i % cols; // 列の計算
    let r = Math.floor(i / cols); // 行の計算
    displayBlocks[i].x = c * cellW; // セル幅に合わせて配置
    displayBlocks[i].y = r * cellH; // セル高さに合わせて配置
  }

  console.log('Blocks have been aligned in a grid.');
}

// テキストの更新とブロック追加処理
function updateTextDisplay() {
  const newText = currentText.slice(lastText.length);
  addBlocksForText(newText); // 1文字ごとに1ブロックを追加
  lastText = currentText;
  accumulatedText += newText; // 累積テキストを更新

  // 文字数が300に達したら整列
  if (accumulatedText.length >= 300 && !isGridFilled) {
    // 300文字に達したタイミングで整列（4:3エリアが埋まっていない場合のみ）
    if (displayBlocks.length >= maxBlocks) {
      isGridFilled = true; // 画面が埋まった
    }
    arrangeBlocksInGrid();
    accumulatedText = ""; // 累積をリセットして次の300文字を待機

    // 新しいレイヤーを追加
    layerCount++;
  }
}
