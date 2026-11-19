"use strict";
// True if point (px, py) lies inside the box with top-left corner (x, y) and size w×h; edges count as inside
function isPointInBox(x, y, w, h, px, py) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
}
window.onresize = (event) => {
    Resize();
};
window.onmousedown = (event) => {
    let item = document.elementFromPoint(event.x, event.y);
    if ((item === null || item === void 0 ? void 0 : item.classList.contains('card')) && deck.player.cards.findIndex(x => x.id === parseInt(item.id.slice(4))) !== -1) {
        item.classList.add('dragging');
        document.getElementsByTagName('html')[0].style.cursor = 'none';
        ArrangeCards(deck.player.cards.filter(x => x.id !== parseInt(item.id.slice(4))), true);
    }
    // console.log(item, deck.player.cards.findIndex(x => x.id === parseInt(item.id.slice(0, 4))), deck.player.cards);
};
window.onmouseup = (event) => {
    var _a, _b, _c;
    let draggings = document.getElementsByClassName('dragging');
    if (draggings.length > 0) {
        for (const item of draggings) {
            const elementId = document.getElementsByClassName('dragging')[0].id;
            const card = document.getElementById(elementId);
            const cardObject = deck.player.cards.find(x => x.id === parseInt(elementId.slice(4)));
            card.style.transform = `translate(${cardObject.position.x}%, ${cardObject.position.y}%) rotate(${deck.player.cards.find(x => x.id === parseInt(elementId.slice(4))).position.angle}deg)`;
            item.classList.remove('dragging');
            document.getElementsByTagName('html')[0].style.cursor = 'default';
            let x = (event.x - window.innerWidth * 0.52) / window.innerWidth * 1920 + 30;
            let y = (event.y - window.innerHeight * 0.52) / window.innerHeight * 1080 - 40;
            if (y < 0 && deck.isFirstPlayerMoving && deck.bot.cards.length !== 0 && ((deck.heap.discardIndex === 0 && deck.heap.attackingCards < 5) || (deck.heap.discardIndex !== 0 && deck.heap.attackingCards < 6))) {
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
                    .find(card => isPointInBox(card.position.x * 100 / 70 - 90, card.position.y * 140 / 45 - 20, 170, 200, x, y));
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
window.onmousemove = (event) => {
    if (document.getElementsByClassName('dragging').length !== 0) {
        const elementId = document.getElementsByClassName('dragging')[0].id;
        const card = document.getElementById(elementId);
        let x = (event.x - window.innerWidth * 0.52) / window.innerWidth * 1920 + 30;
        let y = (event.y - window.innerHeight * 0.52) / window.innerHeight * 1080 - 40;
        let angle = Math.atan2(0 - x, 1500 - y);
        card.style.transform = `translate(${x}px, ${y}px) rotate(${-(angle * 180 / Math.PI) / 2}deg)`;
        document.getElementsByTagName('html')[0].style.cursor = 'none';
        if (!deck.isFirstPlayerMoving) {
            for (const card of deck.heap.activeCards.filter(x => x.bundle === undefined)) {
                let intersected = isPointInBox(card.position.x * 100 / 70 - 90, card.position.y * 140 / 45 - 20, 170, 200, x, y);
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
    let width = window.innerWidth;
    let gameDoc = document.getElementById('container');
    gameDoc.style.scale = `${width / 1920}`;
    let guiDoc = document.getElementById('gui');
    guiDoc.style.scale = `${width / 1920}`;
}
