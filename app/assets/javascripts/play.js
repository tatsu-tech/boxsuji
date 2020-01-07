$(document).on('turbolinks:load', function() {
  // パスの取得
  const pathName = location.pathname;
  // ゲーム盤面のサイズ指定
  const boardSize = 720

  if (pathName.includes("/games/")) {
    if (pathName.includes("/easy")) {
    // 難易度easyの場合のマス数の指定(6x6=36マス)
    var totalNum = 36
    } else if(pathName.includes("/normal")) {
    // 難易度normalの場合のマス数の指定(12x12=144マス)
    var totalNum = 81
    } else if(pathName.includes("/hard")) {
    // 難易度normalの場合のマス数の指定(18x18=324マス)
    var totalNum = 144
    }

    // 難易度に応じ、ひとboxのマス数における高さおよび幅の最大値を取得(totalNumの平方根)
    const maxNumBox = Math.sqrt(totalNum);

    // 盤面の一辺の長さを求め、そこからひとマス当たりの一辺の長さを求める
    const oneSideNum = boardSize / maxNumBox

    // ゲームの盤面である.playbackground__main--boxの左上の角のx座標およびy座標を取得する
    const x = Number($(".playbackground__main--box").offset().left);
    const y = Number($(".playbackground__main--box").offset().top);
    console.log(x, y)

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
    for (var i = 2; i <= maxNumBox; i++) {
      if (primeNums.indexOf(i) === -1) {
        allNums.push(i)
      }
    }
    console.log(allNums)

    // のちに必要になるため、allNumsそれぞれに1x?以外の掛け算のパターンがあるか判断し、あればそれを配列に、ない場合は空の配列にする
    // ない場合に空にする理由は配列のindex番号を利用するため
    // この処理により、divisorAllNumsという配列はeasyなら[(2)[], (3)[], (4)[2x2], (5)[], (6)[2x3, 3x2]]、normalなら[[], [], [2x2], [], [2x3, 3x2], [2x4, 4x2], [3x3]]、hardなら[[], [], [2x2], [], [2x3, 3x2], [2x4, 4x2], [3x3], [2x5, 5x2], [2x6, 3x4, 4x3, 6x2]]となる
    var divisorAllNums = []
    allNums.forEach(function (organizeNum) {
      var array = []
      for (var i = 2; i < organizeNum - 1; i++) {
        if (organizeNum % i == 0) {
          array.push(i)
        }
      }
      divisorAllNums.push(array)
    });
    divisorAllNums.forEach(function (dAllNum, index) {
      var maxI = dAllNum.length
      var maxJ = allNums[index]
      for (var i = 0; i < maxI; i++) {
        var j = dAllNum[i]
        var divisorJ = maxJ / j
        dAllNum.splice(i, 1, `${j}x${divisorJ}`);
      }
    });
    console.log(divisorAllNums)

    // 2つの配列の共通する要素を削除する関数overlapAllDeleteを定義([0,1,2,3] + [3,1,0] => [2])
    const overlapAllDelete = (array1, array2) => {
      return [...array1, ...array2].filter(value => !array1.includes(value) || !array2.includes(value));
    }
    if (totalNum == 36) {
      var xuji = [5, 3, 2, 5, 6, 4, 2, 2, 4, 3]
      var xujiPositions = ["600:10", "600:130", "840:130", "960:250", "360:370", "720:370", "840:490", "480:610", "600:610", "960:610"]
    }
    if (totalNum == 81) {
      var xuji = [6, 9, 6, 4, 3, 2, 5, 4, 5, 3, 8, 3, 8, 9, 4, 2]
      var xujiPositions = ["360:10", "840:90", "520:170", "680:170", "440:250", "680:250", "1000:250", "360:330", "600:330", "520:410", "920:410", "1000:490", "440:570", "760:570", "600:650", "1000:650"]
    }
    if (totalNum == 144) {
      var xuji = [8, 8, 3, 9, 5, 12, 5, 6, 4, 4, 4, 6, 3, 6, 3, 3, 8, 10, 4, 6, 5, 10, 12]
      var xujiPositions = ["540:10", "960:10", "780:70", "360:130", "420:190", "840:190", "600:250", "780:250", "1020:250", "480:310", "660:310", "960:310", "420:370", "720:370", "600:430", "660:430", "840:430", "420:490", "1020:490", "600:550", "780:550", "900:610", "480:670"]
    }
    var position = []
    for(var i = 0, j = maxNumBox; i < j; i++) {
      for(var k = 0; k < j; k++) {
        var index = i * j + k
        var canvas = document.createElement("canvas");
        $(".playbackground__main--box").append(canvas);
        $(`.playbackground__main--box canvas:eq(${index})`).attr('id','canvas' + index + "box");
        eval("var canvas" + index + "box = document.getElementById('canvas" + index + "box');");
        eval("var ctx" + index + "box = canvas" + index + "box.getContext('2d');");
        eval("canvas" + index + "box.width = " + `${oneSideNum}` + ";");
        eval("canvas" + index + "box.height = " + `${oneSideNum}` + ";");
        $(`.playbackground__main--box canvas:eq(${index})`).attr('data-position',`${x + oneSideNum * k}:${y + oneSideNum * i}`);
        $(`.playbackground__main--box canvas:eq(${index})`).attr('data-onOff','off');
        eval("ctx" + index + "box.rect(0, 0, " + `${oneSideNum}` + ", " + `${oneSideNum}` + ");");
        eval("ctx" + index + "box.fillStyle = 'lightgray';");
        eval("ctx" + index + "box.strokeStyle = 'black';");
        eval("ctx" + index + "box.lineWidth = 1;");
        eval("ctx" + index + "box.fill();");
        eval("ctx" + index + "box.stroke();");
        position.push(`${x + oneSideNum * k}:${y + oneSideNum * i}`);
      }
    };
    for (var i = 0, j = xuji.length; i < j; i++) {
      var xujiPosition = xujiPositions[i]
      var colonIndex = xujiPosition.indexOf(":");
      var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      var canvas = document.createElement("canvas");
      $(".playbackground__main--xuji").append(canvas);
      $(`.playbackground__main--xuji canvas:eq(${i})`).attr('id','canvas' + i);
      $(`.playbackground__main--xuji canvas:eq(${i})`).attr('class','canvas' + xuji[i] + 'xuji');
      eval("var canvas" + i + " = document.getElementById('canvas" + i + "');");
      eval("var ctx" + i + " = canvas" + i + ".getContext('2d');");
      eval("canvas" + i + ".width = " + `${oneSideNum}` + ";");
      eval("canvas" + i + ".height = " + `${oneSideNum}` + ";");
      eval("$('#canvas" + i + "').attr('data-position', '" + xujiPosition + "');");
      eval("$('#canvas" + i + "').offset({top: " + `${xujiPositionY}` + ", left: " + `${xujiPositionX}` + "});");
      eval("$('#canvas" + i + "').css('position', 'absolute');");
      eval("$('#canvas" + i + "').css('cursor', 'pointer');");
      eval("ctx" + i + ".textAlign = 'center';");
      eval("ctx" + i + ".textBaseline = 'middle';");
      eval("ctx" + i + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      eval("ctx" + i + ".fillStyle = 'rgba(0, 0, 0, 0.8)';");
      eval("ctx" + i + ".fillText('" + `${xuji[i]}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
      $(`.playbackground__main--box canvas[data-position='${xujiPosition}']`).attr('data-onOff', 'on');
    }
    var totalXujiPositions = []
    for (var i = 0, j = xuji.length; i < j; i++) {
      var allXujiPositions = []
      var totalPosition = overlapAllDelete(position, xujiPositions);
      var xujiNum = xuji[i]
      console.log(xujiNum)
      var xujiPosition = xujiPositions[i]
      var colonIndex = xujiPosition.indexOf(":");
      var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
      var rightPositions = []
      var leftPositions = []
      var upPositions = []
      var downPositions = []
      for (var k = 1, l = xujiNum; k < l; k++) {
        var matchPosition = `${xujiPositionX + oneSideNum * k}:${xujiPositionY}`
        var rightPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (rightPosition === undefined) {
          break;
        }
        rightPositions.push(rightPosition);
      }
      for (var k = 1, l = xujiNum; k < l; k++) {
        var matchPosition = `${xujiPositionX - oneSideNum * k}:${xujiPositionY}`
        var leftPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (leftPosition === undefined) {
          break;
        }
        leftPositions.push(leftPosition);
      }
      for (var k = 1, l = xujiNum; k < l; k++) {
        var matchPosition = `${xujiPositionX}:${xujiPositionY + oneSideNum * k}`
        var upPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (upPosition === undefined) {
          break;
        }
        upPositions.push(upPosition);
      }
      for (var k = 1, l = xujiNum; k < l; k++) {
        var matchPosition = `${xujiPositionX}:${xujiPositionY - oneSideNum * k}`
        var downPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.playbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
        if (downPosition === undefined) {
          break;
        }
        downPositions.push(downPosition);
      }
      var leftAndRightPositions = [xujiPosition]
      leftAndRightPositions.push(...rightPositions)
      leftAndRightPositions.push(...leftPositions)
      leftAndRightPositions.sort(function (oneP1, oneP2) {
        var colonIndex = oneP1.indexOf(":");
        var oneP1X = Number(oneP1.slice(0, colonIndex));
        var colonIndex = oneP2.indexOf(":");
        var oneP2X = Number(oneP2.slice(0, colonIndex));
        return (oneP1X > oneP2X ? 1 : -1);
      });
      console.log(leftAndRightPositions)
      if (leftAndRightPositions.length >= xujiNum) {
        for (var k = 0, l = leftAndRightPositions.length - xujiNum + 1; k < l; k++) {
          allXujiPositions.push(leftAndRightPositions.slice(k, k + xujiNum))
        }
      }
      var upAndDownPositions = [xujiPosition]
      upAndDownPositions.push(...upPositions)
      upAndDownPositions.push(...downPositions)
      upAndDownPositions.sort(function (oneP1, oneP2) {
        var colonIndex = oneP1.indexOf(":");
        var oneP1Y = Number(oneP1.slice(colonIndex + 1));
        var colonIndex = oneP2.indexOf(":");
        var oneP2Y = Number(oneP2.slice(colonIndex + 1));
        return (oneP1Y > oneP2Y ? 1 : -1);
      });
      if (upAndDownPositions.length >= xujiNum) {
        for (var k = 0, l = upAndDownPositions.length - xujiNum + 1; k < l; k++) {
          allXujiPositions.push(upAndDownPositions.slice(k, k + xujiNum))
        }
      }
      var xujiIndex = allNums.indexOf(xujiNum)
      var otherPattern = divisorAllNums[xujiIndex]
      if (otherPattern.length > 0) {
        for (var k = 0, l = otherPattern.length; k < l; k++) {
          var oneOtherPattern = otherPattern[k]
          console.log(oneOtherPattern)
          var xIndex = oneOtherPattern.indexOf("x");
          var otherPatternX = Number(oneOtherPattern.slice(0, xIndex));
          var otherPatternY = Number(oneOtherPattern.slice(xIndex + 1));
          var xujiOtherPosition = `${xujiPositionX - oneSideNum * (otherPatternX - 1)}:${xujiPositionY - oneSideNum * (otherPatternY - 1)}`
          var colonIndex = xujiOtherPosition.indexOf(":");
          var otherPositionX = Number(xujiOtherPosition.slice(0, colonIndex));
          var otherPositionY = Number(xujiOtherPosition.slice(colonIndex + 1));
          for (var m = 0, n = otherPatternX; m < n; m++) {
            block: for (var o = 0, p = otherPatternY; o < p; o++) {
              var oneOtherPosition = `${otherPositionX + oneSideNum * m}:${otherPositionY + oneSideNum * o}`
              var checkOneOtherPosition = totalPosition.find(oneP => oneP == oneOtherPosition && $(`.playbackground__main--box canvas[data-position='${oneOtherPosition}']`).attr('data-onOff') == "off");
              if (checkOneOtherPosition === undefined && oneOtherPosition != xujiPosition) {
                continue block;
              } else {
                var provisionalArray = []
                for (var q = 0; q < n; q++) {
                  for (var r = 0; r < p; r++) {
                    var colonIndex = oneOtherPosition.indexOf(":");
                    var oneOtherPositionX = Number(oneOtherPosition.slice(0, colonIndex));
                    var oneOtherPositionY = Number(oneOtherPosition.slice(colonIndex + 1));
                    var oneOtherSetPosition = `${oneOtherPositionX + oneSideNum * q}:${oneOtherPositionY + oneSideNum * r}`
                    var checkOneOtherSetPosition = totalPosition.find(oneP => oneP == oneOtherSetPosition && $(`.playbackground__main--box canvas[data-position='${oneOtherSetPosition}']`).attr('data-onOff') == "off");
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
        console.log(totalXujiPositions)
      } else {
        totalXujiPositions.push(allXujiPositions)
        console.log(totalXujiPositions)
      }
      console.log(xuji)
    }
    var lastClickedXuji = []
    for (var i = 0, j = xuji.length; i < j; i++) {
      var xujiPosition = xujiPositions[i]
      console.log(xujiPosition)
      var clickNum = {[i]: 0};
      console.log(clickNum[i])
      $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-clickNum', clickNum[i]);
      var canvas = document.createElement("canvas");
      $(".playbackground__main--boxuji").append(canvas);
      $(`.playbackground__main--boxuji canvas:eq(${i})`).attr("id", "canvas" + i + "boxuji");
      eval("var canvas" + i + "boxuji = document.getElementById('canvas" + i + "boxuji');");
      eval("var ctx" + i + "boxuji = canvas" + i + "boxuji.getContext('2d');");
      eval("canvas" + i + "boxuji.width = " + `${boardSize}` + ";");
      eval("canvas" + i + "boxuji.height = " + `${boardSize}` + ";");
      eval("$('#canvas" + i + "boxuji" + "').offset({top: " + `${y}` + ", left: " + `${x}` + "});");
      eval("$('#canvas" + i + "boxuji" + "').css('position', 'absolute');");
      $(".playbackground__main--xuji").on("click", `canvas[data-position='${xujiPosition}']`, function() {
        return function(e) {
          console.log('click!!!!!')
          console.log(this)
          var num = Number($(this).attr('data-clickNum'));
          var num = num + 1
          console.log(num)
          $(this).attr('data-clickNum', num);
          var xujiIndex = this.id
          var sIndex = xujiIndex.indexOf("s");
          var index = Number(xujiIndex.slice(sIndex + 1));
          if (lastClickedXuji[lastClickedXuji.length - 1] != index) {
            lastClickedXuji.push(index);
          }
          var xujiPosition = xujiPositions[index]
          console.log(xujiPosition)
          console.log(totalXujiPositions)
          var xujiAllPositions = totalXujiPositions[index]
          console.log(xujiAllPositions)
          var xujiAllPositionsLength = xujiAllPositions.length
          var xujiOnePositions = xujiAllPositions[num - 1]
          console.log(xujiOnePositions)
          var xujiHavePositions = $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-xujiHavePositions');
          console.log(xujiHavePositions)
          if (xujiHavePositions != undefined) {
            var xujiHavePositions = xujiHavePositions.split(",");
            console.log(xujiHavePositions)
            eval("ctx" + index + "boxuji.clearRect(0, 0, " + `${boardSize}` + ", " + `${boardSize}` + ");");
          }
          var firstXujiOnePosition = xujiOnePositions[0]
          console.log(firstXujiOnePosition)
          var colonIndex = firstXujiOnePosition.indexOf(":");
          var firstXujiOnePositionX = Number(firstXujiOnePosition.slice(0, colonIndex)) - x;
          var firstXujiOnePositionY = Number(firstXujiOnePosition.slice(colonIndex + 1)) - y;
          var lastXujiOnePosition = xujiOnePositions[xujiOnePositions.length - 1]
          console.log(lastXujiOnePosition)
          var colonIndex = lastXujiOnePosition.indexOf(":");
          var lastXujiOnePositionX = Number(lastXujiOnePosition.slice(0, colonIndex)) - x + oneSideNum;
          var lastXujiOnePositionY = Number(lastXujiOnePosition.slice(colonIndex + 1)) - y + oneSideNum;
          console.log(firstXujiOnePositionX, firstXujiOnePositionY)
          console.log(lastXujiOnePositionX, lastXujiOnePositionY)
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
            console.log("ififififififififififififif")
            $(`.playbackground__main--xuji canvas[data-position='${xujiPosition}']`).attr('data-clickNum', 0);
          }
          var setXujiPositions = []
          for (var i = 0, j = xuji.length; i < j; i++) {
            var oneSetXujiPositions = $(`.playbackground__main--xuji canvas:eq(${i})`).attr('data-xujiHavePositions');
            console.log(k, oneSetXujiPositions)
            if (oneSetXujiPositions == undefined) {
              break;
            }
            var oneSetXujiPositions = oneSetXujiPositions.split(",");
            setXujiPositions.push(...oneSetXujiPositions);
            console.log(setXujiPositions)
            if (overlapAllDelete(position, setXujiPositions).length == 0) {
              setTimeout(alertTime, 50);
              function alertTime() {
                alert('Game Clear！')
              }
            }
          }
        }
      }())
    }
    $(".playbackground__footer--left").on("click", "#xujiResetBtn", function() {
      if (lastClickedXuji.length > 0) {
        var lastClickedXujiIndex = lastClickedXuji.pop();
        console.log(lastClickedXujiIndex)
        eval("ctx" + lastClickedXujiIndex + "boxuji.clearRect(0, 0, " + `${boardSize}` + ", " + `${boardSize}` + ");");
        $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).removeAttr('data-xujiHavePositions');
        $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', 0);
      } else {
        alert('Nothing to reset.')
      }
    })
    $(".playbackground__footer--left").on("click", "#allResetBtn", function() {
      if (lastClickedXuji.length > 0) {
        for (var i = 0, j = xuji.length; i < j; i++) {
          lastClickedXuji.length = 0
          eval("ctx" + i + "boxuji.clearRect(0, 0, " + `${boardSize}` + ", " + `${boardSize}` + ");");
          $(`.playbackground__main--xuji canvas:eq(${i})`).removeAttr('data-xujiHavePositions');
          $(`.playbackground__main--xuji canvas:eq(${i})`).attr('data-clickNum', 0);
        }
      } else {
        alert('Nothing to reset.')
      }
    })
    $(".playbackground__footer--right").on("click", "#xujiReturnBtn", function() {
      if (lastClickedXuji.length > 0) {
        var lastClickedXujiIndex = lastClickedXuji[lastClickedXuji.length - 1];
        var xujiAllPositions = totalXujiPositions[lastClickedXujiIndex]
        var xujiAllPositionsLength = xujiAllPositions.length
        if (xujiAllPositionsLength != 1) {
          var num = $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum');
          if (num == 0) {
            $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', `${xujiAllPositions.length - 1}`);
            var lastClickedXujiPositions = totalXujiPositions[lastClickedXujiIndex]
            var xujiOnePositions = lastClickedXujiPositions[xujiAllPositions.length - 2]
            console.log(xujiOnePositions)
          } else if (num == 1) {
            $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', 0);
            var xujiOnePositions = xujiAllPositions[xujiAllPositions.length - 1]
            console.log(xujiOnePositions)
          } else {
            console.log(num)
            var xujiAllPositions = totalXujiPositions[lastClickedXujiIndex]
            console.log(xujiAllPositions)
            $(`.playbackground__main--xuji canvas:eq(${lastClickedXujiIndex})`).attr('data-clickNum', `${num - 1}`);
            var xujiOnePositions = xujiAllPositions[num - 2]
            console.log(xujiOnePositions)
          }
          var firstXujiOnePosition = xujiOnePositions[0]
          console.log(firstXujiOnePosition)
          var colonIndex = firstXujiOnePosition.indexOf(":");
          var firstXujiOnePositionX = Number(firstXujiOnePosition.slice(0, colonIndex)) - x;
          var firstXujiOnePositionY = Number(firstXujiOnePosition.slice(colonIndex + 1)) - y;
          var lastXujiOnePosition = xujiOnePositions[xujiOnePositions.length - 1]
          console.log(lastXujiOnePosition)
          var colonIndex = lastXujiOnePosition.indexOf(":");
          var lastXujiOnePositionX = Number(lastXujiOnePosition.slice(0, colonIndex)) - x + oneSideNum;
          var lastXujiOnePositionY = Number(lastXujiOnePosition.slice(colonIndex + 1)) - y + oneSideNum;
          console.log(firstXujiOnePositionX, firstXujiOnePositionY)
          console.log(lastXujiOnePositionX, lastXujiOnePositionY)
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
          var setXujiPositions = []
          for (var i = 0, j = xuji.length; i < j; i++) {
            var oneSetXujiPositions = $(`.playbackground__main--xuji canvas:eq(${i})`).attr('data-xujiHavePositions');
            console.log(oneSetXujiPositions)
            if (oneSetXujiPositions == undefined) {
              break;
            }
            var oneSetXujiPositions = oneSetXujiPositions.split(",");
            console.log(oneSetXujiPositions)
            setXujiPositions.push(...oneSetXujiPositions);
            console.log(setXujiPositions)
            if (overlapAllDelete(position, setXujiPositions).length == 0) {
              setTimeout(alertTime, 50);
              function alertTime() {
                alert('Game Clear！')
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
      // var totalRandNum = [];
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
      // var divisorTotalRandNum = [];
      // totalRandNum.forEach(function(oneRandNum) {
      //   var divisorRandNum = [];
      //   for(var i = 1; i <= oneRandNum; i++) {
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
      //   var n = array.length, indexT, randN;
      //   while (n) {
      //     randN = Math.floor(Math.random() * n--);
      //     indexT = array[n];
      //     array[n] = array[randN];
      //     array[randN] = indexT;
      //   }
      //   return array;
      // }
      // var multiplicationTotalRandNum = [];
      // divisorTotalRandNum.forEach(function(divisorOneRandNum) {
      //   var maxI = divisorOneRandNum.length
      //   var maxJ = divisorOneRandNum[divisorOneRandNum.length - 1]
      //   for(var i = 0; i < maxI; i++) {
      //     j = divisorOneRandNum[i]
      //     var multiplicationJ = maxJ / j
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
      // var x = Number($(".easybackground__box").offset().left);
      // var y = Number($(".easybackground__box").offset().top);
      // var position = []
      // for(var i = 0; i < maxNumBox; i++) {
      //   for(var j = 0; j < maxNumBox; j++) {
      //     position.push(`${360 + oneSideNum * j}:${40 + oneSideNum * i}`)
      //   }
      // };
      // console.log(position)
      // for (var i = 0; i < totalNum / 2; i++) {
      //   var canvas = document.createElement("canvas");
      //   $(".easybackground__box").append(canvas);
      //   $(`.easybackground__box canvas:eq(${i})`).attr('id','canvas' + i);
      //   var canvas = document.createElement("canvas");
      //   $(".easybackground__xuji").append(canvas);
      //   $(`.easybackground__xuji canvas:eq(${i})`).attr('id','canvas' + i + 'xuji');
      // }

      // console.log(totalRandNum)
      // var divisorAllNums = []
      // allNums.forEach(function (organizeNum) {
      //   let array = []
      //   for (var i = 1; i < organizeNum + 1; i++) {
      //     if (organizeNum % i == 0) {
      //       array.push(i)
      //     }
      //   }
      //   divisorAllNums.push(array)
      // });
      // console.log(divisorAllNums)
      // divisorAllNums.forEach(function (dAllNum) {
      //   var maxI = dAllNum.length
      //   var maxJ = dAllNum[maxI - 1]
      //   for (var i = 0; i < maxI; i++) {
      //     var j = dAllNum[i]
      //     var divisorJ = maxJ / j
      //     dAllNum.splice(i, 1, `${j}x${divisorJ}`);
      //   }
      // });
      // console.log(divisorAllNums)
      // var totalNumPosition = []
      // divisorAllNums.forEach(function (dRandNum) {
      //   var numPosition = []
      //   for (var i = 0; i < dRandNum.length; i++) {
      //     var oneNumPosition = dRandNum[i]
      //     var xIndex = oneNumPosition.indexOf("x");
      //     var oneNumPositionX = Number(oneNumPosition.slice(0, xIndex));
      //     var oneNumPositionY = Number(oneNumPosition.slice(xIndex + 1));
      //     var array = []
      //     for (var j = 0; j < oneNumPositionX; j++) {
      //       for (var k = 0; k < oneNumPositionY; k++) {
      //         array.push(`${j}:${k}`);
      //       }
      //     };
      //     numPosition.push(array)
      //   };
      //   totalNumPosition.push(numPosition)
      // });
      // console.log(totalNumPosition)

      // var totalPosition = []
      // var notTotalPosition = []
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
      // roop1: for (var index = 0; index < totalNum / 2; index++) {
      //   if (totalPosition.length > out(totalPosition, notTotalPosition).length) {
      //     var totalPosition = out(totalPosition, notTotalPosition);
      //   }
      //   console.log('indexindexindexindexindexindex')
      //   console.log(index)
      //   var notTotalPositionLength = notTotalPosition.length
      //   if (index == 0) {
      //     var randSize = allNums[Math.floor(Math.random() * allNums.length)]
      //     console.log(randSize)
      //     var sizeIndex = allNums.indexOf(randSize);
      //     var randPositions = totalNumPosition[sizeIndex]
      //     console.log(randPositions)
      //     var randPosition = randPositions[Math.floor(Math.random() * randPositions.length)]
      //     console.log(randPosition)
      //     for (var i = 0; i < randPosition.length; i++) {
      //       var setPosition = randPosition[i]
      //       console.log(setPosition)
      //       var colonIndex = setPosition.indexOf(":");
      //       var positionX = Number(setPosition.slice(0, colonIndex));
      //       console.log(positionX)
      //       var positionY = Number(setPosition.slice(colonIndex + 1));
      //       console.log(positionY)
      //       notTotalPosition.push(`${x + positionX * oneSideNum}:${y + positionY * oneSideNum}`);
      //       console.log(notTotalPosition)
      //     }
      //     var lastPosition = randPosition[randPosition.length - 1]
      //     var colonIndex = lastPosition.indexOf(":");
      //     var boxSizeX = ((Number(lastPosition.slice(0, colonIndex)) + 1) * oneSideNum);
      //     console.log(boxSizeX)
      //     var boxSizeY = ((Number(lastPosition.slice(colonIndex + 1)) + 1) * oneSideNum);
      //     console.log(boxSizeY)
      //     $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //     eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //     eval("canvas" + index + ".width = " + `${boxSizeX}` + ";");
      //     eval("canvas" + index + ".height = " + `${boxSizeY}` + ";");
      //     $(`#canvas${index}`).offset({top: y, left: x});
      //     $(`#canvas${index}`).css("position", "absolute");
      //     var xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //     var colonIndex = xujiPosition.indexOf(":");
      //     var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //     var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
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
      //     var ifPosition = totalPosition.pop();
      //     console.log(totalPosition)
      //     console.log(ifPosition)
      //     console.log('????????????????????????????????????????????')
      //     var colonIndex = ifPosition.indexOf(":");
      //     var ifPositionX = Number(ifPosition.slice(0, colonIndex));
      //     console.log(ifPositionX)
      //     var ifPositionY = Number(ifPosition.slice(colonIndex + 1));
      //     console.log(ifPositionY)
      //     var randSize = allNums[Math.floor(Math.random() * allNums.length)]
      //     console.log(randSize)
      //     var sizeIndex = allNums.indexOf(randSize);
      //     var randPositions = totalNumPosition[sizeIndex]
      //     console.log(randPositions)
      //     var randPosition = randPositions[Math.floor(Math.random() * randPositions.length)]
      //     console.log(randPosition)
      //     var lastPosition = randPosition[randPosition.length - 1]
      //     var colonIndex = lastPosition.indexOf(":");
      //     var boxSizeX = ((Number(lastPosition.slice(0, colonIndex)) + 1) * oneSideNum);
      //     console.log(boxSizeX)
      //     var boxSizeY = ((Number(lastPosition.slice(colonIndex + 1)) + 1) * oneSideNum);
      //     console.log(boxSizeY)
      //     if (ifPositionX + boxSizeX > x + boardSize || ifPositionY + boxSizeY > y + boardSize) {
      //       if (ifPositionX + boxSizeY > x + boardSize || ifPositionY + boxSizeX > y + boardSize) {
      //         totalPosition.unshift(ifPosition);
      //         console.log('continue289')
      //         continue roop2;
      //       } else {
      //         console.log('else292')
      //         console.log(randPosition, randPositions)
      //         for (var i = 0; i < randPosition.length; i++) {
      //           var randPositionI = randPosition[i]
      //           var colonIndex = randPositionI.indexOf(":");
      //           var randPositionX = Number(randPositionI.slice(0, colonIndex));
      //           var randPositionY = Number(randPositionI.slice(colonIndex + 1));
      //           randPosition.splice(i, 1, `${randPositionY}:${randPositionX}`);
      //           console.log(randPosition)
      //         };
      //         var ifSetPosition = []
      //         for (var i = 0; i < randPosition.length; i++) {
      //           var randP = randPosition[i]
      //           var colonI = randP.indexOf(":");
      //           var randPX = Number(randP.slice(0, colonI));
      //           var randPY = Number(randP.slice(colonI + 1));
      //           ifSetPosition.push(`${ifPositionX + randPX * oneSideNum}:${ifPositionY + randPY * oneSideNum}`);
      //         };
      //         console.log(ifSetPosition)
      //         if (check(ifSetPosition, notTotalPosition).length > 0) {
      //           totalPosition.unshift(ifPosition);
      //           console.log('continue312')
      //           continue roop2;
      //         } else {
      //           for (var i = 0; i < ifSetPosition.length; i++) {
      //             notTotalPosition.push(ifSetPosition[i])
      //           }
      //           $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //           eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //           eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //           eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //           $(`#canvas${index}`).offset({top: `${ifPositionY}`, left: `${ifPosition}`});
      //           $(`#canvas${index}`).css("position", "absolute");
      //           var xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //           var colonIndex = xujiPosition.indexOf(":");
      //           var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //           var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
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
      //       var ifSetPosition = []
      //       for (var i = 0; i < randPosition.length; i++) {
      //         var randP = randPosition[i]
      //         var colonI = randP.indexOf(":");
      //         var randPX = Number(randP.slice(0, colonI));
      //         var randPY = Number(randP.slice(colonI + 1));
      //         ifSetPosition.push(`${ifPositionX + randPX * oneSideNum}:${ifPositionY + randPY * oneSideNum}`);
      //       };
      //       console.log(ifSetPosition)
      //       if (check(ifSetPosition, notTotalPosition).length > 0) {
      //         totalPosition.unshift(ifPosition);
      //         console.log('continue312')
      //         continue roop2;
      //       } else {
      //         for (var i = 0; i < ifSetPosition.length; i++) {
      //           notTotalPosition.push(ifSetPosition[i])
      //         }
      //         $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //         eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //         eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //         eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //         $(`#canvas${index}`).offset({top: `${ifPositionY}`, left: `${ifPositionX}`});
      //         $(`#canvas${index}`).css("position", "absolute");
      //         var xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //         var colonIndex = xujiPosition.indexOf(":");
      //         var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //         var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
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
      //     var lastBoxPosition = out(position, notTotalPosition);
      //     console.log(lastBoxPosition)
      //     var allPositionX = []
      //     var allPositionY = []
      //     for (var i = 0; i < lastBoxPosition.length; i++) {
      //       var setPosition = lastBoxPosition[i]
      //       var colonIndex = setPosition.indexOf(":");
      //       var positionX = Number(setPosition.slice(0, colonIndex));
      //       allPositionX.push(positionX)
      //       var positionY = Number(setPosition.slice(colonIndex + 1));
      //       allPositionY.push(positionY)
      //     };
      //     var matchPositionX = match(allPositionX);
      //     var matchPositionY = match(allPositionY);
      //     console.log(matchPositionX)
      //     console.log(matchPositionY)
      //     var totalMatchPositions = []
      //     var totalMatchPositionsL = []
      //     for (var i = 0; i < matchPositionX.length; i++) {
      //       var totalMatchPositionX = []
      //       var pattern = new RegExp(`^${matchPositionX[i]}:`, "g");
      //       var matchPX = lastBoxPosition.filter(oneP => oneP.match(pattern));
      //       console.log(matchPX)
      //       for (var j = 0; j < matchPX.length - 1; j++) {
      //         var prev = matchPX[j]
      //         var colonIndex = prev.indexOf(":");
      //         var prevY = Number(prev.slice(colonIndex + 1));
      //         var next = matchPX[j + 1]
      //         var colonIndex = next.indexOf(":");
      //         var nextY = Number(next.slice(colonIndex + 1));
      //         if (prevY == nextY + oneSideNum || prevY + oneSideNum == nextY) {
      //           totalMatchPositionX.push(prev)
      //           totalMatchPositionX.push(next)
      //           var totalMatchPositionX = cut(totalMatchPositionX);
      //           console.log(totalMatchPositionX)
      //         }
      //       }
      //       if (totalMatchPositionX.length > 0) {
      //         totalMatchPositions.push(totalMatchPositionX);
      //         totalMatchPositionsL.push(totalMatchPositionX.length);
      //       }
      //     }
      //     console.log(totalMatchPositions, totalMatchPositionsL)
      //     for (var i = 0; i < matchPositionY.length; i++) {
      //       var totalMatchPositionY = []
      //       var pattern = new RegExp(`:${matchPositionY[i]}$`, "g");
      //       var matchPY = lastBoxPosition.filter(oneP => oneP.match(pattern));
      //       console.log(matchPY)
      //       for (var j = 0; j < matchPY.length - 1; j++) {
      //         var prev = matchPY[j]
      //         var colonIndex = prev.indexOf(":");
      //         var prevX = Number(prev.slice(0, colonIndex));
      //         var next = matchPY[j + 1]
      //         var colonIndex = next.indexOf(":");
      //         var nextX = Number(next.slice(0, colonIndex));
      //         if (prevX == nextX + oneSideNum || prevX + oneSideNum == nextX) {
      //           totalMatchPositionY.push(prev)
      //           totalMatchPositionY.push(next)
      //           var totalMatchPositionY = cut(totalMatchPositionY);
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
      //       var index = -1
      //       continue roop1;
      //     } else {
      //       var totalMatchPosition = []
      //       for (var i = 0; i < totalMatchPositions.length; i++) {
      //         totalMatchPosition.push(...totalMatchPositions[i])
      //       }
      //       console.log(totalMatchPosition, totalMatchPositions)
      //       var matchPosition = notMatch(totalMatchPosition)
      //       console.log(matchPosition)
      //       if (matchPosition.length == lastBoxPosition.length) {
      //         while (check(position, notTotalPosition).length == position.length) {
      //           var matchArray = []
      //           roop3: for (var i = 0; i < lastBoxPosition.length; i++) {
      //             for (var j = 1; j < lastBoxPosition.length; j++) {
      //               var lastPosition = lastBoxPosition[i]
      //               var colonIndex = setPosition.indexOf(":");
      //               var lastPositionX = Number(lastPosition.slice(0, colonIndex));
      //               allPositionX.push(positionX)
      //               var lastPositionY = Number(lastPosition.slice(colonIndex + 1));
      //               allPositionY.push(positionY)
      //               var patternX = new RegExp(`^${lastPositionX + oneSideNum * j}:`, "g");
      //               var matchPX = lastBoxPosition.filter(oneP => oneP.match(patternX));
      //               if (matchPX == null) {
      //                 continue roop3;
      //               }
      //               var patternY = new RegExp(`^${lastPositionX + oneSideNum * j}:`, "g");
      //               var matchPX = lastBoxPosition.filter(oneP => oneP.match(patternY));
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
      //         var xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //         var colonIndex = xujiPosition.indexOf(":");
      //         var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //         var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
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
      //           var index = -1
      //           continue roop1;
      //         }
      //       } else {
      //         matchPosition.forEach
      //       }



      //       totalMatchPositionsX.forEach(function (tMPX) {
      //         console.log(tMPX)
      //         for (var i = index + 1; i < index + 1 + tMPX.length; i++) {
      //           console.log(i, index, tMPX.length, tMPX, i - index + 1)
      //           var matchPosition = tMPX[i - (index + 1)]
      //           console.log(matchPosition)
      //           var randSize = tMPX.length
      //           var colonIndex = matchPosition.indexOf(":");
      //           var positionX = Number(matchPosition.slice(0, colonIndex));
      //           console.log(positionX)
      //           var positionY = Number(matchPosition.slice(colonIndex + 1));
      //           console.log(positionY)
      //           notTotalPosition.push(`${positionX}:${positionY}`);
      //           console.log(notTotalPosition)
      //           $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //           eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //           eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //           eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //           $(`#canvas${index}`).offset({top: `${ifPositionY}`, left: `${ifPositionX}`});
      //           $(`#canvas${index}`).css("position", "absolute");
      //           var xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //           var colonIndex = xujiPosition.indexOf(":");
      //           var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //           var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
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
      //         var index = -1
      //         continue roop1;
      //       } else {
      //         var xLength = totalMatchPositionsXL.length
      //         console.log(xLength)
      //         totalMatchPositionsY.forEach(function (tMPY) {
      //           for (var i = index + 1 + xLength; i < index + 1 + xLength + tMPY.length; i++) {
      //             console.log(i, index, xLength, tMPY)
      //             var matchPosition = tMPY[i - (index + 1 + xLength)]
      //             console.log(matchPosition)
      //             var randSize = tMPY.length
      //             var colonIndex = matchPosition.indexOf(":");
      //             var positionX = Number(matchPosition.slice(0, colonIndex));
      //             console.log(positionX)
      //             var positionY = Number(matchPosition.slice(colonIndex + 1));
      //             console.log(positionY)
      //             notTotalPosition.push(`${positionX}:${positionY}`);
      //             console.log(notTotalPosition)
      //             $(`.easybackground__box canvas:eq(${index})`).attr('class','canvas' + `${randSize}`);
      //             eval("var canvas" + index + " = document.getElementById('canvas" + index + "');");
      //             eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //             eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //             $(`#canvas${index}`).offset({top: `${ifPositionY + boxSizeY}`, left: `${ifPositionX + boxSizeX}`});
      //             $(`#canvas${index}`).css("position", "absolute");
      //             var xujiPosition = randPosition[Math.floor(Math.random() * randPositions.length)]
      //             var colonIndex = xujiPosition.indexOf(":");
      //             var xujiPositionX = Number(xujiPosition.slice(0, colonIndex));
      //             var xujiPositionY = Number(xujiPosition.slice(colonIndex + 1));
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
      //           var index = -1
      //           continue roop1;
      //         }
      //       }
      //     }
      //   };
      // }
      // for (var i = 0; i < totalNum / 2; i ++) {
      //   if ( $(`.easybackground__box canvas:eq(${i})`).is("[class]") == false){
      //     document.getElementById(`canvas${i}`).remove();
      //     document.getElementById(`canvas${i}xuji`).remove();
      //   }
      // }

    


      // var totalPosition = []
      // var notTotalPosition = []
      // const check = (array1, array2) => {
      //   return array1.filter(value1 => array2.includes(value1));
      // }
      // const out = (array3, array4) => {
      //   return [...array3, ...array4].filter(value2 => !array3.includes(value2) || !array4.includes(value2));
      // }
      // while (check(position, notTotalPosition).length != totalNum) {
      //   block1: for(var index = 0; index < totalRandNum.length; index++) {
      //     var totalPosition = out(totalPosition, notTotalPosition);
      //     if (notTotalPosition.length > totalNum) {
      //       notTotalPosition.length = 0
      //       totalPosition.length = 0
      //       var index = 0
      //       continue block1;
      //     }
      //     if (index == 0) {
      //       var boxSizeNum = totalRandNum[index]
      //       var randId = Math.floor(Math.random() * boxSizeNum);
      //       var boxSizes = multiplicationTotalRandNum[index]
      //       var boxSize = boxSizes[Math.floor(Math.random() * boxSizes.length)]
      //       console.log(boxSize)
      //       var xIndex = boxSize.indexOf("x");
      //       var boxSizeX = Number(boxSize.slice(0, xIndex));
      //       var boxSizeY = Number(boxSize.slice(xIndex + 1));
      //       var sizeIndex = boxSizes.indexOf(boxSize);
      //       var ifSetPosition = totalBoxPosition[index]
      //       var setPosition = ifSetPosition[sizeIndex]
      //       if (boxSizeX < 720) {
      //         totalPosition.push(`${x + boxSizeX}:${y}`);
      //       }
      //       if (boxSizeY < 720) {
      //         totalPosition.push(`${x}:${y + boxSizeY}`);
      //       }
      //       console.log(totalPosition)
      //       for (var i = 0; i < boxSizeNum; i++) {
      //         if (i == randId) {
      //           var oneSetPosition = setPosition[i]
      //           var colonIndex = oneSetPosition.indexOf(":");
      //           var positionX = Number(oneSetPosition.slice(0, colonIndex));
      //           var positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //           notTotalPosition.push(`${x + positionX * oneSideNum}:${y + positionY * oneSideNum}`);
      //           console.log(notTotalPosition)
      //           var positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
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
      //           var oneSetPosition = setPosition[i]
      //           var colonIndex = oneSetPosition.indexOf(":");
      //           var positionX = Number(oneSetPosition.slice(0, colonIndex));
      //           var positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //           notTotalPosition.push(`${x + positionX * oneSideNum}:${y + positionY * oneSideNum}`);
      //           console.log(notTotalPosition)
      //           var positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //           $(`#${positionId.id}`).attr('class','canvas' + `${boxSizeNum}`);
      //         }
      //       };
      //     // } else if (index == totalRandNum.length - (3 + maxNumBox / 6)) {
            
      //     } else {
      //       block2: for (var i = 0; i < totalPosition.length; i++) {
      //         var ifPosition = totalPosition.pop();
      //         console.log(totalPosition)
      //         console.log(ifPosition)
      //         var colonIndex = ifPosition.indexOf(":");
      //         var ifPositionX = Number(ifPosition.slice(0, colonIndex));
      //         var ifPositionY = Number(ifPosition.slice(colonIndex + 1));
      //         var ifSetPosition = totalBoxPosition[index]
      //         console.log(ifSetPosition)
      //         var setPosition = ifSetPosition[Math.floor(Math.random() * ifSetPosition.length)]
      //         console.log(setPosition)
      //         var lastSetPosition = setPosition[setPosition.length - 1]
      //         var colonIndex = lastSetPosition.indexOf(":");
      //         var setPositionX = Number(lastSetPosition.slice(0, colonIndex));
      //         var setPositionY = Number(lastSetPosition.slice(colonIndex + 1));
      //         var canSetPosition = out(position, notTotalPosition);
      //         console.log(canSetPosition)
      //         if ((ifPositionX - x) / oneSideNum + setPositionX > maxNumBox - 1) {
      //           if ((ifPositionY - y) / oneSideNum + setPositionY > maxNumBox - 1) {
      //             totalPosition.unshift(ifPosition);
      //             console.log(totalPosition)
      //             console.log("continue286")
      //             continue block2;
      //           } else {
      //             var ifPositionArr = []
      //             for (var i = 0; i < setPosition.length; i++) {
      //               var setP = setPosition[i]
      //               var colonI = setP.indexOf(":");
      //               var setPX = Number(setP.slice(0, colonI));
      //               var setPY = Number(setP.slice(colonI + 1));
      //               ifPositionArr.push(`${ifPositionX + setPX * oneSideNum}:${ifPositionY + setPY * oneSideNum}`);
      //             }
      //             console.log(ifPositionArr)
      //             console.log(canSetPosition, ifPosition)
      //             if (check(canSetPosition, ifPositionArr).length == ifPositionArr.length) {
      //               var startBoxSizeNum = totalRandNum[index - 1]
      //               console.log(startBoxSizeNum)
      //               var boxSizeNum = totalRandNum[index]
      //               console.log(boxSizeNum)
      //               var randId = Math.floor(Math.random() * (boxSizeNum + 1 - index)) + index;
      //               var sizeIndex = ifSetPosition.indexOf(setPosition);
      //               console.log(sizeIndex)
      //               var boxSizes = multiplicationTotalRandNum[index]
      //               console.log(boxSizes)
      //               var boxSize = boxSizes[sizeIndex]
      //               console.log(boxSize)
      //               var xIndex = boxSize.indexOf("x");
      //               var boxSizeX = Number(boxSize.slice(0, xIndex));
      //               var boxSizeY = Number(boxSize.slice(xIndex + 1));
      //               if (ifPositionX + boxSizeX < x + 720) {
      //                 totalPosition.push(`${ifPositionX + boxSizeX}:${ifPositionY}`);
      //               }
      //               if (ifPositionY + boxSizeY < y + 720) {
      //                 totalPosition.push(`${ifPositionX}:${ifPositionY + boxSizeY}`);
      //               }
      //               console.log(totalPosition)
      //               for (var i = startBoxSizeNum; i < startBoxSizeNum + boxSizeNum; i++) {
      //                 if (i == randId) {
      //                   var oneSetPosition = setPosition[i - startBoxSizeNum]
      //                   var colonIndex = oneSetPosition.indexOf(":");
      //                   var positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                   var positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                   notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                   console.log(notTotalPosition)
      //                   var positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //                   $(`#${positionId.id}`).attr('id','canvas' + i + "xuji");
      //                   $(`#canvas${i}xuji`).attr('class','canvas' + `${boxSizeNum}` + "xuji");
      //                   eval("var canvas" + i + "xuji" + " = document.getElementById('canvas" + i + "xuji" + "');");
      //                   eval("var ctx" + i + "xuji" + " = canvas.getContext('2d');");
      //                   eval("ctx" + i + "xuji" + ".font = '" + `${oneSideNum / 2}` + "px serif';");
      //                   eval("ctx" + i + "xuji" + ".fillStyle = 'rgba(0, 0, 255)';");
      //                   eval("ctx" + i + "xuji" + ".fillText('" + `${boxSizeNum}` + "', " + `${x}` + ", " + `${y}` + ");");
      //                 } else {
      //                   var oneSetPosition = setPosition[i - startBoxSizeNum]
      //                   var colonIndex = oneSetPosition.indexOf(":");
      //                   var positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                   var positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                   notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                   console.log(notTotalPosition)
      //                   var positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
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
      //           var ifPositionArr = []
      //           for (var i = 0; i < setPosition.length; i++) {
      //             var setP = setPosition[i]
      //             var colonI = setP.indexOf(":");
      //             var setPX = Number(setP.slice(0, colonI));
      //             var setPY = Number(setP.slice(colonI + 1));
      //             ifPositionArr.push(`${ifPositionX + setPX * oneSideNum}:${ifPositionY + setPY * oneSideNum}`);
      //           }
      //           console.log(ifPositionArr)
      //           console.log(canSetPosition, ifPosition)
      //           if (check(canSetPosition, ifPositionArr).length == ifPositionArr.length) {
      //             var startBoxSizeNum = totalRandNum[index - 1]
      //             console.log(startBoxSizeNum)
      //             var boxSizeNum = totalRandNum[index]
      //             console.log(boxSizeNum)
      //             var randId = Math.floor(Math.random() * (boxSizeNum + 1 - index)) + index;
      //             var sizeIndex = ifSetPosition.indexOf(setPosition);
      //             console.log(sizeIndex)
      //             var boxSizes = multiplicationTotalRandNum[index]
      //             console.log(boxSizes)
      //             var boxSize = boxSizes[sizeIndex]
      //             console.log(boxSize)
      //             var xIndex = boxSize.indexOf("x");
      //             var boxSizeX = Number(boxSize.slice(0, xIndex));
      //             var boxSizeY = Number(boxSize.slice(xIndex + 1));
      //             if (ifPositionX + boxSizeX < x + 720) {
      //               totalPosition.push(`${ifPositionX + boxSizeX}:${ifPositionY}`);
      //             }
      //             if (ifPositionY + boxSizeY < y + 720) {
      //               totalPosition.push(`${ifPositionX}:${ifPositionY + boxSizeY}`);
      //             }
      //             console.log(totalPosition)
      //             for (var i = startBoxSizeNum; i < startBoxSizeNum + boxSizeNum; i++) {
      //               if (i == randId) {
      //                 var oneSetPosition = setPosition[i - startBoxSizeNum]
      //                 console.log(i)
      //                 console.log(oneSetPosition ,setPosition)
      //                 var colonIndex = oneSetPosition.indexOf(":");
      //                 var positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                 var positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                 notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                 console.log(notTotalPosition)
      //                 var positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
      //                 $(`#${positionId.id}`).attr('id','canvas' + i + "xuji");
      //                 $(`#canvas${i}xuji`).attr('class','canvas' + `${boxSizeNum}` + "xuji");
      //                 eval("var canvas" + i + "xuji" + " = document.getElementById('canvas" + i + "xuji" + "');");
      //                 eval("var ctx" + i + "xuji" + " = canvas.getContext('2d');");
      //                 eval("ctx" + i + "xuji" + ".font = '" + `${oneSideNum / 2}` + "px serif';");
      //                 eval("ctx" + i + "xuji" + ".fillStyle = 'rgba(0, 0, 255)';");
      //                 eval("ctx" + i + "xuji" + ".fillText('" + `${boxSizeNum}` + "', " + `${x}` + ", " + `${y}` + ");");
      //               } else {
      //                 var oneSetPosition = setPosition[i - startBoxSizeNum]
      //                 console.log(i)
      //                 console.log(oneSetPosition ,setPosition)
      //                 var colonIndex = oneSetPosition.indexOf(":");
      //                 var positionX = Number(oneSetPosition.slice(0, colonIndex));
      //                 var positionY = Number(oneSetPosition.slice(colonIndex + 1));
      //                 notTotalPosition.push(`${ifPositionX + positionX * oneSideNum}:${ifPositionY + positionY * oneSideNum}`);
      //                 console.log(notTotalPosition)
      //                 var positionId = document.elementFromPoint(`${x + positionX * oneSideNum}`, `${y + positionY * oneSideNum}`)
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





      // for (var i = 0; i < totalRandNum.length; i++) {
      //   var canvas = document.createElement("canvas");
      //   $(".easybackground__box").append(canvas);
      //   $(`.easybackground__box canvas:eq(${i})`).attr('id','canvas' + i);
      //   eval("var canvas" + i + " = document.getElementById('canvas" + i + "');");
      // }
      // var totalPosition = []
      // var notTotalPosition = []
      // const check = (array1, array2) => {
      //   return array1.filter(value1 => array2.includes(value1));
      // }
      // const out = (array3, array4) => {
      //   return [...array3, ...array4].filter(value => !array3.includes(value) || !array4.includes(value));
      // }
      // while (check(position, notTotalPosition).length != totalNum) {
      //   block1: for(var index = 0; index < totalRandNum.length; index++) {
      //     var totalPosition = out(totalPosition, notTotalPosition);
      //     if (notTotalPosition.length > totalNum) {
      //       notTotalPosition.length = 0
      //       totalPosition.length = 0
      //       var multiplicationTotalRandNum = shuffle(multiplicationTotalRandNum)
      //       var index = 0
      //       continue block1;
      //     } else {
      //       if (index == 0) {
      //         var randBoxSize = multiplicationTotalRandNum[index]
      //         var boxSize = randBoxSize[Math.floor(Math.random() * randBoxSize.length)]
      //         var xIndex = boxSize.indexOf("x");
      //         var boxSizeX = Number(boxSize.slice(0, xIndex));
      //         var boxSizeY = Number(boxSize.slice(xIndex + 1));
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
      //         // var randPositionX = Math.floor(Math.random() * (boxSizeX / oneSideNum));
      //         // var randPositionY = Math.floor(Math.random() * (boxSizeY / oneSideNum));
      //         // $(`.easybackground__xuji canvas:eq(${index})`).offset({top: y + randPositionY * oneSideNum, left: x + randPositionX * oneSideNum});
      //         // $(`.easybackground__xuji canvas:eq(${index})`).css("position", "absolute");
      //         if (boxSizeY < 720) {
      //           totalPosition.push(`${x}:${y + boxSizeY}`);
      //         }
      //         if (boxSizeX < 720) {
      //           totalPosition.push(`${x + boxSizeX}:${y}`);
      //         }
      //         for(var i = 0; i < boxSizeY / oneSideNum; i++) {
      //           for(var j = 0; j < boxSizeX / oneSideNum; j++) {
      //             notTotalPosition.push(`${x + oneSideNum * j}:${y + oneSideNum * i}`)
      //           }
      //         };
      //       } else {
      //         block2: for (var i = 0; i < totalPosition.length; i++) {
      //           var ifPosition = totalPosition.pop();
      //           if (ifPosition == "960:520") {
      //             continue block2;
      //           }
      //           var colonIndex = ifPosition.indexOf(":");
      //           var positionX = Number(ifPosition.slice(0, colonIndex));
      //           var positionY = Number(ifPosition.slice(colonIndex + 1));
      //           var randBoxSize = multiplicationTotalRandNum[index]
      //           var boxSize = randBoxSize[Math.floor(Math.random() * randBoxSize.length)]
      //           var xIndex = boxSize.indexOf("x");
      //           var boxSizeX = Number(boxSize.slice(0, xIndex));
      //           var boxSizeY = Number(boxSize.slice(xIndex + 1));
      //           $(`#canvas${index}`).attr('class','canvas' + `${(boxSizeX / oneSideNum) * (boxSizeY / oneSideNum)}`);
      //           eval("canvas" + index + ".width = " + `${boxSizeX}` + ";");
      //           eval("canvas" + index + ".height = " + `${boxSizeY}` + ";");
      //           $(`#canvas${index}`).offset({top: positionY, left: positionX});
      //           $(`#canvas${index}`).css("position", "absolute");
      //           var rightPositionX = positionX + boxSizeX;
      //           var bottomPositionY = positionY + boxSizeY;
      //           if (rightPositionX > x + 720 || bottomPositionY > y + 720) {
      //             eval("canvas" + index + ".width = " + `${boxSizeY}` + ";");
      //             eval("canvas" + index + ".height = " + `${boxSizeX}` + ";");
      //             var rightPositionX = positionX + boxSizeY;
      //             var bottomPositionY = positionY + boxSizeX;
      //             if (rightPositionX > x + 720 || bottomPositionY > y + 720) {
      //               totalPosition.unshift(ifPosition);
      //               continue block2;
      //             } else {
      //               temporaryPosition = []
      //               for(var a = 0; a < boxSizeX / oneSideNum; a++) {
      //                 for(var b = 0; b < boxSizeY / oneSideNum; b++) {
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
      //             for(var a = 0; a < boxSizeY / oneSideNum; a++) {
      //               for(var b = 0; b < boxSizeX / oneSideNum; b++) {
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