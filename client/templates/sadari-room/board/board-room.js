var WAITING_MSG        = '대기중';
var ON_COLOR           = 'green';
var DISABLED           = 'disabled';
var COM_NAME           = '컴퓨터';

Template.boardRoom.onCreated(function() {
  var template = this;
  // save the board functions in the context
  template.board = new Board();
});

Template.boardRoom.helpers({
  ladderSet: function() {
    var roomInfo = this.roomInfo.fetch()[0];
    return roomInfo.ladderSet;
  },
  playerName: function() {
    var thisLadderSet = this;
    return thisLadderSet.playerName;
  },
  prizeName: function() {
    var thisLadderSet = this;
    return thisLadderSet.prizeName;
  },
  isPrizeOn: function() {
    return '';
  },
  isPlayerOn: function() {
    return '';
  },
  isCom: function() {
    var thisLadderSet = this;
    if(this.playerName === COM_NAME) {
      return true;
    }
    return false;
  },
  prizeDisabled: function() {
    var roomInfo = Template.instance().data.roomInfo.fetch()[0];
    var creatorID = roomInfo.creatorID;

    if( (creatorID === Meteor.userId()) && roomInfo.gameStage === 'init') {
      return '';
    }

    return DISABLED;
  }
});

Template.boardRoom.events({
  // remove the no prize error message on the control area
  'focus .sadari-prize input': function(event, template) {
    $('.prize-share .button').attr('disabled', false);
    $('.prize-share .error.message').fadeOut();
  }
});

Template.boardRoom.onRendered(function() {
  var template          = this;
  var roomInfo          = template.data.roomInfo.fetch()[0];
  var board             = template.board;
  var roomID            = roomInfo._id;
  var playersNum        = roomInfo.playersNum;
  var storedNodesCoord  = roomInfo.ladderNodesCoord;
  var ladderDrawEl      = '#ladderDraw';
  var ladderContainerEl = '#ladderContainer';
  var ladderControlEl   = '.control';
  var ladderColumnEl    = '.board-column';
  var ladderPlayerEl    = '.player';
  var ladderBottomEl    = '.sadari-prize';
  var ladderTopEl       = '.sadari-player';
  var ladderTopElTag    = 'player';
  var ladderBottomElTag = 'prize';
  var ladderNodesCoord  = [];

  // board.setLadderLeftMargin(ladderPlayerEl, ladderControlEl);
  board.setLadderHeight(ladderColumnEl);
  board.setLadderContainerArea(ladderContainerEl, ladderBottomEl, ladderTopEl, ladderControlEl);
  board.setLadderDrawArea(ladderDrawEl, ladderBottomEl, ladderTopEl, ladderControlEl, ladderColumnEl);

  if(storedNodesCoord) {
    ladderNodesCoord = storedNodesCoord;
  } else {
    // Generate the nodes coord of each player line
    ladderNodesCoord = board.getLadderNodesCoord(playersNum, ladderContainerEl, ladderTopElTag, ladderBottomElTag);
    // Save the ladderNodesCoord in the room db
    Meteor.call('sadariRoomUpdate', {roomID: roomID, set: {ladderNodesCoord:ladderNodesCoord}},
      function(error, result) {
        if(error) {
          // todo: show the error message
          Router.go('/');
        }
        if(result) {
        }
    });
  }

  // set the focus on the prize input box
  if(roomInfo.gameStage === 'init') {
    template.$('.sadari-prize input')[0].focus();
  }

  // show the result
  if(roomInfo.gameStage === 'end') {
    var ladderSet         = roomInfo.ladderSet;
    var resultContainerEl = '#resultContainer';
    var resultDrawEl      = '#resultDraw';
    var playResults       = [];
    var ladderResults     = [];
    var routeResults      = [];

    board.drawLadderSideLines(playersNum, ladderNodesCoord, ladderDrawEl);
    board.drawLadderNodesBridges(playersNum, ladderNodesCoord, ladderDrawEl, ladderContainerEl);

    board.setResultContainerArea(resultContainerEl, ladderContainerEl);
    board.setResultDrawArea(resultDrawEl, ladderDrawEl);

    // reset player lines
    board.emptyPlayerLines(resultDrawEl);

    for (var playerID = 0; playerID < playersNum; playerID++) {
      // calculate the result for each player
      playResults[playerID] = board.playLadderGame(playerID, ladderSet, ladderNodesCoord, ladderDrawEl);
    }

    // separate the two results
    // ladderResults = _.pluck(playResults, 'result');
    routeResults = _.pluck(playResults, 'route');

    // draw the results lines, false means no animation and no sadariRoomUpdate
    board.drawLadderResult(playersNum, routeResults, resultDrawEl, roomID, false);
  }
});

