$(document).on('turbolinks:load', function() {
  // パスの取得
  let pathName = location.pathname;
  // games/以降のパスが、showアクションによるid番号になっているかどうかを判断したいため、pathNameの最後の一文字を取得する
  let lastPathName = Number(pathName.slice(-1));

  // スコープを制限するため、pathNameにeasyが含まれている時、pathNameにnormalが含まれている時、pathNameにhardが含まれている時、
  // またpathNameの最後の一文字がshowアクションによるid番号になっている時に読み込むようにする
  if (pathName.includes("/easy") || pathName.includes("/normal") || pathName.includes("/hard") || pathName.includes("/hell") || Number.isInteger(lastPathName)) {
    if (pathName.includes("/easy")) {
      // 難易度easyの場合の総マス数の指定(6x6=36マス)
      var totalNum = 36
    } else if(pathName.includes("/normal")) {
      // 難易度normalの場合の総マス数の指定(9x9=81マス)
      var totalNum = 81
    } else if(pathName.includes("/hard")) {
      // 難易度hardの場合の総マス数の指定(12x12=144マス)
      var totalNum = 144
    } else if (pathName.includes("/hell")) {
      // 難易度hellの場合の総マス数の指定(16x16=256マス)
      var totalNum = 256
    } else if (Number.isInteger(lastPathName)) {
      // showアクションによる作成された問題の時の総マス数の指定
      let createdQuestionCell = gon.created.cell
      var totalNum = createdQuestionCell ** 2
    }


    // ゲーム盤面のサイズ指定
    const boardSize = 720

    // totalNumの平方根を求めることによって、ゲーム盤面の一辺のマスの数を取得(?x?マスの?の部分を取得する)
    const maxNumBox = Math.sqrt(totalNum);

    // 盤面の一辺の長さを求め、そこからひとマス当たりの一辺の長さを求める
    const oneSideNum = boardSize / maxNumBox

    // 実際にゲームを行う盤面の左上の角のx座標およびy座標をそれぞれ360px,10pxとする
    const x = 360
    const y = 10

    // 難易度の関係上、2,3,5以外の素数を除外し、maxNumBox以下の整数を配列にする
    // この処理により、allNumsという配列はeasyなら[2, 3, 4, 5, 6]、normalなら[2, 3, 4, 5, 6, 8, 9]、hardなら[2, 3, 4, 5, 6, 8, 9, 10, 12]となる
    const primeNums = [];
    const minPrime = 7
    const maxPrime = maxNumBox
    const range = function(min, max){
      return [...Array(max - min + 1).keys()].map(value => value + min)
    }
    range(minPrime, maxPrime).filter( prime => {
        const roundPrime = Math.round(Math.sqrt(prime))
        return range(2,roundPrime).every(value => {
            return prime % value != 0 
        })
    }).forEach(prime => primeNums.push(prime))
    const allNums = [];
    for (let i = 2; i <= maxNumBox; i++) {
      if (primeNums.indexOf(i) === -1) {
        allNums.push(i)
      }
    }

    // のちに必要になるため、allNumsそれぞれに1x?以外の掛け算のパターンがあるか判断し、あればそれを配列に、ない場合は空の配列にする
    // ない場合に空にする理由は配列のindex番号を利用するため
    // この処理により、divisorAllNumsという配列はeasyなら[(2)[], (3)[], (4)[2x2], (5)[], (6)[2x3, 3x2]]、normalなら[[], [], [2x2], [], [2x3, 3x2], [2x4, 4x2], [3x3]]、hardなら[[], [], [2x2], [], [2x3, 3x2], [2x4, 4x2], [3x3], [2x5, 5x2], [2x6, 3x4, 4x3, 6x2]]となる
    let divisorAllNums = []
    allNums.forEach(function (organizeNum) {
      let array = []
      for (let i = 2; i < organizeNum - 1; i++) {
        if (organizeNum % i == 0) {
          array.push(i)
        }
      }
      divisorAllNums.push(array)
    });
    divisorAllNums.forEach(function (dAllNum, index) {
      let maxI = dAllNum.length
      let maxJ = allNums[index]
      for (let i = 0; i < maxI; i++) {
        let j = dAllNum[i]
        let divisorJ = maxJ / j
        dAllNum.splice(i, 1, `${j}x${divisorJ}`);
      }
    });

    // 上記と同じように場合分けする
    // xujiとxujiPositionは配列のindex番号でそれぞれ対応している
    // (例えばeasyであれば、座標600:10のマスに5の数字が書き込まれ、座標600:130のマスに3の数字が書き込まれ...となっている)
    // showアクションによる作成された問題の場合は、gonというgemを用いることにより、railsのコントローラ内の変数を利用できるようにし、データベースのデータを取得している
    if (pathName.includes("/easy")) {
      var xuji = [5, 3, 2, 5, 6, 4, 2, 2, 4, 3]
      var xujiPositions = ["600:10", "600:130", "840:130", "960:250", "360:370", "720:370", "840:490", "480:610", "600:610", "960:610"]
    } else if (pathName.includes("/normal")) {
      var xuji = [6, 9, 6, 4, 3, 2, 5, 4, 5, 3, 8, 3, 8, 9, 4, 2]
      var xujiPositions = ["360:10", "840:90", "520:170", "680:170", "440:250", "680:250", "1000:250", "360:330", "600:330", "520:410", "920:410", "1000:490", "440:570", "760:570", "600:650", "1000:650"]
    } else if (pathName.includes("/hard")) {
      var xuji = [8, 8, 3, 9, 5, 12, 5, 6, 4, 4, 4, 6, 3, 6, 3, 3, 8, 10, 4, 6, 5, 10, 12]
      var xujiPositions = ["540:10", "960:10", "780:70", "360:130", "420:190", "840:190", "600:250", "780:250", "1020:250", "480:310", "660:310", "960:310", "420:370", "720:370", "600:430", "660:430", "840:430", "420:490", "1020:490", "600:550", "780:550", "900:610", "480:670"]
    } else if (pathName.includes("/hell")) {
      var xuji =[8, 6, 4, 10, 9, 10, 15, 16, 12, 14, 3, 2, 8, 5, 4, 3, 4, 5, 9, 12, 3, 8, 6, 9, 16, 8, 12, 4, 15, 10, 6]
      var xujiPositions = ["495:10", "810:10", "675:55", "945:55", "450:100", "630:145", "855:145", "765:190", "405:235", "990:235", "495:280", "585:280", "720:280", "630:325", "990:325", "675:370", "855:370", "900:370", "495:415", "810:415", "495:460", "1035:460", "765:505", "900:505", "360:550", "720:550", "495:595", "675:595", "945:640", "540:685", "810:685"]
    } else if (Number.isInteger(lastPathName)) {
      var xuji = gon.created.xuji.split(",");
      var xujiPositions = gon.created.position.split(",");
    }

    // ゲーム盤面の全てのマスの描写
    // まずlightgray色の720x720の正方形を描写し、その後(maxNumBox + 1)回かけて
    // ひとマスの一辺の長さずつ幅をとりながらそれぞれ縦横と直線を引いていくことにより、?x?のマスのゲーム盤面を描写している
    let canvasBoard = document.getElementById('canvasBoard');
    let ctxBoard = canvasBoard.getContext('2d');
    canvasBoard.width = boardSize;
    canvasBoard.height = boardSize;
    ctxBoard.fillStyle = 'lightgray';
    ctxBoard.fillRect(0, 0, boardSize, boardSize);
    for (let i = 0, j = maxNumBox + 1; i < j; i++) {
      ctxBoard.beginPath();
      ctxBoard.moveTo(i * oneSideNum, 0);
      ctxBoard.lineTo(i * oneSideNum, boardSize);
      ctxBoard.moveTo(0, i * oneSideNum);
      ctxBoard.lineTo(boardSize, i * oneSideNum);
      ctxBoard.stroke();
    }

    // ゲーム盤面のひとマスひとマスのx座標およびy座標を取得し、positionという配列にする
    // easyなら36個全ての座標の配列、normalなら81個全ての座標の配列、hardなら144個全ての座標の配列となる
    // また、配列にすると同時にcanvasも生成し、ひとマスひとマスにその座標のデータ属性を持たせる
    let position = []
    for(let i = 0, j = maxNumBox; i < j; i++) {
      for(let k = 0; k < j; k++) {
        let index = i * j + k
        position.push(`${x + oneSideNum * k}:${y + oneSideNum * i}`);
        var canvas = document.createElement("canvas");
        $(".playbackground__main--xuji").append(canvas);
        $(`.playbackground__main--xuji canvas:eq(${index})`).attr('id','canvas' + index);
        eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
        eval("var ctx" + index + " = canvas" + index + ".getContext('2d');");
        eval("canvas" + index + ".width = " + `${oneSideNum}` + ";");
        eval("canvas" + index + ".height = " + `${oneSideNum}` + ";");
        $(`.playbackground__main--xuji canvas:eq(${index})`).attr('data-onOff','off');
        $(`.playbackground__main--xuji canvas:eq(${index})`).attr('data-position',`${x + oneSideNum * k}:${y + oneSideNum * i}`);
      }
    };
    // 先ほど持たせた座標のデータ属性とxujiPositionの座標が一致するマスのcanvasに対して数字を描くと同時に、
    // 数字が描かれていることがわかるように、data-onOffというデータ属性をonにしておく
    for (let i = 0, j = xujiPositions.length; i < j; i++) {
      let xujiPosition = xujiPositions[i]
      $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-onOff', "on");
      $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).css('cursor', 'pointer');
      var canvasIdNum = $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('id');
      let iIndex = canvasIdNum.indexOf("s");
      let idNum = Number(canvasIdNum.slice(iIndex + 1));
      eval("ctx" + idNum + ".textAlign = 'center';");
      eval("ctx" + idNum + ".textBaseline = 'middle';");
      eval("ctx" + idNum + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      eval("ctx" + idNum + ".fillStyle = 'rgba(0, 0, 0, 0.8)';");
      eval("ctx" + idNum + ".fillText('" + `${xuji[i]}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
    };

    // 2つの配列の共通する要素を削除する関数overlapAllDeleteを定義([0,1,2,3] + [3,1,0] => [2])
    const overlapAllDelete = (array1, array2) => {
      return [...array1, ...array2].filter(value => !array1.includes(value) || !array2.includes(value));
    }
    let totalXujiPositions = []
    for (let i = 0, j = xuji.length; i < j; i++) {
      let allXujiPositions = []
      let totalPosition = overlapAllDelete(position, xujiPositions);
      let xujiNum = Number(xuji[i]);
      let xujiPosition = xujiPositions[i]
      let colonIndex = xujiPosition.indexOf(":");
      let xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      let xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      let rightPositions = []
      let leftPositions = []
      let upPositions = []
      let downPositions = []
      for (let k = 1, l = xujiNum; k < l; k++) {
        let matchPosition = `${xujiPositionX + oneSideNum * k}:${xujiPositionY}`
        let rightPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--xuji canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (rightPosition === undefined) {
          break;
        }
        rightPositions.push(rightPosition);
      }
      for (let k = 1, l = xujiNum; k < l; k++) {
        let matchPosition = `${xujiPositionX - oneSideNum * k}:${xujiPositionY}`
        let leftPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--xuji canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (leftPosition === undefined) {
          break;
        }
        leftPositions.push(leftPosition);
      }
      for (let k = 1, l = xujiNum; k < l; k++) {
        let matchPosition = `${xujiPositionX}:${xujiPositionY + oneSideNum * k}`
        let upPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--xuji canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (upPosition === undefined) {
          break;
        }
        upPositions.push(upPosition);
      }
      for (let k = 1, l = xujiNum; k < l; k++) {
        let matchPosition = `${xujiPositionX}:${xujiPositionY - oneSideNum * k}`
        let downPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--xuji canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (downPosition === undefined) {
          break;
        }
        downPositions.push(downPosition);
      }
      let leftAndRightPositions = [xujiPosition]
      leftAndRightPositions.push(...rightPositions)
      leftAndRightPositions.push(...leftPositions)
      leftAndRightPositions.sort(function (oneP1, oneP2) {
        let colonIndex = oneP1.indexOf(":");
        let oneP1X = Number(oneP1.slice(0, colonIndex));
        colonIndex = oneP2.indexOf(":");
        let oneP2X = Number(oneP2.slice(0, colonIndex));
        return (oneP1X > oneP2X ? 1 : -1);
      });
      if (leftAndRightPositions.length >= xujiNum) {
        for (let k = 0, l = leftAndRightPositions.length - xujiNum + 1; k < l; k++) {
          allXujiPositions.push(leftAndRightPositions.slice(k, k + xujiNum))
        }
      }
      let upAndDownPositions = [xujiPosition]
      upAndDownPositions.push(...upPositions)
      upAndDownPositions.push(...downPositions)
      upAndDownPositions.sort(function (oneP1, oneP2) {
        let colonIndex = oneP1.indexOf(":");
        let oneP1Y = Number(oneP1.slice(colonIndex + 1));
        colonIndex = oneP2.indexOf(":");
        let oneP2Y = Number(oneP2.slice(colonIndex + 1));
        return (oneP1Y > oneP2Y ? 1 : -1);
      });
      if (upAndDownPositions.length >= xujiNum) {
        for (let k = 0, l = upAndDownPositions.length - xujiNum + 1; k < l; k++) {
          allXujiPositions.push(upAndDownPositions.slice(k, k + xujiNum))
        }
      }
      let xujiIndex = allNums.indexOf(xujiNum)
      let otherPattern = divisorAllNums[xujiIndex]
      if (otherPattern.length > 0) {
        for (let k = 0, l = otherPattern.length; k < l; k++) {
          let oneOtherPattern = otherPattern[k]
          let xIndex = oneOtherPattern.indexOf("x");
          let otherPatternX = Number(oneOtherPattern.slice(0, xIndex));
          let otherPatternY = Number(oneOtherPattern.slice(xIndex + 1));
          let xujiOtherPosition = `${xujiPositionX - oneSideNum * (otherPatternX - 1)}:${xujiPositionY - oneSideNum * (otherPatternY - 1)}`
          let colonIndex = xujiOtherPosition.indexOf(":");
          let otherPositionX = Number(xujiOtherPosition.slice(0, colonIndex));
          let otherPositionY = Number(xujiOtherPosition.slice(colonIndex + 1));
          for (let m = 0, n = otherPatternX; m < n; m++) {
            block: for (let o = 0, p = otherPatternY; o < p; o++) {
              let oneOtherPosition = `${otherPositionX + oneSideNum * m}:${otherPositionY + oneSideNum * o}`
              let checkOneOtherPosition = totalPosition.find(oneP => oneP == oneOtherPosition && $(`.playbackground__main--xuji canvas[data-position='${oneOtherPosition}']`).attr('data-onOff') == "off");
              if (checkOneOtherPosition === undefined && oneOtherPosition != xujiPosition) {
                continue block;
              } else {
                let provisionalArray = []
                for (let q = 0; q < n; q++) {
                  for (let r = 0; r < p; r++) {
                    let colonIndex = oneOtherPosition.indexOf(":");
                    let oneOtherPositionX = Number(oneOtherPosition.slice(0, colonIndex));
                    let oneOtherPositionY = Number(oneOtherPosition.slice(colonIndex + 1));
                    let oneOtherSetPosition = `${oneOtherPositionX + oneSideNum * q}:${oneOtherPositionY + oneSideNum * r}`
                    let checkOneOtherSetPosition = totalPosition.find(oneP => oneP == oneOtherSetPosition && $(`.playbackground__main--xuji canvas[data-position='${oneOtherSetPosition}']`).attr('data-onOff') == "off");
                    if (checkOneOtherSetPosition === undefined && oneOtherSetPosition != xujiPosition) {
                      continue block;
                    } else {
                      provisionalArray.push(oneOtherSetPosition);
                    }
                  }
                  if (provisionalArray.length == xujiNum) {
                    allXujiPositions.push(provisionalArray);
                  }
                }
              }
            }
          }
        }
        totalXujiPositions.push(allXujiPositions)
      } else {
        totalXujiPositions.push(allXujiPositions)
      }
    }
    // 1つの配列内の重複要素を無くす関数overlapIsOneを定義([3,0,1,0,1,2,3,3] => [3,0,1,2])
    const overlapIsOne = (array) => {
      return array.filter((value, index, self) => self.indexOf(value) === index);
    }
    let lastClickedXuji = []
    for (let i = 0, j = xuji.length; i < j; i++) {
      let xujiPosition = xujiPositions[i]
      let clickNum = {[i]: 0};
      var canvasIdNum = $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('id');
      let iIndex = canvasIdNum.indexOf("s");
      let idNum = Number(canvasIdNum.slice(iIndex + 1));
      $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-clickNum', clickNum[i]);
      var canvas = document.createElement("canvas");
      $(".playbackground__main--boxuji").append(canvas);
      $(`.playbackground__main--boxuji canvas:eq(${i})`).attr("id", "canvas" + idNum + "boxuji");
      $(`.playbackground__main--boxuji canvas:eq(${i})`).css("position", "absolute");
      eval("var canvas" + idNum + "boxuji = document.getElementById('canvas" + idNum + "boxuji');");
      eval("var ctx" + idNum + "boxuji = canvas" + idNum + "boxuji.getContext('2d');");
      eval("canvas" + idNum + "boxuji.width = " + `${boardSize}` + ";");
      eval("canvas" + idNum + "boxuji.height = " + `${boardSize}` + ";");
      $(".playbackground__main--xuji").on("click", `canvas[data-position='${xujiPosition}']`, function() {
        return function() {
          let num = Number($(this).attr('data-clickNum'));
          num = num + 1
          $(this).attr('data-clickNum', num);
          let xujiIndex = this.id
          let sIndex = xujiIndex.indexOf("s");
          let index = Number(xujiIndex.slice(sIndex + 1));
          if (lastClickedXuji[lastClickedXuji.length - 1] != index) {
            lastClickedXuji.push(index);
            lastClickedXuji = (overlapIsOne(lastClickedXuji.reverse())).reverse();
          }
          let xujiPosition = $(`.playbackground__main--xuji canvas:eq(${index})`).attr('data-position');
          let xujiPositionIndex = xujiPositions.indexOf(xujiPosition);
          let xujiAllPositions = totalXujiPositions[xujiPositionIndex]
          let xujiAllPositionsLength = xujiAllPositions.length
          let xujiOnePositions = xujiAllPositions[num - 1]
          let xujiHavePositions = $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-xujiHavePositions');
          if (xujiHavePositions != undefined) {
            xujiHavePositions = xujiHavePositions.split(",");
            eval("ctx" + index + "boxuji.clearRect(0, 0, " + `${boardSize}` + ", " + `${boardSize}` + ");");
          }
          let firstXujiOnePosition = xujiOnePositions[0]
          let colonIndex = firstXujiOnePosition.indexOf(":");
          let firstXujiOnePositionX = Number(firstXujiOnePosition.slice(0, colonIndex)) - x;
          let firstXujiOnePositionY = Number(firstXujiOnePosition.slice(colonIndex + 1)) - y;
          let lastXujiOnePosition = xujiOnePositions[xujiOnePositions.length - 1]
          colonIndex = lastXujiOnePosition.indexOf(":");
          let lastXujiOnePositionX = Number(lastXujiOnePosition.slice(0, colonIndex)) - x + oneSideNum;
          let lastXujiOnePositionY = Number(lastXujiOnePosition.slice(colonIndex + 1)) - y + oneSideNum;
          eval("ctx" + index + "boxuji.beginPath();");
          eval("ctx" + index + "boxuji.moveTo(" + `${firstXujiOnePositionX}` + "," + `${firstXujiOnePositionY}` + ");");
          eval("ctx" + index + "boxuji.lineTo(" + `${lastXujiOnePositionX}` + "," + `${firstXujiOnePositionY}` + ");");
          eval("ctx" + index + "boxuji.lineTo(" + `${lastXujiOnePositionX}` + ", " + `${lastXujiOnePositionY}` + ");");
          eval("ctx" + index + "boxuji.lineTo(" + `${firstXujiOnePositionX}` + ", " + `${lastXujiOnePositionY}` + ");");
          eval("ctx" + index + "boxuji.closePath();");
          eval("ctx" + index + "boxuji.fillStyle = 'rgba(0,255,0,0.4)';");
          eval("ctx" + index + "boxuji.strokeStyle = 'red';");
          eval("ctx" + index + "boxuji.lineWidth = 3;");
          eval("ctx" + index + "boxuji.fill();");
          eval("ctx" + index + "boxuji.stroke();");
          $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-xujiHavePositions', [...xujiOnePositions]);
          if (num == xujiAllPositionsLength) {
            $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-clickNum', 0);
          }
          let setXujiPositions = []
          for (let i = 0, j = xuji.length; i < j; i++) {
            let xujiPosition = xujiPositions[i]
            var canvasIdNum = $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('id');
            let iIndex = canvasIdNum.indexOf("s");
            let idNum = Number(canvasIdNum.slice(iIndex + 1));
            let oneSetXujiPositions = $(`.playbackground__main--xuji canvas:eq(${idNum})`).attr('data-xujiHavePositions');
            if (oneSetXujiPositions == undefined) {
              break;
            }
            oneSetXujiPositions = oneSetXujiPositions.split(",");
            setXujiPositions.push(...oneSetXujiPositions);
            if (overlapAllDelete(position, setXujiPositions).length == 0) {
              setTimeout(alertTime, 50);
              function alertTime() {
                alert('Game Clear！')
                if (pathName.includes("/easy")) {
                  $(".playbackground__normalbtn").show();
                }
                if (pathName.includes("/normal")) {
                  $(".playbackground__hardbtn").show();
                }
                if (pathName.includes("/hard")) {
                  $(".playbackground__hellbtn").show();
                }
              }
            }
          }
        }
      }())
    }
    $(".playbackground__footer--left").on("click", "#xujiClearBtn", function() {
      if (lastClickedXuji.length > 0) {
        let lastClickedXujiIndex = lastClickedXuji.pop();
        eval("ctx" + lastClickedXujiIndex + "boxuji.clearRect(0, 0, " + `${boardSize}` + ", " + `${boardSize}` + ");");
        $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).removeAttr('data-xujiHavePositions');
        $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', 0);
      } else {
        alert('Nothing to clear.')
      }
    })
    $(".playbackground__footer--left").on("click", "#xujiResetBtn", function() {
      if (lastClickedXuji.length > 0) {
        for (let i = 0, j = xuji.length; i < j; i++) {
          lastClickedXuji.length = 0
          let xujiPosition = xujiPositions[i]
          var canvasIdNum = $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('id');
          let iIndex = canvasIdNum.indexOf("s");
          let idNum = Number(canvasIdNum.slice(iIndex + 1));
          eval("ctx" + idNum + "boxuji.clearRect(0, 0, " + `${boardSize}` + ", " + `${boardSize}` + ");");
          $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).removeAttr('data-xujiHavePositions');
          $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-clickNum', 0);
        }
      } else {
        alert('Nothing to reset.')
      }
    })
    $(".playbackground__footer--right").on("click", "#xujiReturnBtn", function() {
      if (lastClickedXuji.length > 0) {
        let lastClickedXujiIndex = lastClickedXuji[lastClickedXuji.length - 1];
        let clickedXujiPosition = $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-position');
        let xujiPositionIndex = xujiPositions.indexOf(clickedXujiPosition);
        let xujiAllPositions = totalXujiPositions[xujiPositionIndex]
        let xujiAllPositionsLength = xujiAllPositions.length
        if (xujiAllPositionsLength != 1) {
          let num = $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum');
          if (num == 0) {
            $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', `${xujiAllPositions.length - 1}`);
            let lastClickedXujiPositions = totalXujiPositions[xujiPositionIndex]
            var xujiOnePositions = lastClickedXujiPositions[xujiAllPositions.length - 2]
          } else if (num == 1) {
            $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', 0);
            xujiOnePositions = xujiAllPositions[xujiAllPositions.length - 1]
          } else {
            let xujiAllPositions = totalXujiPositions[xujiPositionIndex]
            $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', `${num - 1}`);
            xujiOnePositions = xujiAllPositions[num - 2]
          }
          let firstXujiOnePosition = xujiOnePositions[0]
          let colonIndex = firstXujiOnePosition.indexOf(":");
          let firstXujiOnePositionX = Number(firstXujiOnePosition.slice(0, colonIndex)) - x;
          let firstXujiOnePositionY = Number(firstXujiOnePosition.slice(colonIndex + 1)) - y;
          let lastXujiOnePosition = xujiOnePositions[xujiOnePositions.length - 1]
          colonIndex = lastXujiOnePosition.indexOf(":");
          let lastXujiOnePositionX = Number(lastXujiOnePosition.slice(0, colonIndex)) - x + oneSideNum;
          let lastXujiOnePositionY = Number(lastXujiOnePosition.slice(colonIndex + 1)) - y + oneSideNum;
          eval("ctx" + lastClickedXujiIndex + "boxuji.clearRect(0, 0, " + `${boardSize}` + ", " + `${boardSize}` + ");");
          eval("ctx" + lastClickedXujiIndex + "boxuji.beginPath();");
          eval("ctx" + lastClickedXujiIndex + "boxuji.moveTo(" + `${firstXujiOnePositionX}` + "," + `${firstXujiOnePositionY}` + ");");
          eval("ctx" + lastClickedXujiIndex + "boxuji.lineTo(" + `${lastXujiOnePositionX}` + "," + `${firstXujiOnePositionY}` + ");");
          eval("ctx" + lastClickedXujiIndex + "boxuji.lineTo(" + `${lastXujiOnePositionX}` + ", " + `${lastXujiOnePositionY}` + ");");
          eval("ctx" + lastClickedXujiIndex + "boxuji.lineTo(" + `${firstXujiOnePositionX}` + ", " + `${lastXujiOnePositionY}` + ");");
          eval("ctx" + lastClickedXujiIndex + "boxuji.closePath();");
          eval("ctx" + lastClickedXujiIndex + "boxuji.fillStyle = 'rgba(0,255,0,0.4)';");
          eval("ctx" + lastClickedXujiIndex + "boxuji.strokeStyle = 'red';");
          eval("ctx" + lastClickedXujiIndex + "boxuji.lineWidth = 3;");
          eval("ctx" + lastClickedXujiIndex + "boxuji.fill();");
          eval("ctx" + lastClickedXujiIndex + "boxuji.stroke();");
          $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-xujiHavePositions', [...xujiOnePositions]);
          let setXujiPositions = []
          for (let i = 0, j = xuji.length; i < j; i++) {
            let xujiPosition = xujiPositions[i]
            var canvasIdNum = $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('id');
            let iIndex = canvasIdNum.indexOf("s");
            let idNum = Number(canvasIdNum.slice(iIndex + 1));
            let oneSetXujiPositions = $(`.playbackground__main--xuji canvas:eq(${idNum})`).attr('data-xujiHavePositions');
            if (oneSetXujiPositions == undefined) {
              break;
            }
            oneSetXujiPositions = oneSetXujiPositions.split(",");
            setXujiPositions.push(...oneSetXujiPositions);
            if (overlapAllDelete(position, setXujiPositions).length == 0) {
              setTimeout(alertTime, 50);
              function alertTime() {
                alert('Game Clear！')
                if (pathName.includes("/easy")) {
                  $(".playbackground__normalbtn").show();
                }
                if (pathName.includes("/normal")) {
                  $(".playbackground__hardbtn").show();
                }
                if (pathName.includes("/hard")) {
                  $(".playbackground__hellbtn").show();
                }
              }
            }
          }
        }
      } else {
        alert('Nothing to return.')
      }
    })
  }
})


      // 問題をランダムに作成する処理を完成させようとしたが、難しいため保留
      // 取得したランダムのマス数のboxを繰り返し足していきつつ、合計がtotalNumに満たなければそのboxを配列に入れるという処理を、
      // 合計がtotalNumと一致するまで繰り返す
      // let totalRandNum = [];
      // const sum  = function(arr) {
      //   return arr.reduce(function(prev, current, i, arr) {
      //       return prev + current;
      //   }, 0);
      // };
      // while (sum(totalRandNum) != totalNum) {
      //   if (sum(totalRandNum) < totalNum) {
      //     totalRandNum.push(allNums[Math.floor(Math.random() * allNums.length)])
      //   } else if(sum(totalRandNum) > totalNum) {
      //     totalRandNum.length = 0
      //     totalRandNum.push(allNums[Math.floor(Math.random() * allNums.length)])
      //   }
      // };
      // console.log(totalRandNum)

      // totalRandNumをひとつひとつ取り出しながら、その数字を1からその数字までの中で割り切れる数字を見つけ出し、
      // divisorTotalRandNumという配列に入れる
      // let divisorTotalRandNum = [];
      // totalRandNum.forEach(function(oneRandNum) {
      //   let divisorRandNum = [];
      //   for(let i = 1; i <= oneRandNum; i++) {
      //     if (oneRandNum % i == 0) {
      //       divisorRandNum.push(i)
      //     }
      //   }
      //   divisorTotalRandNum.push(divisorRandNum)
      // })
      // console.log(divisorTotalRandNum)

      // 配列をランダムでシャッフルする関数を作り、
      // divisorTotalRandNumをひとつひとつ取り出しながら、配列中の数字のみを使って、
      // 結果が配列の最後の数字と一致する掛け算の式を見つけ、求めたひとマス当たりの一辺の長さを掛け、
      // そしてランダムにシャッフルし、multiplicationTotalRandNumという配列に入れる
      // function shuffle(array) {
      //   let n = array.length, indexT, randN;
      //   while (n) {
      //     randN = Math.floor(Math.random() * n--);
      //     indexT = array[n];
      //     array[n] = array[randN];
      //     array[randN] = indexT;
      //   }
      //   return array;
      // }
      // let multiplicationTotalRandNum = [];
      // divisorTotalRandNum.forEach(function(divisorOneRandNum) {
      //   let maxI = divisorOneRandNum.length
      //   let maxJ = divisorOneRandNum[divisorOneRandNum.length - 1]
      //   for(let i = 0; i < maxI; i++) {
      //     j = divisorOneRandNum[i]
      //     let multiplicationJ = maxJ / j
      //     divisorOneRandNum.splice(i, 1, `${j}x${multiplicationJ}`);
      //     divisorOneRandNum.splice(i, 1, `${j * oneSideNum}x${multiplicationJ * oneSideNum}`);
      //   }
      //   shuffle(divisorOneRandNum)
      //   multiplicationTotalRandNum.push(divisorOneRandNum)
        // totalRandNumが[5, 3, 5, 3, 5, 4, 6, 5]だった場合、
        // divisorTotalRandNumは[[1, 5], [1, 3], [1, 5], [1, 3], [1, 5], [1, 2, 4], [1, 2, 3, 6], [1, 5]]になり、
        // multiplicationTotalRandNumは最終的に[["120x600", "600x120"], ["120x360", "360x120"], ["120x600", "600x120"], ["120x360", "360x120"], ["120x600", "600x120"], ["120x480", "240x240", "480x120"], ["120x720", "240x360", "360x240", "720x120"], ["120x600", "600x120"]]となる
      // })
      // console.log(multiplicationTotalRandNum)

      // ここで、ゲームの盤面である.easybackground__boardの4つの角の座標を取得する
      // (x, y)が左上の角、(x + 720, y)が右上の角、(x, y + 720)が左下の角、(x + 720, y + 720)が右下の角となる
      // また、難易度に応じた、マスの4つの角の座標を全て配列にする(重複はしないようにする)
      // let x = Number($(".easybackground__box").offset().left);
      // let y = Number($(".easybackground__box").offset().top);
      // let position = []
      // for(let i = 0; i < maxNumBox; i++) {
      //   for(let j = 0; j < maxNumBox; j++) {
      //     position.push(`${360 + oneSideNum * j}:${40 + oneSideNum * i}`)
      //   }
      // };
      // console.log(position)
      // for (let i = 0; i < totalNum / 2; i++) {
      //   var canvas = document.createElement("canvas");
      //   $(".easybackground__box").append(canvas);
      //   $(`.easybackground__box canvas:eq(${i})`).attr('id','canvas' + i);
      //   var canvas = document.createElement("canvas");
      //   $(".easybackground__xuji").append(canvas);
      //   $(`.easybackground__xuji canvas:eq(${i})`).attr('id','canvas' + i + 'xuji');
      // }

      // console.log(totalRandNum)
      // let divisorAllNums = []
      // allNums.forEach(function (organizeNum) {
      //   let array = []
      //   for (let i = 1; i < organizeNum + 1; i++) {
      //     if (organizeNum % i == 0) {
      //       array.push(i)
      //     }
      //   }
      //   divisorAllNums.push(array)
      // });
      // console.log(divisorAllNums)
      // divisorAllNums.forEach(function (dAllNum) {
      //   let maxI = dAllNum.length
      //   let maxJ = dAllNum[maxI - 1]
      //   for (let i = 0; i < maxI; i++) {
      //     let j = dAllNum[i]
      //     let divisorJ = maxJ / j
      //     dAllNum.splice(i, 1, `${j}x${divisorJ}`);
      //   }
      // });
      // console.log(divisorAllNums)
      // let totalNumPosition = []
      // divisorAllNums.forEach(function (dRandNum) {
      //   let numPosition = []
      //   for (let i = 0; i < dRandNum.length; i++) {
      //     let oneNumPosition = dRandNum[i]
      //     let xIndex = oneNumPosition.indexOf("x");
      //     let oneNumPositionX = Number(oneNumPosition.slice(0, xIndex));
      //     let oneNumPositionY = Number(oneNumPosition.slice(xIndex + 1));
      //     let array = []
      //     for (let j = 0; j < oneNumPositionX; j++) {
      //       for (let k = 0; k < oneNumPositionY; k++) {
      //         array.push(`${j}:${k}`);
      //       }
      //     };
      //     numPosition.push(array)
      //   };
      //   totalNumPosition.push(numPosition)
      // });
      // console.log(totalNumPosition)

      // let totalPosition = []
      // let notTotalPosition = []
      // const check = (array1, array2) => {
      //   return array1.filter(value => array2.includes(value));
      // }
      // const out = (array3, array4) => {
      //   return [...array3, ...array4].filter(value => !array3.includes(value) || !array4.includes(value));
      // }
      // const cut = (array5) => {
      //   return array5.filter((value, index, self) => self.indexOf(value) === index);
      // }
      // const match = (array6) => {
      //   return array6.filter((value, index, self) => self.indexOf(value) === index && self.lastIndexOf(value) !== index);
      // }
      // const notMatch = (array7) => {
      //   return array7.filter((value, index, self) => self.indexOf(value) === self.lastIndexOf(value));
      // }
      // roop1: for (let index = 0; index < totalNum / 2; index++) {
      //   if (totalPosition.length > out(totalPosition, notTotalPosition).length) {
      //     let totalPosition = out(totalPosition, notTotalPosition);
      //   }
      //   console.log('indexindexindexindexindexindex')
      //   console.log(index)
      //   let notTotalPositionLength = notTotalPosition.length
      //   if (index == 0) {
      //     let randSize = allNums[Math.floor(Math.random() * allNums.length)]
      //     console.log(randSize)
      //     let sizeIndex = allNums.indexOf(randSize);
      //     let randPositions = totalNumPosition[sizeIndex]
      //     console.log(randPositions)
      //     let randPosition = randPositions[Math.floor(Math.random() * randPositions.length)]
      //     console.log(randPosition)
      //     for (let i = 0; i < randPosition.length; i++) {
      //       let setPosition = randPosition[i]
      //       console.log(setPosition)
      //       let colonIndex = setPosition.indexOf(":");
      //       let positionX = Number(setPosition.slice(0, colonIndex));
      //       console.log(positionX)
      //       let positionY = Number(setPosition.slice(colonIndex + 1));
      //       console.log(positionY)
      //       notTotalPosition.push(`${x + positionX * oneSideNum}:${y + positionY * oneSideNum}`);
      //       console.log(notTotalPosition)
      //     }
      //     let lastPosition = randPosition[randPosition.length - 1]
      //     let colonIndex = lastPosition.indexOf(":");
      //     let boxSizeX = ((Number(lastPosition.slice(0, colonIndex)) + 1) * oneSideNum);
      //     console.log(boxSizeX)
      //     let boxSizeY = ((Number(lastPosition.slice(colonIndex + 1)) + 1) * oneSideNum);
      //     console.log(boxSizeY)
      //     $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //     eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //     eval("canvas" + index + ".width = " + `${boxSizeX}` + ";");
      //     eval("canvas" + index + ".height = " + `${boxSizeY}` + ";");
      //     $(`#canvas${index}`).offset({top: y, left: x});
      //     $(`#canvas${index}`).css("position", "absolute");
      //     let xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //     let colonIndex = xujiPosition.indexOf(":");
      //     let xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //     let xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      //     $(`.easybackground__xuji canvas:eq(${index})`).attr('class','canvas' + randSize + "xuji");
      //     eval("var canvas" + index + "xuji" + " = document.getElementById('canvas" + `${index}` + "xuji" + "');");
      //     eval("var ctx" + index + "xuji" + " = canvas.getContext('2d');");
      //     eval("canvas" + `${index}` + "xuji" + ".width = " + `${oneSideNum}` + ";");
      //     eval("canvas" + index + "xuji" + ".height = " + `${oneSideNum}` + ";");
      //     eval("$('#canvas" + index + "xuji')" + ".offset({top: " + `${y + xujiPositionY * oneSideNum}` + ", left: " + `${x + xujiPositionX * oneSideNum}` + "});");
      //     eval("$('#canvas" + index + "xuji')" + ".css('position', 'absolute');");
      //     eval("ctx" + index + "xuji" + ".textAlign = 'center';");
      //     eval("ctx" + index + "xuji" + ".textBaseline = 'middle';");
      //     eval("ctx" + index + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //     eval("ctx" + index + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //     eval("ctx" + index + "xuji" + ".fillText('" + `${randSize}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //     if (boxSizeX < boardSize) {
      //       totalPosition.push(`${x + boxSizeX}:${y}`);
      //     }
      //     if (boxSizeY < boardSize) {
      //       totalPosition.push(`${x}:${y + boxSizeY}`);
      //     }
      //     console.log(totalPosition)
      //   };
      //   roop2: while (notTotalPosition.length == notTotalPositionLength) {
      //     let ifPosition = totalPosition.pop();
      //     console.log(totalPosition)
      //     console.log(ifPosition)
      //     console.log('????????????????????????????????????????????')
      //     let colonIndex = ifPosition.indexOf(":");
      //     let ifPositionX = Number(ifPosition.slice(0, colonIndex));
      //     console.log(ifPositionX)
      //     let ifPositionY = Number(ifPosition.slice(colonIndex + 1));
      //     console.log(ifPositionY)
      //     let randSize = allNums[Math.floor(Math.random() * allNums.length)]
      //     console.log(randSize)
      //     let sizeIndex = allNums.indexOf(randSize);
      //     let randPositions = totalNumPosition[sizeIndex]
      //     console.log(randPositions)
      //     let randPosition = randPositions[Math.floor(Math.random() * randPositions.length)]
      //     console.log(randPosition)
      //     let lastPosition = randPosition[randPosition.length - 1]
      //     let colonIndex = lastPosition.indexOf(":");
      //     let boxSizeX = ((Number(lastPosition.slice(0, colonIndex)) + 1) * oneSideNum);
      //     console.log(boxSizeX)
      //     let boxSizeY = ((Number(lastPosition.slice(colonIndex + 1)) + 1) * oneSideNum);
      //     console.log(boxSizeY)
      //     if (ifPositionX + boxSizeX > x + boardSize || ifPositionY + boxSizeY > y + boardSize) {
      //       if (ifPositionX + boxSizeY > x + boardSize || ifPositionY + boxSizeX > y + boardSize) {
      //         totalPosition.unshift(ifPosition);
      //         console.log('continue289')
      //         continue roop2;
      //       } else {
      //         console.log('else292')
      //         console.log(randPosition, randPositions)
      //         for (let i = 0; i < randPosition.length; i++) {
      //           let randPositionI = randPosition[i]
      //           let colonIndex = randPositionI.indexOf(":");
      //           let randPositionX = Number(randPositionI.slice(0, colonIndex));
      //           let randPositionY = Number(randPositionI.slice(colonIndex + 1));
      //           randPosition.splice(i, 1, `${randPositionY}:${randPositionX}`);
      //           console.log(randPosition)
      //         };
      //         let ifSetPosition = []
      //         for (let i = 0; i < randPosition.length; i++) {
      //           let randP = randPosition[i]
      //           let colonI = randP.indexOf(":");
      //           let randPX = Number(randP.slice(0, colonI));
      //           let randPY = Number(randP.slice(colonI + 1));
      //           ifSetPosition.push(`${ifPositionX + randPX * oneSideNum}:${ifPositionY + randPY * oneSideNum}`);
      //         };
      //         console.log(ifSetPosition)
      //         if (check(ifSetPosition, notTotalPosition).length > 0) {
      //           totalPosition.unshift(ifPosition);
      //           console.log('continue312')
      //           continue roop2;
      //         } else {
      //           for (let i = 0; i < ifSetPosition.length; i++) {
      //             notTotalPosition.push(ifSetPosition[i])
      //           }
      //           $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //           eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //           eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //           eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //           $(`#canvas${index}`).offset({top: `${ifPositionY}`, left: `${ifPosition}`});
      //           $(`#canvas${index}`).css("position", "absolute");
      //           let xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //           let colonIndex = xujiPosition.indexOf(":");
      //           let xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //           let xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      //           $(`.easybackground__xuji canvas:eq(${index})`).attr('class','canvas' + randSize + "xuji");
      //           eval("var canvas" + index + "xuji" + " = document.getElementById('canvas" + index + "xuji" + "');");
      //           eval("var ctx" + index + "xuji" + " = canvas.getContext('2d');");
      //           eval("canvas" + index + "xuji" + ".width = " + `${oneSideNum}` + ";");
      //           eval("canvas" + index + "xuji" + ".height = " + `${oneSideNum}` + ";");
      //           eval("$('#canvas" + index + "xuji')" + ".offset({top: " + `${ifPositionY + xujiPositionY * oneSideNum}` + ", left: " + `${ifPositionX + xujiPositionX * oneSideNum}` + "});");
      //           eval("$('#canvas" + index + "xuji')" + ".css('position', 'absolute');");
      //           eval("ctx" + index + "xuji" + ".textAlign = 'center';");
      //           eval("ctx" + index + "xuji" + ".textBaseline = 'middle';");
      //           eval("ctx" + index + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //           eval("ctx" + index + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //           eval("ctx" + index + "xuji" + ".fillText('" + `${randSize}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //           if (ifPositionX + boxSizeY < x + boardSize) {
      //             totalPosition.push(`${ifPositionX + boxSizeY}:${ifPositionY}`);
      //           }
      //           if (ifPositionY + boxSizeX < y + boardSize) {
      //             totalPosition.push(`${ifPositionX}:${ifPositionY + boxSizeX}`);
      //           }
      //           console.log(totalPosition)
      //           console.log('break357')
      //           break roop2;
      //         }
      //       }
      //     } else {
      //       console.log('else340')
      //       console.log(randPosition, randPositions)
      //       let ifSetPosition = []
      //       for (let i = 0; i < randPosition.length; i++) {
      //         let randP = randPosition[i]
      //         let colonI = randP.indexOf(":");
      //         let randPX = Number(randP.slice(0, colonI));
      //         let randPY = Number(randP.slice(colonI + 1));
      //         ifSetPosition.push(`${ifPositionX + randPX * oneSideNum}:${ifPositionY + randPY * oneSideNum}`);
      //       };
      //       console.log(ifSetPosition)
      //       if (check(ifSetPosition, notTotalPosition).length > 0) {
      //         totalPosition.unshift(ifPosition);
      //         console.log('continue312')
      //         continue roop2;
      //       } else {
      //         for (let i = 0; i < ifSetPosition.length; i++) {
      //           notTotalPosition.push(ifSetPosition[i])
      //         }
      //         $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //         eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //         eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //         eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //         $(`#canvas${index}`).offset({top: `${ifPositionY}`, left: `${ifPositionX}`});
      //         $(`#canvas${index}`).css("position", "absolute");
      //         let xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //         let colonIndex = xujiPosition.indexOf(":");
      //         let xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //         let xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      //         $(`.easybackground__xuji canvas:eq(${index})`).attr('class','canvas' + randSize + "xuji");
      //         eval("var canvas" + index + "xuji" + " = document.getElementById('canvas" + index + "xuji" + "');");
      //         eval("var ctx" + index + "xuji" + " = canvas.getContext('2d');");
      //         eval("canvas" + index + "xuji" + ".width = " + `${oneSideNum}` + ";");
      //         eval("canvas" + index + "xuji" + ".height = " + `${oneSideNum}` + ";");
      //         $(`#canvas${index}`).offset({top: `${ifPositionY + xujiPositionY * oneSideNum}`, left: `${ifPositionX + xujiPositionX * oneSideNum}`});
      //         $(`#canvas${index}`).css("position", "absolute");
      //         eval("ctx" + index + "xuji" + ".textAlign = 'center';");
      //         eval("ctx" + index + "xuji" + ".textBaseline = 'middle';");
      //         eval("ctx" + index + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //         eval("ctx" + index + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //         eval("ctx" + index + "xuji" + ".fillText('" + `${randSize}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //         if (ifPositionX + boxSizeX < x + boardSize) {
      //           totalPosition.push(`${ifPositionX + boxSizeX}:${ifPositionY}`);
      //         }
      //         if (ifPositionY + boxSizeY < y + boardSize) {
      //           totalPosition.push(`${ifPositionX}:${ifPositionY + boxSizeY}`);
      //         }
      //         console.log(totalPosition)
      //         console.log('break357')
      //         break roop2;
      //       }
      //     }
      //   }
      //   if (out(position, notTotalPosition).length <= maxNumBox) {
      //     console.log('else if!!!!!!!!!!!!!!!!!')
      //     let lastBoxPosition = out(position, notTotalPosition);
      //     console.log(lastBoxPosition)
      //     let allPositionX = []
      //     let allPositionY = []
      //     for (let i = 0; i < lastBoxPosition.length; i++) {
      //       let setPosition = lastBoxPosition[i]
      //       let colonIndex = setPosition.indexOf(":");
      //       let positionX = Number(setPosition.slice(0, colonIndex));
      //       allPositionX.push(positionX)
      //       let positionY = Number(setPosition.slice(colonIndex + 1));
      //       allPositionY.push(positionY)
      //     };
      //     let matchPositionX = match(allPositionX);
      //     let matchPositionY = match(allPositionY);
      //     console.log(matchPositionX)
      //     console.log(matchPositionY)
      //     let totalMatchPositions = []
      //     let totalMatchPositionsL = []
      //     for (let i = 0; i < matchPositionX.length; i++) {
      //       let totalMatchPositionX = []
      //       let pattern = new RegExp(`^${matchPositionX[i]}:`, "g");
      //       let matchPX = lastBoxPosition.filter(oneP => oneP.match(pattern));
      //       console.log(matchPX)
      //       for (let j = 0; j < matchPX.length - 1; j++) {
      //         let prev = matchPX[j]
      //         let colonIndex = prev.indexOf(":");
      //         let prevY = Number(prev.slice(colonIndex + 1));
      //         let next = matchPX[j + 1]
      //         let colonIndex = next.indexOf(":");
      //         let nextY = Number(next.slice(colonIndex + 1));
      //         if (prevY == nextY + oneSideNum || prevY + oneSideNum == nextY) {
      //           totalMatchPositionX.push(prev)
      //           totalMatchPositionX.push(next)
      //           let totalMatchPositionX = cut(totalMatchPositionX);
      //           console.log(totalMatchPositionX)
      //         }
      //       }
      //       if (totalMatchPositionX.length > 0) {
      //         totalMatchPositions.push(totalMatchPositionX);
      //         totalMatchPositionsL.push(totalMatchPositionX.length);
      //       }
      //     }
      //     console.log(totalMatchPositions, totalMatchPositionsL)
      //     for (let i = 0; i < matchPositionY.length; i++) {
      //       let totalMatchPositionY = []
      //       let pattern = new RegExp(`:${matchPositionY[i]}$`, "g");
      //       let matchPY = lastBoxPosition.filter(oneP => oneP.match(pattern));
      //       console.log(matchPY)
      //       for (let j = 0; j < matchPY.length - 1; j++) {
      //         let prev = matchPY[j]
      //         let colonIndex = prev.indexOf(":");
      //         let prevX = Number(prev.slice(0, colonIndex));
      //         let next = matchPY[j + 1]
      //         let colonIndex = next.indexOf(":");
      //         let nextX = Number(next.slice(0, colonIndex));
      //         if (prevX == nextX + oneSideNum || prevX + oneSideNum == nextX) {
      //           totalMatchPositionY.push(prev)
      //           totalMatchPositionY.push(next)
      //           let totalMatchPositionY = cut(totalMatchPositionY);
      //           console.log(totalMatchPositionY)
      //         }
      //       }
      //       if (totalMatchPositionY.length > 0) {
      //         totalMatchPositions.push(totalMatchPositionY)
      //         totalMatchPositionsL.push(totalMatchPositionY.length);
      //       }
      //     }
      //     console.log(totalMatchPositions, totalMatchPositionsL)
      //     console.log(sum(totalMatchPositionsL), lastBoxPosition.length)
      //     if (sum(totalMatchPositionsL) < lastBoxPosition.length) {
      //       notTotalPosition.length = 0
      //       totalPosition.length = 0
      //       let index = -1
      //       continue roop1;
      //     } else {
      //       let totalMatchPosition = []
      //       for (let i = 0; i < totalMatchPositions.length; i++) {
      //         totalMatchPosition.push(...totalMatchPositions[i])
      //       }
      //       console.log(totalMatchPosition, totalMatchPositions)
      //       let matchPosition = notMatch(totalMatchPosition)
      //       console.log(matchPosition)
      //       if (matchPosition.length == lastBoxPosition.length) {
      //         while (check(position, notTotalPosition).length == position.length) {
      //           let matchArray = []
      //           roop3: for (let i = 0; i < lastBoxPosition.length; i++) {
      //             for (let j = 1; j < lastBoxPosition.length; j++) {
      //               let lastPosition = lastBoxPosition[i]
      //               let colonIndex = setPosition.indexOf(":");
      //               let lastPositionX = Number(lastPosition.slice(0, colonIndex));
      //               allPositionX.push(positionX)
      //               let lastPositionY = Number(lastPosition.slice(colonIndex + 1));
      //               allPositionY.push(positionY)
      //               let patternX = new RegExp(`^${lastPositionX + oneSideNum * j}:`, "g");
      //               let matchPX = lastBoxPosition.filter(oneP => oneP.match(patternX));
      //               if (matchPX == null) {
      //                 continue roop3;
      //               }
      //               let patternY = new RegExp(`^${lastPositionX + oneSideNum * j}:`, "g");
      //               let matchPX = lastBoxPosition.filter(oneP => oneP.match(patternY));
      //               if (matchPX == null) {
      //                 continue roop3;
      //               }
      //             }
      //           }
      //         }
      //         $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //         eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //         eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //         eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //         $(`#canvas${index}`).offset({top: `${ifPositionY}`, left: `${ifPositionX}`});
      //         $(`#canvas${index}`).css("position", "absolute");
      //         let xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //         let colonIndex = xujiPosition.indexOf(":");
      //         let xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //         let xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      //         $(`.easybackground__xuji canvas:eq(${index})`).attr('class','canvas' + randSize + "xuji");
      //         eval("var canvas" + index + "xuji" + " = document.getElementById('canvas" + index + "xuji" + "');");
      //         eval("var ctx" + index + "xuji" + " = canvas.getContext('2d');");
      //         eval("canvas" + index + "xuji" + ".width = " + `${oneSideNum}` + ";");
      //         eval("canvas" + index + "xuji" + ".height = " + `${oneSideNum}` + ";");
      //         $(`#canvas${index}`).offset({top: `${ifPositionY + xujiPositionY * oneSideNum}`, left: `${ifPositionX + xujiPositionX * oneSideNum}`});
      //         $(`#canvas${index}`).css("position", "absolute");
      //         eval("ctx" + index + "xuji" + ".textAlign = 'center';");
      //         eval("ctx" + index + "xuji" + ".textBaseline = 'middle';");
      //         eval("ctx" + index + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //         eval("ctx" + index + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //         eval("ctx" + index + "xuji" + ".fillText('" + `${randSize}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //       } else if (matchPosition.length == 0) {
      //         if (Math.pow(Math.floor(Math.sqrt(lastBoxPosition.length)), 2) == lastBoxPosition.length) {
      //             //そのまま全てを正方形として入れる
      //         } else {
      //           notTotalPosition.length = 0
      //           totalPosition.length = 0
      //           let index = -1
      //           continue roop1;
      //         }
      //       } else {
      //         matchPosition.forEach
      //       }



      //       totalMatchPositionsX.forEach(function (tMPX) {
      //         console.log(tMPX)
      //         for (let i = index + 1; i < index + 1 + tMPX.length; i++) {
      //           console.log(i, index, tMPX.length, tMPX, i - index + 1)
      //           let matchPosition = tMPX[i - (index + 1)]
      //           console.log(matchPosition)
      //           let randSize = tMPX.length
      //           let colonIndex = matchPosition.indexOf(":");
      //           let positionX = Number(matchPosition.slice(0, colonIndex));
      //           console.log(positionX)
      //           let positionY = Number(matchPosition.slice(colonIndex + 1));
      //           console.log(positionY)
      //           notTotalPosition.push(`${positionX}:${positionY}`);
      //           console.log(notTotalPosition)
      //           $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //           eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //           eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //           eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //           $(`#canvas${index}`).offset({top: `${ifPositionY}`, left: `${ifPositionX}`});
      //           $(`#canvas${index}`).css("position", "absolute");
      //           let xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //           let colonIndex = xujiPosition.indexOf(":");
      //           let xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //           let xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      //           $(`.easybackground__xuji canvas:eq(${index})`).attr('class','canvas' + randSize + "xuji");
      //           eval("var canvas" + index + "xuji" + " = document.getElementById('canvas" + `${randSize}` + "xuji" + "');");
      //           eval("var ctx" + index + "xuji" + " = canvas.getContext('2d');");
      //           eval("canvas" + index + "xuji" + ".width = " + `${oneSideNum}` + ";");
      //           eval("canvas" + index + "xuji" + ".height = " + `${oneSideNum}` + ";");
      //           $(`#canvas${index}`).offset({top: `${ifPositionY + xujiPositionY * oneSideNum}`, left: `${ifPositionX + xujiPositionX * oneSideNum}`});
      //           $(`#canvas${index}`).css("position", "absolute");
      //           eval("ctx" + index + "xuji" + ".textAlign = 'center';");
      //           eval("ctx" + index + "xuji" + ".textBaseline = 'middle';");
      //           eval("ctx" + index + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //           eval("ctx" + index + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //           eval("ctx" + index + "xuji" + ".fillText('" + `${randSize}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //         };
      //       })
      //       if (check(position, notTotalPosition).length == position.length) {
      //         console.log('break459')
      //         console.log(check(position, notTotalPosition))
      //         console.log(notTotalPosition)
      //         console.log(cut(notTotalPosition))
      //         break roop1;
      //       } else if (position.length - check(position, notTotalPosition).length == 1) {
      //         notTotalPosition.length = 0
      //         totalPosition.length = 0
      //         let index = -1
      //         continue roop1;
      //       } else {
      //         let xLength = totalMatchPositionsXL.length
      //         console.log(xLength)
      //         totalMatchPositionsY.forEach(function (tMPY) {
      //           for (let i = index + 1 + xLength; i < index + 1 + xLength + tMPY.length; i++) {
      //             console.log(i, index, xLength, tMPY)
      //             let matchPosition = tMPY[i - (index + 1 + xLength)]
      //             console.log(matchPosition)
      //             let randSize = tMPY.length
      //             let colonIndex = matchPosition.indexOf(":");
      //             let positionX = Number(matchPosition.slice(0, colonIndex));
      //             console.log(positionX)
      //             let positionY = Number(matchPosition.slice(colonIndex + 1));
      //             console.log(positionY)
      //             notTotalPosition.push(`${positionX}:${positionY}`);
      //             console.log(notTotalPosition)
      //             $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //             eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //             eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //             eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //             $(`#canvas${index}`).offset({top: `${ifPositionY + boxSizeY}`, left: `${ifPositionX + boxSizeX}`});
      //             $(`#canvas${index}`).css("position", "absolute");
      //             let xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //             let colonIndex = xujiPosition.indexOf(":");
      //             let xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //             let xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      //             $(`.easybackground__xuji canvas:eq(${index})`).attr('class','canvas' + randSize + "xuji");
      //             eval("var canvas" + index + "xuji" + " = document.getElementById('canvas" + `${randSize}` + "xuji" + "');");
      //             eval("var ctx" + index + "xuji" + " = canvas.getContext('2d');");
      //             eval("canvas" + index + "xuji" + ".width = " + `${oneSideNum}` + ";");
      //             eval("canvas" + index + "xuji" + ".height = " + `${oneSideNum}` + ";");
      //             $(`#canvas${index}`).offset({top: `${xujiPositionY}`, left: `${xujiPositionX}`});
      //             $(`#canvas${index}`).css("position", "absolute");
      //             eval("ctx" + index + "xuji" + ".textAlign = 'center';");
      //             eval("ctx" + index + "xuji" + ".textBaseline = 'middle';");
      //             eval("ctx" + index + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //             eval("ctx" + index + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //             eval("ctx" + index + "xuji" + ".fillText('" + `${randSize}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //           };
      //         });
      //         if (check(position, notTotalPosition).length == position.length) {
      //           console.log('break459')
      //           console.log(check(position, notTotalPosition))
      //           console.log(notTotalPosition)
      //           console.log(cut(notTotalPosition))
      //           break roop1;
      //         } else {
      //           notTotalPosition.length = 0
      //           totalPosition.length = 0
      //           let index = -1
      //           continue roop1;
      //         }
      //       }
      //     }
      //   };
      // }
      // for (let i = 0; i < totalNum / 2; i ++) {
      //   if ( $(`.easybackground__box canvas:eq(${i})`).is("[class]") == false){
      //     document.getElementById(`canvas${i}`).remove();
      //     document.getElementById(`canvas${i}xuji`).remove();
      //   }
      // }

    


      // let totalPosition = []
      // let notTotalPosition = []
      // const check = (array1, array2) => {
      //   return array1.filter(value1 => array2.includes(value1));
      // }
      // const out = (array3, array4) => {
      //   return [...array3, ...array4].filter(value2 => !array3.includes(value2) || !array4.includes(value2));
      // }
      // while (check(position, notTotalPosition).length != totalNum) {
      //   block1: for(let index = 0; index < totalRandNum.length; index++) {
      //     let totalPosition = out(totalPosition, notTotalPosition);
      //     if (notTotalPosition.length > totalNum) {
      //       notTotalPosition.length = 0
      //       totalPosition.length = 0
      //       let index = 0
      //       continue block1;
      //     }
      //     if (index == 0) {
      //       let boxSizeNum = totalRandNum[index]
      //       let randId = Math.floor(Math.random() * boxSizeNum);
      //       let boxSizes = multiplicationTotalRandNum[index]
      //       let boxSize = boxSizes[Math.floor(Math.random() * boxSizes.length)]
      //       console.log(boxSize)
      //       let xIndex = boxSize.indexOf("x");
      //       let boxSizeX = Number(boxSize.slice(0, xIndex));
      //       let boxSizeY = Number(boxSize.slice(xIndex + 1));
      //       let sizeIndex = boxSizes.indexOf(boxSize);
      //       let ifSetPosition = totalBoxPosition[index]
      //       let setPosition = ifSetPosition[sizeIndex]
      //       if (boxSizeX < 720) {
      //         totalPosition.push(`${x + boxSizeX}:${y}`);
      //       }
      //       if (boxSizeY < 720) {
      //         totalPosition.push(`${x}:${y + boxSizeY}`);
      //       }
      //       console.log(totalPosition)
      //       for (let i = 0; i < boxSizeNum; i++) {
      //         if (i == randId) {
      //           let oneSetPosition = setPosition[i]
      //           let colonIndex = oneSetPosition.indexOf(":");
      //           let positionX = Number(oneSetPosition.slice(0, colonIndex));
      //           let positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //           notTotalPosition.push(`${x + positionX * oneSideNum}:${y + positionY * oneSideNum}`);
      //           console.log(notTotalPosition)
      //           let positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //           $(`#${positionId.id}`).attr('id','canvas' + i + "xuji");
      //           $(`#canvas${i}xuji`).attr('class','canvas' + `${boxSizeNum}` + "xuji");
      //           eval("var canvas" + i + "xuji" + " = document.getElementById('canvas" + i + "xuji" + "');");
      //           eval("var ctx" + i + "xuji" + " = canvas.getContext('2d');");
      //           eval("ctx" + i + "xuji" + ".textAlign = 'center';");
      //           eval("ctx" + i + "xuji" + ".textBaseline = 'middle';");
      //           eval("ctx" + i + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //           eval("ctx" + i + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //           eval("ctx" + i + "xuji" + ".fillText('" + `${(boxSizeX / oneSideNum) * (boxSizeY / oneSideNum)}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //         } else {
      //           let oneSetPosition = setPosition[i]
      //           let colonIndex = oneSetPosition.indexOf(":");
      //           let positionX = Number(oneSetPosition.slice(0, colonIndex));
      //           let positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //           notTotalPosition.push(`${x + positionX * oneSideNum}:${y + positionY * oneSideNum}`);
      //           console.log(notTotalPosition)
      //           let positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //           $(`#${positionId.id}`).attr('class','canvas' + `${boxSizeNum}`);
      //         }
      //       };
      //     // } else if (index == totalRandNum.length - (3 + maxNumBox / 6)) {
            
      //     } else {
      //       block2: for (let i = 0; i < totalPosition.length; i++) {
      //         let ifPosition = totalPosition.pop();
      //         console.log(totalPosition)
      //         console.log(ifPosition)
      //         let colonIndex = ifPosition.indexOf(":");
      //         let ifPositionX = Number(ifPosition.slice(0, colonIndex));
      //         let ifPositionY = Number(ifPosition.slice(colonIndex + 1));
      //         let ifSetPosition = totalBoxPosition[index]
      //         console.log(ifSetPosition)
      //         let setPosition = ifSetPosition[Math.floor(Math.random() * ifSetPosition.length)]
      //         console.log(setPosition)
      //         let lastSetPosition = setPosition[setPosition.length - 1]
      //         let colonIndex = lastSetPosition.indexOf(":");
      //         let setPositionX = Number(lastSetPosition.slice(0, colonIndex));
      //         let setPositionY = Number(lastSetPosition.slice(colonIndex + 1));
      //         let canSetPosition = out(position, notTotalPosition);
      //         console.log(canSetPosition)
      //         if ((ifPositionX - x) / oneSideNum + setPositionX > maxNumBox - 1) {
      //           if ((ifPositionY - y) / oneSideNum + setPositionY > maxNumBox - 1) {
      //             totalPosition.unshift(ifPosition);
      //             console.log(totalPosition)
      //             console.log("continue286")
      //             continue block2;
      //           } else {
      //             let ifPositionArr = []
      //             for (let i = 0; i < setPosition.length; i++) {
      //               let setP = setPosition[i]
      //               let colonI = setP.indexOf(":");
      //               let setPX = Number(setP.slice(0, colonI));
      //               let setPY = Number(setP.slice(colonI + 1));
      //               ifPositionArr.push(`${ifPositionX + setPX * oneSideNum}:${ifPositionY + setPY * oneSideNum}`);
      //             }
      //             console.log(ifPositionArr)
      //             console.log(canSetPosition, ifPosition)
      //             if (check(canSetPosition, ifPositionArr).length == ifPositionArr.length) {
      //               let startBoxSizeNum = totalRandNum[index - 1]
      //               console.log(startBoxSizeNum)
      //               let boxSizeNum = totalRandNum[index]
      //               console.log(boxSizeNum)
      //               let randId = Math.floor(Math.random() * (boxSizeNum + 1 - index)) + index;
      //               let sizeIndex = ifSetPosition.indexOf(setPosition);
      //               console.log(sizeIndex)
      //               let boxSizes = multiplicationTotalRandNum[index]
      //               console.log(boxSizes)
      //               let boxSize = boxSizes[sizeIndex]
      //               console.log(boxSize)
      //               let xIndex = boxSize.indexOf("x");
      //               let boxSizeX = Number(boxSize.slice(0, xIndex));
      //               let boxSizeY = Number(boxSize.slice(xIndex + 1));
      //               if (ifPositionX + boxSizeX < x + 720) {
      //                 totalPosition.push(`${ifPositionX + boxSizeX}:${ifPositionY}`);
      //               }
      //               if (ifPositionY + boxSizeY < y + 720) {
      //                 totalPosition.push(`${ifPositionX}:${ifPositionY + boxSizeY}`);
      //               }
      //               console.log(totalPosition)
      //               for (let i = startBoxSizeNum; i < startBoxSizeNum + boxSizeNum; i++) {
      //                 if (i == randId) {
      //                   let oneSetPosition = setPosition[i - startBoxSizeNum]
      //                   let colonIndex = oneSetPosition.indexOf(":");
      //                   let positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                   let positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                   notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                   console.log(notTotalPosition)
      //                   let positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //                   $(`#${positionId.id}`).attr('id','canvas' + i + "xuji");
      //                   $(`#canvas${i}xuji`).attr('class','canvas' + `${boxSizeNum}` + "xuji");
      //                   eval("var canvas" + i + "xuji" + " = document.getElementById('canvas" + i + "xuji" + "');");
      //                   eval("var ctx" + i + "xuji" + " = canvas.getContext('2d');");
      //                   eval("ctx" + i + "xuji" + ".font = '" + `${oneSideNum / 2}` + "px serif';");
      //                   eval("ctx" + i + "xuji" + ".fillStyle = 'rgba(0, 0, 255)';");
      //                   eval("ctx" + i + "xuji" + ".fillText('" + `${boxSizeNum}` + "', " + `${x}` + ", " + `${y}` + ");");
      //                 } else {
      //                   let oneSetPosition = setPosition[i - startBoxSizeNum]
      //                   let colonIndex = oneSetPosition.indexOf(":");
      //                   let positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                   let positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                   notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                   console.log(notTotalPosition)
      //                   let positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //                   $(`#${positionId.id}`).attr('class','canvas' + `${boxSizeNum}`);
      //                 }
      //               };
      //               console.log("break363")
      //               break block2;
      //             } else {
      //               totalPosition.unshift(ifPosition);
      //               console.log(totalPosition)
      //               console.log('continue344')
      //               continue block2;
      //             };
      //           }
      //         } else {
      //           let ifPositionArr = []
      //           for (let i = 0; i < setPosition.length; i++) {
      //             let setP = setPosition[i]
      //             let colonI = setP.indexOf(":");
      //             let setPX = Number(setP.slice(0, colonI));
      //             let setPY = Number(setP.slice(colonI + 1));
      //             ifPositionArr.push(`${ifPositionX + setPX * oneSideNum}:${ifPositionY + setPY * oneSideNum}`);
      //           }
      //           console.log(ifPositionArr)
      //           console.log(canSetPosition, ifPosition)
      //           if (check(canSetPosition, ifPositionArr).length == ifPositionArr.length) {
      //             let startBoxSizeNum = totalRandNum[index - 1]
      //             console.log(startBoxSizeNum)
      //             let boxSizeNum = totalRandNum[index]
      //             console.log(boxSizeNum)
      //             let randId = Math.floor(Math.random() * (boxSizeNum + 1 - index)) + index;
      //             let sizeIndex = ifSetPosition.indexOf(setPosition);
      //             console.log(sizeIndex)
      //             let boxSizes = multiplicationTotalRandNum[index]
      //             console.log(boxSizes)
      //             let boxSize = boxSizes[sizeIndex]
      //             console.log(boxSize)
      //             let xIndex = boxSize.indexOf("x");
      //             let boxSizeX = Number(boxSize.slice(0, xIndex));
      //             let boxSizeY = Number(boxSize.slice(xIndex + 1));
      //             if (ifPositionX + boxSizeX < x + 720) {
      //               totalPosition.push(`${ifPositionX + boxSizeX}:${ifPositionY}`);
      //             }
      //             if (ifPositionY + boxSizeY < y + 720) {
      //               totalPosition.push(`${ifPositionX}:${ifPositionY + boxSizeY}`);
      //             }
      //             console.log(totalPosition)
      //             for (let i = startBoxSizeNum; i < startBoxSizeNum + boxSizeNum; i++) {
      //               if (i == randId) {
      //                 let oneSetPosition = setPosition[i - startBoxSizeNum]
      //                 console.log(i)
      //                 console.log(oneSetPosition ,setPosition)
      //                 let colonIndex = oneSetPosition.indexOf(":");
      //                 let positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                 let positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                 notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                 console.log(notTotalPosition)
      //                 let positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //                 $(`#${positionId.id}`).attr('id','canvas' + i + "xuji");
      //                 $(`#canvas${i}xuji`).attr('class','canvas' + `${boxSizeNum}` + "xuji");
      //                 eval("var canvas" + i + "xuji" + " = document.getElementById('canvas" + i + "xuji" + "');");
      //                 eval("var ctx" + i + "xuji" + " = canvas.getContext('2d');");
      //                 eval("ctx" + i + "xuji" + ".font = '" + `${oneSideNum / 2}` + "px serif';");
      //                 eval("ctx" + i + "xuji" + ".fillStyle = 'rgba(0, 0, 255)';");
      //                 eval("ctx" + i + "xuji" + ".fillText('" + `${boxSizeNum}` + "', " + `${x}` + ", " + `${y}` + ");");
      //               } else {
      //                 let oneSetPosition = setPosition[i - startBoxSizeNum]
      //                 console.log(i)
      //                 console.log(oneSetPosition ,setPosition)
      //                 let colonIndex = oneSetPosition.indexOf(":");
      //                 let positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                 let positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                 notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                 console.log(notTotalPosition)
      //                 let positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //                 $(`#${positionId.id}`).attr('class','canvas' + `${boxSizeNum}`);
      //               }
      //             };
      //             console.log("break449")
      //             break block2;
      //           } else {
      //             totalPosition.unshift(ifPosition);
      //             console.log(totalPosition)
      //             console.log('continue455')
      //             continue block2;
      //           };
      //         }
      //       };
      //     }
      //   }
      // }





      // for (let i = 0; i < totalRandNum.length; i++) {
      //   var canvas = document.createElement("canvas");
      //   $(".easybackground__box").append(canvas);
      //   $(`.easybackground__box canvas:eq(${i})`).attr('id','canvas' + i);
      //   eval("var canvas" + i + " = document.getElementById('canvas" + i + "');");
      // }
      // let totalPosition = []
      // let notTotalPosition = []
      // const check = (array1, array2) => {
      //   return array1.filter(value1 => array2.includes(value1));
      // }
      // const out = (array3, array4) => {
      //   return [...array3, ...array4].filter(value => !array3.includes(value) || !array4.includes(value));
      // }
      // while (check(position, notTotalPosition).length != totalNum) {
      //   block1: for(let index = 0; index < totalRandNum.length; index++) {
      //     let totalPosition = out(totalPosition, notTotalPosition);
      //     if (notTotalPosition.length > totalNum) {
      //       notTotalPosition.length = 0
      //       totalPosition.length = 0
      //       let multiplicationTotalRandNum = shuffle(multiplicationTotalRandNum)
      //       let index = 0
      //       continue block1;
      //     } else {
      //       if (index == 0) {
      //         let randBoxSize = multiplicationTotalRandNum[index]
      //         let boxSize = randBoxSize[Math.floor(Math.random() * randBoxSize.length)]
      //         let xIndex = boxSize.indexOf("x");
      //         let boxSizeX = Number(boxSize.slice(0, xIndex));
      //         let boxSizeY = Number(boxSize.slice(xIndex + 1));
      //         $(`#canvas${index}`).attr('class','canvas' + `${(boxSizeX / oneSideNum) * (boxSizeY / oneSideNum)}`);
      //         eval("canvas" + index + ".width = " + `${boxSizeX}` + ";");
      //         eval("canvas" + index + ".height = " + `${boxSizeY}` + ";");
      //         $(`#canvas${index}`).offset({top: y, left: x});
      //         $(`#canvas${index}`).css("position", "absolute");
      //         // var canvas = document.createElement("canvas");
      //         // $(".easybackground__xuji").append(canvas);
      //         // $(`.easybackground__xuji canvas:eq(${index})`).attr('id','canvas' + `${(boxSizeX / oneSideNum) * (boxSizeY / oneSideNum)}` + "xuji");
      //         // eval("var canvas" + index + "xuji" + " = document.getElementById('canvas" + `${(boxSizeX / oneSideNum) * (boxSizeY / oneSideNum)}` + "xuji" + "');");
      //         // eval("var ctx" + index + "xuji" + " = canvas" + index + "xuji" + ".getContext('2d');");
      //         // eval("canvas" + index + "xuji" + ".width = " + `${oneSideNum}` + ";");
      //         // eval("canvas" + index + "xuji" + ".height = " + `${oneSideNum}` + ";");
      //         // eval("ctx" + index + "xuji" + ".textAlign = 'center';");
      //         // eval("ctx" + index + "xuji" + ".textBaseline = 'middle';");
      //         // eval("ctx" + index + "xuji" + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      //         // eval("ctx" + index + "xuji" + ".fillStyle = 'rgba( 0, 0, 0, 0.8 )';");
      //         // eval("ctx" + index + "xuji" + ".fillText('" + `${(boxSizeX / oneSideNum) * (boxSizeY / oneSideNum)}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      //         // let randPositionX = Math.floor(Math.random() * (boxSizeX / oneSideNum));
      //         // let randPositionY = Math.floor(Math.random() * (boxSizeY / oneSideNum));
      //         // $(`.easybackground__xuji canvas:eq(${index})`).offset({top: y + randPositionY * oneSideNum, left: x + randPositionX * oneSideNum});
      //         // $(`.easybackground__xuji canvas:eq(${index})`).css("position", "absolute");
      //         if (boxSizeY < 720) {
      //           totalPosition.push(`${x}:${y + boxSizeY}`);
      //         }
      //         if (boxSizeX < 720) {
      //           totalPosition.push(`${x + boxSizeX}:${y}`);
      //         }
      //         for(let i = 0; i < boxSizeY / oneSideNum; i++) {
      //           for(let j = 0; j < boxSizeX / oneSideNum; j++) {
      //             notTotalPosition.push(`${x + oneSideNum * j}:${y + oneSideNum * i}`)
      //           }
      //         };
      //       } else {
      //         block2: for (let i = 0; i < totalPosition.length; i++) {
      //           let ifPosition = totalPosition.pop();
      //           if (ifPosition == "960:520") {
      //             continue block2;
      //           }
      //           let colonIndex = ifPosition.indexOf(":");
      //           let positionX = Number(ifPosition.slice(0, colonIndex));
      //           let positionY = Number(ifPosition.slice(colonIndex + 1));
      //           let randBoxSize = multiplicationTotalRandNum[index]
      //           let boxSize = randBoxSize[Math.floor(Math.random() * randBoxSize.length)]
      //           let xIndex = boxSize.indexOf("x");
      //           let boxSizeX = Number(boxSize.slice(0, xIndex));
      //           let boxSizeY = Number(boxSize.slice(xIndex + 1));
      //           $(`#canvas${index}`).attr('class','canvas' + `${(boxSizeX / oneSideNum) * (boxSizeY / oneSideNum)}`);
      //           eval("canvas" + index + ".width = " + `${boxSizeX}` + ";");
      //           eval("canvas" + index + ".height = " + `${boxSizeY}` + ";");
      //           $(`#canvas${index}`).offset({top: positionY, left: positionX});
      //           $(`#canvas${index}`).css("position", "absolute");
      //           let rightPositionX = positionX + boxSizeX;
      //           let bottomPositionY = positionY + boxSizeY;
      //           if (rightPositionX > x + 720 || bottomPositionY > y + 720) {
      //             eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //             eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //             let rightPositionX = positionX + boxSizeY;
      //             let bottomPositionY = positionY + boxSizeX;
      //             if (rightPositionX > x + 720 || bottomPositionY > y + 720) {
      //               totalPosition.unshift(ifPosition);
      //               continue block2;
      //             } else {
      //               temporaryPosition = []
      //               for(let a = 0; a < boxSizeX / oneSideNum; a++) {
      //                 for(let b = 0; b < boxSizeY / oneSideNum; b++) {
      //                   temporaryPosition.push(`${positionX + oneSideNum * b}:${positionY + oneSideNum * a}`)
      //                 }
      //               };
      //               if (check(temporaryPosition, notTotalPosition).length > 0) {
      //                 totalPosition.unshift(ifPosition);
      //                 continue block2;
      //               } else {
      //                 if (positionX + boxSizeY < x + 720) {
      //                   totalPosition.unshift(`${positionX + boxSizeY}:${positionY}`);
      //                 }
      //                 if (positionY + boxSizeX < y + 720) {
      //                   totalPosition.unshift(`${positionX}:${positionY + boxSizeX}`);
      //                 }
      //                 temporaryPosition.forEach(function(temporaryP) {
      //                   notTotalPosition.push(temporaryP)
      //                 });
      //                 break block2;
      //               }
      //             }
      //           } else {
      //             temporaryPosition = []
      //             for(let a = 0; a < boxSizeY / oneSideNum; a++) {
      //               for(let b = 0; b < boxSizeX / oneSideNum; b++) {
      //                 temporaryPosition.push(`${positionX + oneSideNum * b}:${positionY + oneSideNum * a}`)
      //               }
      //             };
      //             if (check(temporaryPosition, notTotalPosition).length > 0) {
      //               totalPosition.unshift(ifPosition);
      //               continue block2;
      //             } else {
      //               if (positionX + boxSizeX < x + 720) {
      //                 totalPosition.unshift(`${positionX + boxSizeX}:${positionY}`);
      //               }
      //               if (positionY + boxSizeY < y + 720) {
      //                 totalPosition.unshift(`${positionX}:${positionY + boxSizeY}`);
      //               }
      //               temporaryPosition.forEach(function(temporaryP) {
      //                 notTotalPosition.push(temporaryP)
      //               });
      //               break block2;
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }