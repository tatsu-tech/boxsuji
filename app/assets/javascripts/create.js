$(document).on('turbolinks:load', function() {
  $(".game-screen__quiz-lists").on("click", ".game-screen__quiz-lists--create-game", function() {
    $(".create-screen").fadeToggle();
  })
  $(".create-screen").on("click", ".backbtn", function() {
    $(".create-screen").fadeToggle();
    return false;
  })

  $('input[name="cell"]:radio').change(function() {
    let cellVal = Number($(this).val());
    var canvasCellsNum = document.getElementById('canvasCellsNum');
    canvasCellsNum.height = 460;
    canvasCellsNum.width = 1000;
    let ctxCellsNum = canvasCellsNum.getContext('2d');
    let inputOneSideNum = 440 / cellVal
    ctxCellsNum.clearRect(0, 0, 1000, 460);
    for(let i = 0, j = cellVal; i < j; i++) {
      for(let k = 0; k < j; k++) {
        ctxCellsNum.beginPath();
        ctxCellsNum.rect(`${280 + i * inputOneSideNum}`, `${10 + k * inputOneSideNum}`, `${inputOneSideNum}`, `${inputOneSideNum}`);
        ctxCellsNum.fillStyle = 'lightgray';
        ctxCellsNum.strokeStyle = 'black';
        ctxCellsNum.lineWidth = 1;
        ctxCellsNum.fill();
        ctxCellsNum.stroke();
      }
    };
    ctxCellsNum.textAlign = 'center';
    ctxCellsNum.textBaseline = 'middle';
    ctxCellsNum.font = 'bold 100px Arial, meiryo, sans-serif';
    ctxCellsNum.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctxCellsNum.fillText(`${cellVal}x${cellVal}`,500, 235);
  });

  let pathName = location.pathname;
  // ゲーム盤面のサイズ指定
  let boardSize = 720
  if (pathName.includes("/games/new")) {
    const maxNumBox = gon.question.cell

    // 盤面の一辺の長さを求め、そこからひとマス当たりの一辺の長さを求める
    const oneSideNum = boardSize / maxNumBox

    // ゲームの盤面である.playbackground__main--boxの左上の角のx座標およびy座標をそれぞれ360px,10pxとする
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
    console.log(allNums)
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
    console.log(divisorAllNums)
    
    for (let i = 0, j = allNums.length; i < j; i++) {
      var canvas = document.createElement("canvas");
      $(".createbackground__main--xujilist").append(canvas);
      $(`.createbackground__main--xujilist canvas:eq(${i})`).attr('id','canvas' + i + "xujilist");
      $(`.createbackground__main--xujilist canvas:eq(${i})`).attr('data-xujilist', `${allNums[i]}`);
      eval("var canvas" + i + "xujilist = document.getElementById('canvas" + i + "xujilist');");
      eval("ctx" + i + "xujilist = canvas" + i + "xujilist.getContext('2d');");
      eval("canvas" + i + "xujilist.width = 150;");
      eval("canvas" + i + "xujilist.height = "+ `${oneSideNum}` +";");
      eval("ctx" + i + "xujilist.textAlign = 'center';");
      eval("ctx" + i + "xujilist.textBaseline = 'middle';");
      eval("ctx" + i + "xujilist.font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
      eval("ctx" + i + "xujilist.fillStyle = 'rgba(0, 0, 0, 0.8)';");
      eval("ctx" + i + "xujilist.fillText('" + `${allNums[i]}` + "', 75," + `${(oneSideNum) / 2}` + ");");
      $(`.createbackground__main--xujilist canvas:eq(${i})`).css('cursor', 'pointer');
    }
    let position = []
    for(let i = 0, j = maxNumBox; i < j; i++) {
      for(let k = 0; k < j; k++) {
        let index = i * j + k
        var canvas = document.createElement("canvas");
        $(".createbackground__main--xuji").append(canvas);
        $(`.createbackground__main--xuji canvas:eq(${index})`).attr('id','canvasXuji' + index);
        eval("var canvasXuji" + index + " = document.getElementById('canvasXuji" + index + "');");
        eval("var ctxXuji" + index + " = canvasXuji" + index + ".getContext('2d');");
        eval("canvasXuji" + index + ".width = " + `${oneSideNum}` + ";");
        eval("canvasXuji" + index + ".height = " + `${oneSideNum}` + ";");
        canvas = document.createElement("canvas");
        $(".createbackground__main--box").append(canvas);
        $(`.createbackground__main--box canvas:eq(${index})`).attr('id','canvas' + index);
        eval("var canvas" + index + "box = document.getElementById('canvas" + index + "');");
        eval("var ctx" + index + " = canvas" + index + "box.getContext('2d');");
        eval("canvas" + index + ".width = " + `${oneSideNum}` + ";");
        eval("canvas" + index + ".height = " + `${oneSideNum}` + ";");
        $(`.createbackground__main--box canvas:eq(${index})`).attr('data-position',`${x + oneSideNum * k}:${y + oneSideNum * i}`);
        $(`.createbackground__main--box canvas:eq(${index})`).attr('data-onOff','off');
        eval("ctx" + index + ".rect(0, 0, " + `${oneSideNum}` + ", " + `${oneSideNum}` + ");");
        eval("ctx" + index + ".fillStyle = 'lightgray';");
        eval("ctx" + index + ".fill();");
        eval("ctx" + index + ".stroke();");
        position.push(`${x + oneSideNum * k}:${y + oneSideNum * i}`);
      }
    };
    let clickIdArray = []
    $(".createbackground__main--xuji").on("click", "canvas", function() {
      if (clickIdArray.length > 0) {
        let beforeI = clickIdArray.pop();
        $(`.createbackground__main--box canvas:eq(${beforeI})`).css('opacity', '1');
      }
      let clickedId = this.id
      let iIndex = clickedId.indexOf("i");
      let i = Number(clickedId.slice(iIndex + 1));
      $(`.createbackground__main--box canvas:eq(${i})`).css('opacity', '0.7');
      clickIdArray.push(i);
    })
    $(".createbackground__main--xujilist").on("click", "canvas", function() {
      if (clickIdArray.length > 0) {
        let xujilistNum = Number($(this).attr('data-xujilist'));
        let i = clickIdArray.pop();
        $(`.createbackground__main--box canvas:eq(${i})`).attr('data-onOff', 'on');
        eval("ctxXuji" + i + ".clearRect(0, 0, " + `${oneSideNum}` + ", " + `${oneSideNum}` + ");");
        eval("ctxXuji" + i + ".textAlign = 'center';");
        eval("ctxXuji" + i + ".textBaseline = 'middle';");
        eval("ctxXuji" + i + ".font = 'bold " + `${oneSideNum / 2}` + "px Arial, meiryo, sans-serif';");
        eval("ctxXuji" + i + ".fillStyle = 'rgba(0, 0, 0, 0.8)';");
        eval("ctxXuji" + i + ".fillText('" + `${xujilistNum}` + "', " + `${oneSideNum / 2}, ${oneSideNum / 2}` + ");");
        $(`.createbackground__main--box canvas:eq(${i})`).css('opacity', '1');
        $(`.createbackground__main--box canvas:eq(${i})`).attr('data-onOff', 'on');
        $(`.createbackground__main--box canvas:eq(${i})`).attr('data-xuji', `${xujilistNum}`);
      }
    })
    $("#drawXujiEraseBtn").click(function() {
      if (clickIdArray.length > 0) {
        let i = clickIdArray.pop();
        eval("ctxXuji" + i + ".clearRect(0, 0, " + `${oneSideNum}` + ", " + `${oneSideNum}` + ");");
        $(`.createbackground__main--box canvas:eq(${i})`).css('opacity', '1');
        $(`.createbackground__main--box canvas:eq(${i})`).attr('data-onOff', 'off');
        $(`.createbackground__main--box canvas:eq(${i})`).removeAttr('data-xuji');
      }
    })
    $("#drawBtn").click(function() {
      $("#clearBtn").toggle();
      $("#resetBtn").toggle();
      $("#drawBoard").toggle();
      $("#drawBtn").each(function () {
        if (this.style.background == "rgb(189, 5, 118)") {
          this.style.background = "rgb(2, 78, 150)";
          $("#drawText").text("Draw");
          $("#createBtn").css("pointer-events", "auto");
          $(".createbackground__main--xujilist").css("pointer-events", "auto");
          $(".createbackground__main--xujierase").css("pointer-events", "auto");
          $(".createbackground__main--xuji").css("pointer-events", "auto");
          $(".createbackground__main--box").css("pointer-events", "auto");
        } else {
          this.style.background = "rgb(189, 5, 118)";
          $("#drawText").text("Drawing . . .");
          $("#createBtn").css("pointer-events", "none");
          $(".createbackground__main--xujilist").css("pointer-events", "none");
          $(".createbackground__main--xujierase").css("pointer-events", "none");
          $(".createbackground__main--xuji").css("pointer-events", "none");
          $(".createbackground__main--box").css("pointer-events", "none");
        }
      });
    })

    const drawPositions = {
      firstClickPositionX:  0,
      firstClickPositionY:  0,
      secondClickPositionX: 0,
      secondClickPositionY: 0,
      drawCount:            0,
    };
    function onMouseMove(e) {
      eval("var canvasBoxuji" + drawPositions.drawCount + "= document.getElementById('canvasBoxuji" + drawPositions.drawCount + "');");
      eval("var ctxBoxuji = canvasBoxuji" + drawPositions.drawCount + ".getContext('2d');");
      drawPositions.secondClickPositionX = e.pageX - x;
      drawPositions.secondClickPositionY = e.pageY - y;
      let boxujiWidth = drawPositions.secondClickPositionX - drawPositions.firstClickPositionX
      let boxujiHeight = drawPositions.secondClickPositionY - drawPositions.firstClickPositionY
      eval("canvasBoxuji" + drawPositions.drawCount + ".width = " + boxujiWidth + ";");
      eval("canvasBoxuji" + drawPositions.drawCount + ".height = " + boxujiHeight + ";");
      ctxBoxuji.strokeStyle = 'red';
      ctxBoxuji.lineWidth = 6;
      ctxBoxuji.strokeRect(0, 0, `${boxujiWidth}`, `${boxujiHeight}`);
      $(".createbackground__main--boxuji--relative canvas:eq(-1)").css('position', 'absolute');
      $(".createbackground__main--boxuji--relative canvas:eq(-1)").css('left', `${drawPositions.firstClickPositionX}px`);
      $(".createbackground__main--boxuji--relative canvas:eq(-1)").css('top', `${drawPositions.firstClickPositionY}px`);
    };
    var canvasDrawBoard = document.getElementById('drawBoard');
    $(".createbackground__main--drawboard").on("click", "canvas", function(e) {
      $(this).each(function () {
        if (!$(this).attr('data-firstClick')) {
          $("#clearBtn").css("pointer-events", "none");
          $("#resetBtn").css("pointer-events", "none");
          $("#drawBtn").css("pointer-events", "none");
          $(this).attr('data-firstClick', 'click')
          drawPositions.firstClickPositionX = e.pageX - x;
          drawPositions.firstClickPositionY = e.pageY - y;
          var canvas = document.createElement("canvas");
          $(".createbackground__main--boxuji--relative").append(canvas);
          $(".createbackground__main--boxuji--relative canvas:eq(-1)").attr('id','canvasBoxuji' + drawPositions.drawCount);
          eval("canvasBoxuji" + drawPositions.drawCount + ".width = 0;");
          eval("canvasBoxuji" + drawPositions.drawCount + ".height = 0;");
          canvasDrawBoard.addEventListener ("mousemove", onMouseMove, false);
        } else {
          $("#clearBtn").css("pointer-events", "auto");
          $("#resetBtn").css("pointer-events", "auto");
          $("#drawBtn").css("pointer-events", "auto");
          $(this).removeAttr('data-firstClick')
          eval("var canvasBoxuji = document.getElementById('canvasBoxuji" + drawPositions.drawCount + "');");
          eval("var ctxBoxuji = canvasBoxuji" + drawPositions.drawCount + ".getContext('2d');");
          ctxBoxuji.fillStyle = 'rgba(0,255,0,0.4)';
          ctxBoxuji.fillRect(0, 0, `${drawPositions.secondClickPositionX - drawPositions.firstClickPositionX}`, `${drawPositions.secondClickPositionY - drawPositions.firstClickPositionY}`);
          ctxBoxuji.strokeStyle = 'red';
          ctxBoxuji.lineWidth = 6;
          ctxBoxuji.strokeRect(0, 0, `${drawPositions.secondClickPositionX - drawPositions.firstClickPositionX}`, `${drawPositions.secondClickPositionY - drawPositions.firstClickPositionY}`);
          drawPositions.drawCount++
          canvasDrawBoard.removeEventListener ("mousemove", onMouseMove, false);
        }
      })
    })
    $("#clearBtn").click(function() {
      if ($(".createbackground__main--boxuji--relative canvas:eq(-1)").attr('id')) {
        $(".createbackground__main--boxuji--relative canvas:eq(-1)").remove();
      } else {
        alert('Nothing to clear.')
      }
    })
    $("#resetBtn").click(function() {
      if ($(".createbackground__main--boxuji--relative canvas:eq(-1)").attr('id')) {
        $(".createbackground__main--boxuji--relative canvas").remove();
      } else {
        alert('Nothing to reset.')
      }
    })

    // 2つの配列の共通する要素を削除する関数overlapAllDeleteを定義([0,1,2,3] + [3,1,0] => [2])
    const overlapAllDelete = (array1, array2) => {
      return [...array1, ...array2].filter(value => !array1.includes(value) || !array2.includes(value));
    }
    // 1つの配列内の要素の和を求める関数sumInArrayを定義([0,1,2,3] => 6)
    const sumInArray = function(array) {
      return array.reduce(function(prev, current, i, array) {
          return Number(prev) + Number(current);
      }, 0);
    };
    // 1つの配列内の重複要素を無くす関数overlapIsOneを定義([3,0,1,0,1,2,3,3] => [3,0,1,2])
    const overlapIsOne = (array) => {
      return array.filter((value, index, self) => self.indexOf(value) === index);
    }

    var resultArray = []
    var questionTitleArray = []
    $(".createbackground").on("click", "#createBtn", function() {
      let xuji = []
      let xujiPositions = []
      let allCells = gon.question.cell ** 2
      for (let i = 0, j = allCells; i < j; i++) {
        let oneXuji = $(`.createbackground__main--box canvas:eq(${i})`).attr('data-xuji');
        if (oneXuji != undefined) {
          xuji.push(oneXuji);
          xujiPositions.push($(`.createbackground__main--box canvas:eq(${i})`).attr('data-position'));
        }
      }
      if (sumInArray(xuji) == allCells) {
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
            let rightPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.createbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
            if (rightPosition === undefined) {
              break;
            }
            rightPositions.push(rightPosition);
          }
          for (let k = 1, l = xujiNum; k < l; k++) {
            let matchPosition = `${xujiPositionX - oneSideNum * k}:${xujiPositionY}`
            let leftPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.createbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
            if (leftPosition === undefined) {
              break;
            }
            leftPositions.push(leftPosition);
          }
          for (let k = 1, l = xujiNum; k < l; k++) {
            let matchPosition = `${xujiPositionX}:${xujiPositionY + oneSideNum * k}`
            let upPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.createbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
            if (upPosition === undefined) {
              break;
            }
            upPositions.push(upPosition);
          }
          for (let k = 1, l = xujiNum; k < l; k++) {
            let matchPosition = `${xujiPositionX}:${xujiPositionY - oneSideNum * k}`
            let downPosition = totalPosition.find(oneP => oneP == matchPosition && $(`.createbackground__main--box canvas[data-position='${matchPosition}']`).attr('data-onOff') == "off");
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
                  let checkOneOtherPosition = totalPosition.find(oneP => oneP == oneOtherPosition && $(`.createbackground__main--box canvas[data-position='${oneOtherPosition}']`).attr('data-onOff') == "off");
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
                        let checkOneOtherSetPosition = totalPosition.find(oneP => oneP == oneOtherSetPosition && $(`.createbackground__main--box canvas[data-position='${oneOtherSetPosition}']`).attr('data-onOff') == "off");
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
        let onlyXujiPositions = []
        let flatTotalXujiPositions = []
        for (let i = 0, j = totalXujiPositions.length; i < j; i++) {
          let oneXujiPositions = totalXujiPositions[i];
          if (oneXujiPositions.length == 0) {
            alert('This question has no answer.')
            return false;
          }
          let flatOneXujiPositions = oneXujiPositions.flat(1)
          onlyXujiPositions.push(overlapIsOne(flatOneXujiPositions));
          flatTotalXujiPositions.push(flatOneXujiPositions);
        }
        let flatOnlyXujiPositions = onlyXujiPositions.flat();
        let deleteOnlyXujiPositions = overlapAllDelete(flatOnlyXujiPositions, xujiPositions);
        let overlapCount = (deleteOnlyXujiPositions).reduce((prev, curr) => {
          prev[curr] = prev[curr] ? ++prev[curr] : 1;
          return prev;
        },[]);
        let onlyOnePositions = []
        let overlapCountKeys = Object.keys(overlapCount)
        let overlapCountValues = Object.values(overlapCount)
        if (overlapCountKeys.length + xujiPositions.length != position.length) {
          alert('This question has no answer.')
          return false;
        }
        overlapCountValues.filter(function(overlapCountValue, index) {
          if (overlapCountValue == 1) {
            onlyOnePositions.push(overlapCountKeys[index]);
          }
        });
        let cloneTotalXujiPositions = []
        if (onlyOnePositions.length > 0) {
          let onlyOnePositionsIndex = []
          block: for (let i = 0, j = onlyOnePositions.length; i < j; i++) {
            let onlyOnePosition = onlyOnePositions[i]
            for (let k = 0, l = flatTotalXujiPositions.length; k < l; k++) {
              let oneXujiPositions = flatTotalXujiPositions[k]
              let includeOnlyOnePosition = oneXujiPositions.indexOf(onlyOnePosition)
              if (includeOnlyOnePosition != -1) {
                onlyOnePositionsIndex.push(k);
                if (i == j - 1) {
                  break block;
                } else {
                  continue block;
                }
              }
            }
          }
          let clone = totalXujiPositions.slice(0);
          if ((overlapIsOne(onlyOnePositionsIndex)).length != onlyOnePositionsIndex.length) {
            for (let i = 0, j = onlyOnePositions.length; i < j; i++) {
              let onlyOnePosition = onlyOnePositions[i]
              let onlyOnePositionIndex = onlyOnePositionsIndex[i]
              let onlyOneXujiPositions = clone[onlyOnePositionIndex]
              let includeOnlyOneXujiPositions = []
              for (let k = 0, l = onlyOneXujiPositions.length; k < l; k++) {
                let onlyOneXujiPosition = onlyOneXujiPositions[k]
                if (onlyOneXujiPosition.includes(onlyOnePosition)) {
                  includeOnlyOneXujiPositions.push(onlyOneXujiPosition);
                }
              }
              clone.splice(onlyOnePositionIndex, 1, includeOnlyOneXujiPositions);
            }
          }
          cloneTotalXujiPositions.push(...clone);
        } else {
          let clone = totalXujiPositions.slice(0);
          cloneTotalXujiPositions.push(...clone);
        }
        let sortTotalXujiPositions = cloneTotalXujiPositions.sort(function(a, b) {
          let aXujiPositionsLength = a.length
          let bXujiPositionsLength = b.length
          return (aXujiPositionsLength < bXujiPositionsLength ? -1 : 1)
        });
        // keyは多次元配列であるsortOneXujiPositionsの親のindexをkeyで示し、valueはその親に対応した子供のindexを示すようにすることで、今までのindexの道すじを表す連想配列childIndexHistoryを作成
        // 多次元配列であるsortOneXujiPositionsの子供配列の最大index数を示す配列maxChildIndexの作成
        // これらの配列を用いることにより、繰り返し行いたいfor文のような処理を再帰関数で実現しようとしている
        let childIndexHistory = {}
        let maxChildIndex = []
        for (let i = 0, j = sortTotalXujiPositions.length; i < j; i++) {
          let sortOneXujiPositions = sortTotalXujiPositions[i]
          childIndexHistory[i] = undefined
          maxChildIndex.push((sortOneXujiPositions.length - 1))
        }
        let parentIndexCount = 0
        // 再帰関数をwhile文に書き換え、10x10は1秒ほどで検証結果が出るところまでできたが、12x12になるとフリーズしてしまうため、10x10ができるこのアルゴリズムで一時保留
        // 問題によっても左右するが(難易度を考慮しない単純な問題であれば20x20でも時間はかからない)、自作問題では10x10における数字の組み合わせの総数は約8x10*13、12x12では約3x10*18と跳ね上がることがフリーズの原因
        roop: while (parentIndexCount != sortTotalXujiPositions.length) {
          if (childIndexHistory[parentIndexCount] == undefined) {
            childIndexHistory[parentIndexCount] = 0
          }
          let childIndexHistoryKeys = Object.keys(childIndexHistory)
          let childIndexHistoryValues = Object.values(childIndexHistory)
          if (childIndexHistoryValues[parentIndexCount] > maxChildIndex[parentIndexCount]) {
            if (parentIndexCount - 1 < 0) {
              break roop;
            }
            childIndexHistory[parentIndexCount] = undefined
            if (childIndexHistory[parentIndexCount - 1] != undefined) {
              childIndexHistory[parentIndexCount - 1]++
            }
            parentIndexCount--
            continue roop;
          }
          let checkArray = []
          for (let i = 0, j = childIndexHistoryKeys.length; i < j; i++) {
            let parentI = childIndexHistoryKeys[i]
            let childI = childIndexHistoryValues[i]
            if (childI == undefined) {
              break;
            }
            checkArray.push(...(sortTotalXujiPositions[parentI][childI]))
          }
          if (checkArray.length == (overlapIsOne(checkArray)).length) {
            parentIndexCount++
            continue roop;
          } else {
            childIndexHistory[parentIndexCount]++
            continue roop;
          }
        }
        console.log(childIndexHistory)
        if (parentIndexCount == sortTotalXujiPositions.length) {
          let questionTitle = window.prompt("Please enter this question title.", "")
          questionTitleArray.push(questionTitle)
          let lastTitle = questionTitleArray.pop();
          console.log(lastTitle)
          if (lastTitle === null) {
            return false;
          } else if (!lastTitle) {
            alert('Please enter other title.')
            return false;
          } else {
            let result = window.confirm('Create this question.\nIs it ok？');
            resultArray.push(result);
            let lastResult = resultArray.pop();
            if (!lastResult) {
              return false;
            } else {
              let form = document.getElementById('createForm')
              let nameData = document.createElement("input");
              nameData.setAttribute("type", "hidden");
              nameData.name = "name";
              nameData.value = lastTitle;
              form.appendChild(nameData);
              let cellData = document.createElement("input");
              cellData.setAttribute("type", "hidden");
              cellData.name = "cell";
              cellData.value = gon.question.cell;
              form.appendChild(cellData);
              let xujiData = document.createElement("input");
              xujiData.setAttribute("type", "hidden");
              xujiData.name = "xuji";
              xujiData.value = xuji;
              form.appendChild(xujiData);
              let positionData = document.createElement("input");
              positionData.setAttribute("type", "hidden");
              positionData.name = "position";
              positionData.value = xujiPositions;
              form.appendChild(positionData);
            }
          }
        } else {
          alert('This question has no answer.')
          return false;
        }
        // 再帰関数
        // 10x10の検証結果が出るまでの時間は約30秒ほど
        // let whetherCanCreate = function (parentIndexCount, childIndexHistory) {
        //   if (parentIndexCount == sortTotalXujiPositions.length) {
        //     console.log(childIndexHistory)
        //     alert('ok')
        //     return true;
        //   }
        //   if (childIndexHistory[parentIndexCount] == undefined) {
        //     childIndexHistory[parentIndexCount] = 0
        //   }
        //   let childIndexHistoryKeys = Object.keys(childIndexHistory)
        //   let childIndexHistoryValues = Object.values(childIndexHistory)
        //   if (childIndexHistoryValues[parentIndexCount] > maxChildIndex[parentIndexCount]) {
        //     if (parentIndexCount - 1 < 0) {
        //       alert('ng')
        //       return false;
        //     }
        //     childIndexHistory[parentIndexCount] = undefined
        //     if (childIndexHistory[parentIndexCount - 1] != undefined) {
        //       childIndexHistory[parentIndexCount - 1]++
        //     }
        //     return setTimeout(function() {whetherCanCreate(parentIndexCount - 1, childIndexHistory)},0)
        //   }
        //   let checkArray = []
        //   for (let i = 0, j = childIndexHistoryKeys.length; i < j; i++) {
        //     let parentI = childIndexHistoryKeys[i]
        //     let childI = childIndexHistoryValues[i]
        //     if (childI == undefined) {
        //       break;
        //     }
        //     checkArray.push(...(sortTotalXujiPositions[parentI][childI]))
        //   }
        //   if (checkArray.length == (overlapIsOne(checkArray)).length) {
        //     return setTimeout(function() {whetherCanCreate(parentIndexCount + 1, childIndexHistory)},0)
        //   } else {
        //     childIndexHistory[parentIndexCount]++
        //     return setTimeout(function() {whetherCanCreate(parentIndexCount, childIndexHistory)},0)
        //   }
        // }
        // console.log(whetherCanCreate(0, childIndexHistory))
        
      } else {
        alert('This question has no answer.')
        return false;
      }
    })
  }
})