Board = function() {
  this.strokeWidth        = 4;
  this.nodeSize           = 2;
  this.nodeDelta          = 30;
  this.nodeOffset         = 20;
  this.minNodeNum         = 2;
  this.maxNodeNum         = 6;
  this.sideLinecolor      = '#cccccc';
  this.bridgeColor        = '#9a9696';
  this.nodeLineColor      = '#9a9696';
  this.nodeFillColor      = '#9a9696';
  this.sampleScreenHeight = 1000;
  this.allNodesY          = []; // used in getLadderNodeCoord as global
}

Board.prototype.drawLadderSideLines = function (playersNum, ladderNodesCoord, ladderDrawEl) {

  for (var playerID = 0; playerID < playersNum; playerID++) {
    var ladderSideLineEl = this.getLadderSideLineEl(playerID, ladderNodesCoord[playerID], ladderDrawEl);
    $(ladderDrawEl).prepend(ladderSideLineEl);
  }
}

Board.prototype.drawLadderNodesBridges = function (playersNum, ladderNodesCoord, ladderDrawEl, ladderContainerEl) {

  for (var playerID = 0; playerID < playersNum; playerID++) {
    var ladderNodeEl = this.getLadderNodeEl(ladderNodesCoord[playerID], ladderDrawEl);
    var ladderBridgeEl = this.getLadderBridgeEl(ladderNodesCoord[playerID], ladderDrawEl, ladderContainerEl);

    $(ladderDrawEl).append(ladderNodeEl);
    $(ladderDrawEl).append(ladderBridgeEl);
  }
}

Board.prototype.drawLadderBridges = function (playersNum, ladderNodesCoord, ladderDrawEl, ladderContainerEl) {
  for (var playerID = 0; playerID < playersNum; playerID++) {
    var ladderBridgeEl = this.getLadderBridgeEl(ladderNodesCoord[playerID], ladderDrawEl, ladderContainerEl);
    $(ladderDrawEl).append(ladderBridgeEl);
  }
}

Board.prototype.drawLadderNodes = function (playersNum, ladderNodesCoord, ladderDrawEl) {
  for (var playerID = 0; playerID < playersNum; playerID++) {
    var ladderNodeEl = this.getLadderNodeEl(ladderNodesCoord[playerID], ladderDrawEl);
    $(ladderDrawEl).append(ladderNodeEl);
  }
}

Board.prototype.animateLadderResult = function(resultDrawEl, roomID) {

  var timeMin = 3000;
  var timeDelay = 50;
  var paths = $(resultDrawEl).find('path');

  //animate
  $.each(paths, function(playerID, v) {

    //get the total length
    var totalLength = this.getTotalLength();

    //set PATHs to invisible
    $(this).css({
      'stroke-dashoffset': totalLength,
      'stroke-dasharray': totalLength + ' ' + totalLength
    });

    $(this).delay(timeDelay * playerID).animate( {'stroke-dashoffset': 0 }, {
      duration: timeMin,
      easing: 'easeInOutQuad',
      complete: function(result, other) {
        if (playerID === ( paths.length - 1 )) {
          // close loading result
          $('.segment.control').removeClass('loading');
          // game finished
          Meteor.call("sadariRoomUpdate", {roomID: roomID, set: {isGameFinished: true} },
            function(error, result) {
              if (error) {
              }
              if (result) {
                // when the game finished show the reset button
                // set the game end
                Meteor.call("sadariRoomUpdate", {roomID: roomID, set: {isOpen: true, gameStage:'end'}});
              }
          });
        }

        return;
      }
    });
  });
}

Board.prototype.drawLadderResult = function (playersNum, routeResults, resultDrawEl, roomID, isAnimate){

  for (var playerID = 0; playerID < playersNum; playerID++) {

    var playerLine   = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    var $playerLine  = $(playerLine);
    var hue          = 'rgba(' + (Math.floor(Math.random() * 256)) + ',' +
                        (Math.floor(Math.random() * 256)) + ',' +
                        (Math.floor(Math.random() * 256)) + ',0.5)';

    $playerLine.attr('id', 'playerLine-' + playerID);
    $playerLine.attr('d', routeResults[playerID]);
    $playerLine.attr('stroke-width', '4px');
    $playerLine.css('stroke', hue);
    $playerLine.css('fill', 'none');
    $(resultDrawEl).append(playerLine);
  }

  if(isAnimate) {
    this.animateLadderResult(resultDrawEl, roomID);
  }
}

