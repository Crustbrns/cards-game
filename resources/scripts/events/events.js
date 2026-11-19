"use strict";
function isPointInBox(x, y, w, h, px, py) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
}
function IsOverTableCard(card, x, y) {
    return isPointInBox(card.position.x * CardWidth / 100 - 90, card.position.y * CardHeight / 100 - 72, 170, 200, x, y);
}
const MouseGrip = new Position(46.8, 34.6, 0);
let dragGrip = MouseGrip;
function GetScenePoint(event) {
    let origin = document.getElementById('container').getBoundingClientRect();
    return new Position((event.x - origin.left) / sceneScale, (event.y - origin.top) / sceneScale, 0);
}
window.onresize = (event) => {
    Resize();
};
window.onpointerdown = (event) => {
    if (!event.isPrimary)
        return;
    let item = document.elementFromPoint(event.x, event.y);
    if ((item === null || item === void 0 ? void 0 : item.classList.contains('card')) && deck.player.cards.findIndex(x => x.id === parseInt(item.id.slice(4))) !== -1) {
        item.classList.add('dragging');
        document.getElementsByTagName('html')[0].style.cursor = 'none';
        dragGrip = MouseGrip;
        if (event.pointerType !== 'mouse') {
            let card = deck.player.cards.find(x => x.id === parseInt(item.id.slice(4)));
            let point = GetScenePoint(event);
            dragGrip = new Position(point.x - card.position.x * CardWidth / 100, point.y - card.position.y * CardHeight / 100, 0);
        }
        ArrangeCards(deck.player.cards.filter(x => x.id !== parseInt(item.id.slice(4))), true);
    }
    // console.log(item, deck.player.cards.findIndex(x => x.id === parseInt(item.id.slice(0, 4))), deck.player.cards);
};
window.onpointercancel = (event) => {
    for (const item of Array.from(document.getElementsByClassName('dragging'))) {
        item.classList.remove('dragging');
    }
    ArrangeCards(deck.player.cards, true);
};
window.onpointerup = (event) => {
    var _a, _b, _c;
    if (!event.isPrimary)
        return;
    let draggings = document.getElementsByClassName('dragging');
    if (draggings.length > 0) {
        for (const item of draggings) {
            const elementId = document.getElementsByClassName('dragging')[0].id;
            const card = document.getElementById(elementId);
            const cardObject = deck.player.cards.find(x => x.id === parseInt(elementId.slice(4)));
            card.style.transform = `translate(${cardObject.position.x}%, ${cardObject.position.y}%) rotate(${deck.player.cards.find(x => x.id === parseInt(elementId.slice(4))).position.angle}deg)`;
            item.classList.remove('dragging');
            document.getElementsByTagName('html')[0].style.cursor = 'default';
            let point = GetScenePoint(event);
            let x = point.x - dragGrip.x;
            let y = point.y - dragGrip.y;
            if (y < layout.attackLineY && deck.isFirstPlayerMoving && deck.bot.cards.length !== 0 && ((deck.heap.discardIndex === 0 && deck.heap.attackingCards < 5) || (deck.heap.discardIndex !== 0 && deck.heap.attackingCards < 6))) {
                if (deck.heap.TryAddAttackingCard(cardObject)) {
                    audioPlayer.Play('placed');
                    let botcard = deck.bot.TryBeatCard(deck.player.cards.find(x => x.id === (cardObject === null || cardObject === void 0 ? void 0 : cardObject.id)), deck.trumps);
                    deck.player.cards.splice(deck.player.cards.findIndex(x => x.id === (cardObject === null || cardObject === void 0 ? void 0 : cardObject.id)), 1);
                    // console.log(botcard);
                    if (!deck.bot.shouldTake) {
                        if (botcard !== null) {
                            timeoutbotbeat = setTimeout(() => {
                                var _a, _b, _c;
                                audioPlayer.Play('placed');
                                showCard(botcard);
                                botcard.position = new Position(((_a = cardObject === null || cardObject === void 0 ? void 0 : cardObject.position) === null || _a === void 0 ? void 0 : _a.x) + 14, ((_b = cardObject === null || cardObject === void 0 ? void 0 : cardObject.position) === null || _b === void 0 ? void 0 : _b.y) + 9, ((_c = cardObject === null || cardObject === void 0 ? void 0 : cardObject.position) === null || _c === void 0 ? void 0 : _c.angle) + 5);
                                botcard.bundle = cardObject === null || cardObject === void 0 ? void 0 : cardObject.id;
                                let cardItem = document.getElementById(`card${botcard === null || botcard === void 0 ? void 0 : botcard.id}`);
                                cardItem.style.transform = `translate(${botcard.position.x}%, ${botcard.position.y}%) rotate(${botcard === null || botcard === void 0 ? void 0 : botcard.position.angle}deg)`;
                                // cardItem!.style.transition = '.2s ease';
                                deck.heap.activeCards.push(botcard);
                                deck.bot.RemoveCard(botcard);
                                ArrangeCards(deck.bot.cards, false);
                                toggleActionButtonContext(true, 'Done');
                            }, 600);
                        }
                        else {
                            deck.bot.shouldTake = true;
                            toggleBotsDecision(true, 'I take');
                            toggleActionButtonContext(true, 'Pass');
                        }
                    }
                    else {
                        deck.bot.shouldTake = true;
                        toggleBotsDecision(true, 'I take');
                        toggleActionButtonContext(true, 'Pass');
                    }
                }
                for (const card of deck.heap.activeCards) {
                    let cardItem = document.getElementById(`card${card.id}`);
                    cardItem.style.transform = `translate(${card.position.x}%, ${card.position.y}%) rotate(${card.position.angle}deg)`;
                }
            }
            else if (!deck.isFirstPlayerMoving) {
                let card = deck.heap.activeCards.filter(x => x.bundle === undefined).filter(x => deck.heap.activeCards.filter(y => y.bundle === x.id).length === 0)
                    .find(card => IsOverTableCard(card, x, y));
                // console.log(card);
                if (card !== undefined && ((card.suit.type === (cardObject === null || cardObject === void 0 ? void 0 : cardObject.suit.type) && card.force < cardObject.force)
                    || (card.suit.type !== deck.trumps.type && (cardObject === null || cardObject === void 0 ? void 0 : cardObject.suit.type) == deck.trumps.type))) {
                    toggleActionButton(false);
                    audioPlayer.Play('placed');
                    cardObject.position = new Position(((_a = card === null || card === void 0 ? void 0 : card.position) === null || _a === void 0 ? void 0 : _a.x) + 14, ((_b = card === null || card === void 0 ? void 0 : card.position) === null || _b === void 0 ? void 0 : _b.y) + 9, ((_c = card === null || card === void 0 ? void 0 : card.position) === null || _c === void 0 ? void 0 : _c.angle) + 5);
                    cardObject.bundle = card === null || card === void 0 ? void 0 : card.id;
                    let cardItem = document.getElementById(`card${cardObject === null || cardObject === void 0 ? void 0 : cardObject.id}`);
                    cardItem.style.transform = `translate(${cardObject.position.x}%, ${cardObject.position.y}%) rotate(${cardObject === null || cardObject === void 0 ? void 0 : cardObject.position.angle}deg)`;
                    // cardItem!.style.transition = '.2s ease';
                    deck.heap.activeCards.push(cardObject);
                    deck.player.RemoveCard(cardObject);
                    ArrangeCards(deck.player.cards, true);
                    if (deck.player.cards.length === 0 && deck.cards.length === 0) {
                        makeAction();
                    }
                    let cardIndex = 1;
                    for (const card of deck.heap.activeCards) {
                        let cardItem = document.getElementById(`card${card.id}`);
                        cardItem.style.transform = `translate(${card.position.x}%, ${card.position.y}%) rotate(${card.position.angle}deg)`;
                        if (card.bundle !== undefined) {
                            cardItem.style.zIndex = `${cardIndex + 50}`;
                        }
                        else {
                            cardItem.style.zIndex = `${cardIndex}`;
                        }
                        cardIndex++;
                    }
                    BotAttackNext();
                    for (const card of deck.heap.activeCards) {
                        let cardItem = document.getElementById(`card${card.id}`);
                        cardItem.style.transform = `translate(${card.position.x}%, ${card.position.y}%) rotate(${card.position.angle}deg)`;
                    }
                    // console.log('After bot attack');
                }
                else {
                    let cardItems = document.getElementsByClassName('bordered');
                    for (const card of cardItems) {
                        card.classList.remove('bordered');
                    }
                }
            }
            let cardsBordered = document.getElementsByClassName('bordered');
            for (const card of cardsBordered) {
                card.classList.remove('bordered');
            }
        }
        ArrangeCards(deck.player.cards, true);
    }
};
window.onpointermove = (event) => {
    if (!event.isPrimary)
        return;
    if (document.getElementsByClassName('dragging').length !== 0) {
        const elementId = document.getElementsByClassName('dragging')[0].id;
        const card = document.getElementById(elementId);
        let point = GetScenePoint(event);
        let x = point.x - dragGrip.x;
        let y = point.y - dragGrip.y;
        let angle = Math.atan2(0 - x, 1500 - y);
        card.style.transform = `translate(${x}px, ${y}px) rotate(${-(angle * 180 / Math.PI) / 2}deg)`;
        document.getElementsByTagName('html')[0].style.cursor = 'none';
        if (!deck.isFirstPlayerMoving) {
            for (const card of deck.heap.activeCards.filter(x => x.bundle === undefined)) {
                let intersected = IsOverTableCard(card, x, y);
                // console.log('card x', card.position!.x! * 100 / 70 - 70, 'card y', card.position!.y! * 140 / 45, `x:${x}, y${y}`, intersected);
                if (intersected && deck.heap.activeCards.filter(x => x.bundle === card.id).length === 0) {
                    let cardItem = document.getElementById(`card${card.id}`);
                    cardItem.classList.add('bordered');
                }
                else {
                    let cardItem = document.getElementById(`card${card.id}`);
                    cardItem.classList.remove('bordered');
                }
            }
        }
    }
};
function Resize() {
    let previousLayout = layout;
    layout = window.innerWidth < window.innerHeight ? PortraitLayout : LandscapeLayout;
    sceneScale = Math.min(window.innerWidth / layout.sceneWidth, window.innerHeight / layout.sceneHeight);
    document.body.classList.toggle('portrait', layout.isPortrait);
    document.body.classList.toggle('touch', isTouch);
    for (const id of ['container', 'gui']) {
        let element = document.getElementById(id);
        if (element === null)
            continue;
        element.style.scale = `${sceneScale}`;
        element.style.left = layout.isPortrait ? `${window.innerWidth / 2 - 42 * sceneScale}px` : '';
        element.style.top = layout.isPortrait ? `${window.innerHeight / 2 - 54 * sceneScale}px` : '';
    }
    let uiScale = isTouch ? Math.max(1, 0.8 / sceneScale) : 1;
    document.getElementById('gui').style.setProperty('--ui', `${uiScale}`);
    if (layout !== previousLayout) {
        RelayoutCards();
    }
}