Board.prototype.reDrawLadder = function () {

  this.emptyAllLadderLines();
  this.drawLadder();
}

Board.prototype.emptyAllLadderLines = function () {

  if ($ladderDraw.length > 0) $ladderDraw.empty();
  this.emptyPlayerLines();
}

Board.prototype.setLadderContainerArea = function (ladderContainerEl, ladderBottomEl, ladderTopEl, controlEl) {

  var $ladderContainer       = $(ladderContainerEl);
  var ladderDistance         = $('.player:eq(0)').outerWidth();
  // var ladderContainerLeft = $(controlEl).outerWidth();
  var ladderBttomElTop       = $(ladderBottomEl + ':eq(0)').offset().top;
  var ladderTopElHeight      = $(ladderTopEl + ':eq(0)').offset().top + $(ladderTopEl + ':eq(0)').outerHeight();
  var ladderContainerHeight  = ladderBttomElTop - ladderTopElHeight;
  var ladderContainerTop     = $('#1-player').offset().top + $('#1-player').outerHeight();

  $ladderContainer.attr('dist', ladderDistance);
  $ladderContainer.css({
    // left   : ladderContainerLeft,
    top    : ladderContainerTop,
    height : ladderContainerHeight
  });
}

Board.prototype.setLadderDrawArea = function (ladderDrawEl, ladderBottomEl, ladderTopEl, controlEl, ladderColumnEl) {

  var $ladderDraw          = $(ladderDrawEl);
  var ladderBttomElTop     = $(ladderBottomEl + ':eq(0)').offset().top;
  var ladderTopElHeight    = $(ladderTopEl + ':eq(0)').offset().top + $(ladderTopEl + ':eq(0)').outerHeight();
  var ladderLastColEl      = ladderColumnEl + ':last-child';
  var ladderLastColElLeft  = $(ladderLastColEl).offset().left;
  var ladderLastColElWidth = $(ladderLastColEl).outerWidth();
  var ladderControlElWidth = $(controlEl).outerWidth();
  var ladderHeight         = ladderBttomElTop - ladderTopElHeight;
  var ladderWidth          = ladderLastColElLeft + ladderLastColElWidth - ladderControlElWidth;

  $ladderDraw.attr("height", ladderHeight);
  $ladderDraw.attr("width", ladderWidth);
}

Board.prototype.setLadderHeight = function (ladderColumnEl) {

  var windowHeight = $(window).height();

  $(ladderColumnEl).css('height', windowHeight);
}

Board.prototype.setLadderLeftMargin = function (ladderPlayerEl, ladderControlEl) {
  $(ladderPlayerEl + ':eq(0)').css('margin-left', $(ladderControlEl).outerWidth());
}

Board.prototype.setRandNodeY = function (topY, bottomY) {
  var offset = this.getRandomInt(10, this.nodeOffset);
  return this.getRandomInt((topY + offset), (bottomY - offset));
}

Board.prototype.setResultContainerArea = function  (resultContainerEl, ladderContainerEl) {
  $(resultContainerEl).css({
    left: $(ladderContainerEl).css('left'),
    top: $(ladderContainerEl).css('top')
  });
}

Board.prototype.setResultDrawArea = function  (resultDrawEl, ladderDrawEl) {
  $(resultDrawEl).attr({
    'width': $(ladderDrawEl).attr('width'),
    'height': $(ladderDrawEl).attr('height')
  });
}

// Generate the nodes coord of each player line
Board.prototype.getLadderNodesCoord = function (playersNum, ladderContainerEl, topElTag, bottomElTag) {

  var ladderNodesCoord = [];
  var ladderTopBottomCoord = [];

  for (var playerID = 0; playerID < playersNum; playerID++) {
    ladderTopBottomCoord = this.getLadderTopBottomCoord(ladderContainerEl, playerID, topElTag, bottomElTag);
    ladderNodesCoord[playerID] = this.getLadderNodeCoord(playersNum, ladderTopBottomCoord, playerID);
  }

  return ladderNodesCoord;
}

Board.prototype.getLadderTopBottomCoord = function (ladderContainerEl, playerID, topElTag, bottomElTag) {

  var ladderContainerTop  = $(ladderContainerEl).offset().top;
  var ladderContainerLeft = $(ladderContainerEl).offset().left;
  var $topEl              = $('#' + playerID + '-' + topElTag);
  var $bottomEl           = $('#' + playerID + '-' + bottomElTag);
  var topCoord            = $topEl.offset();
  var bottomCoord         = $bottomEl.offset();
  var topX                = topCoord.left + 0.5 * $topEl.outerWidth() - ladderContainerLeft;
  var topY                = topCoord.top + $topEl.outerHeight() - ladderContainerTop;
  var bottomX             = bottomCoord.left + 0.5 * $bottomEl.outerWidth() - ladderContainerLeft;
  var bottomY             = bottomCoord.top - ladderContainerTop;
  var ladderTopBottomCoord = [];

  ladderTopBottomCoord['top'] = {
    x: topX,
    y: topY
  };
  ladderTopBottomCoord['bottom'] = {
    x: bottomX,
    y: bottomY
  };

  return ladderTopBottomCoord;
}

Board.prototype.getLadderNodeCoord = function (playersNum, ladderTopBottomCoord, playerID) {

  var prevNodesY = [];
  var newNodesY  = [];
  var nodesY     = [];
  var nodesCoord = [];
  var numOfNodes = this.getRandomInt(this.minNodeNum, this.maxNodeNum);
  var topY       = ladderTopBottomCoord['top'].y;
  var topX       = ladderTopBottomCoord['top'].x;
  var bottomY    = this.sampleScreenHeight + ladderTopBottomCoord['top'].y;
  var bottomX    = ladderTopBottomCoord['bottom'].x;

  // first node
  nodesCoord.push({
    x: topX,
    y: topY,
    d: 0,
    c: playerID
  });

  // clone the prev nodes to nodesY and nodesCoord
  if ((playerID - 1) >= 0) {

    prevNodesY = this.allNodesY[playerID - 1].new.slice(0);
    nodesY = prevNodesY.slice(0);

    _.each(nodesY, function(nodeY, index) {
      nodesCoord.push({
        x: topX,
        y: nodeY,
        d: -1,
        c: playerID
      });
    });

  }

  if (playerID < (playersNum - 1)) {

    // gen random nodes
    for (var i = 0; i < numOfNodes; i++) {

      // random nodeY between top and bottom sideLine
      var nodeY = this.setRandNodeY(topY, bottomY);

      //check if the nodeY is not close to other nodes
      for (var j = 0; j < nodesY.length; j++) {

        // the nodeY should be out of the range
        while (nodesY[j] < (nodeY + this.nodeSize * this.nodeDelta) && nodesY[j] > (nodeY - this.nodeSize * this.nodeDelta)) {
          // regenerate nodeY
          nodeY = this.setRandNodeY(topY, bottomY);
          // reset iteration
          j = 0;
        }
      }

      newNodesY.push(nodeY);
      nodesY.push(nodeY);

      // middle nodes
      nodesCoord.push({
        x: topX,
        y: nodeY,
        d: 1,
        c: playerID
      });
    }

    this.allNodesY[playerID] = {
      new: newNodesY,
      prev: prevNodesY
    };
  }

  // last node
  nodesCoord.push({
    x: bottomX,
    y: bottomY,
    d: 0,
    c: playerID
  });

  nodesCoord = _.sortBy(nodesCoord, 'y');

  return nodesCoord;
}

Board.prototype.getLadderSideLineEl = function (playerID, ladderNodeCoord, ladderDrawEl) {

  var sideLineEl   = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  var $sideLineEl  = $(sideLineEl);
  var ladderHeight = $(ladderDrawEl).attr("height");
  var screenRatio  = ladderHeight / this.sampleScreenHeight;
  $sideLineEl.attr('id', 'sideLine-' + playerID);
  $sideLineEl.attr("d", "M" + _.first(ladderNodeCoord).x + " " +
                              _.first(ladderNodeCoord).y * screenRatio + " V" +
                              _.last(ladderNodeCoord).y * screenRatio);
  $sideLineEl.attr('stroke-width', '4px');
  $sideLineEl.css('stroke', this.sideLinecolor);
  $sideLineEl.css('fill', 'none');

  return $sideLineEl;
}

Board.prototype.getLadderNodeEl = function (ladderNodeCoord, ladderDrawEl) {

  var nodesEl      = [];
  var nodeX        = _.first(ladderNodeCoord).x;
  var ladderHeight = $(ladderDrawEl).attr("height");
  var screenRatio  = ladderHeight / this.sampleScreenHeight;

  for (var i = 0; i < ladderNodeCoord.length; i++) {

    if (ladderNodeCoord[i].d !== 0) {

      var nodeY = ladderNodeCoord[i].y * screenRatio;

      nodesEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
      nodesEl[i].setAttribute('cx', nodeX);
      nodesEl[i].setAttribute('cy', nodeY);
      nodesEl[i].setAttribute('r', this.nodeSize);
      nodesEl[i].style.stroke = this.nodeLineColor;
      nodesEl[i].style.fill = this.nodeFillColor;
    }
  }
  return nodesEl;
}

Board.prototype.getLadderBridgeEl = function (ladderNodeCoord, ladderDrawEl, ladderContainerEl) {

  var bridgeEl       = [];
  var nodeX          = _.first(ladderNodeCoord).x;
  var ladderHeight   = $(ladderDrawEl).attr("height");
  var screenRatio    = ladderHeight / this.sampleScreenHeight;
  var ladderDistance = $(ladderContainerEl).attr('dist');

  for (var i = 0; i < ladderNodeCoord.length; i++) {

    if (ladderNodeCoord[i].d > 0) {

      var nodeY = ladderNodeCoord[i].y * screenRatio;

      bridgeEl[i] = document.createElementNS("http://www.w3.org/2000/svg", 'path');
      bridgeEl[i].setAttribute('d', "M" + nodeX + " " + nodeY + " h" + ladderDistance);
      bridgeEl[i].setAttribute('stroke-width', '2px');
      bridgeEl[i].style.fill = 'none';
      bridgeEl[i].style.stroke = this.bridgeColor;
    }
  }

  return bridgeEl;
}

Board.prototype.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

Board.prototype.playLadderGame = function (playerID, ladderSet, ladderNodesCoord, ladderDrawEl) {

  var ladderHeight = $(ladderDrawEl).attr("height");
  var screenRatio  = ladderHeight / this.sampleScreenHeight;
  var playResults  = {resut:{}, route:''};
  var route        = 'M ';
  var nodeIndex    = 0;
  var _playerID    = playerID; // _playerID is the current player's ID

  route += ladderNodesCoord[playerID][nodeIndex].x + ' ';
  route += ladderNodesCoord[playerID][nodeIndex].y * screenRatio + ' ';

  while (nodeIndex < (ladderNodesCoord[playerID].length - 1)) {

    // next item nodeIndex
    nodeIndex++;

    // next node Y
    var curNode = ladderNodesCoord[playerID][nodeIndex];
    var nextNode = {};

    // next node Y route
    route += 'V' + curNode.y * screenRatio + ' ';

    // next node dir
    playerID += curNode.d;

    // check the next column object
    nextNode = _.where(ladderNodesCoord[playerID], {
      y: curNode.y
    })[0];

    // cross the bridge
    route += 'H' + nextNode.x + ' ';

    // check the nodeIndex of the item
    nodeIndex = ladderNodesCoord[playerID].indexOf(nextNode);
  }

  // results of the players
  if(ladderSet[_playerID].playerName === WAITING_MSG) {
    var playerName = COM_NAME;
    ladderSet[_playerID].playerName = COM_NAME;
  } else {
    var playerName = ladderSet[_playerID].playerName;
  }

  playResults.result = {
    player   : playerName,
    prize    : ladderSet[playerID].prizeName,
    sitNum   : _playerID + 1,
    startLine: _playerID,
    endLine  : playerID
  };

  playResults.route = route;

  return playResults;
}

Board.prototype.emptyPlayerLines = function (resultDrawEl) {

  if (typeof $(resultDrawEl) != 'undefined') $(resultDrawEl).empty();
}

Board.prototype.hideSVGPaths = function (resultDrawEl)  {

  var paths = $(resultDrawEl).find('path');

  //for each PATH..
  $.each(paths, function() {

    //get the total length
    var totalLength = this.getTotalLength();

    //set PATHs to invisible
    $(this).css({
      'stroke-dashoffset': totalLength,
      'stroke-dasharray': totalLength + ' ' + totalLength
    });
  });
}
