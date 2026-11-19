"use strict";
const LandscapeLayout = {
    isPortrait: false,
    sceneWidth: 1920,
    sceneHeight: 950,
    deckX: -560,
    deckY: -40,
    discardX: 610,
    discardY: -130,
    discardWidth: 100,
    discardHeight: 160,
    botHandX: 0,
    botHandY: -210,
    playerHandY: 130,
    tableY: -45,
    tableStepX: 140,
    tableStepY: 0,
    tableColumns: 6,
    attackLineY: 0
};
const PortraitLayout = {
    isPortrait: true,
    sceneWidth: 760,
    sceneHeight: 1400,
    deckX: -199,
    deckY: -245,
    discardX: 184,
    discardY: -260,
    discardWidth: 30,
    discardHeight: 30,
    botHandX: 27,
    botHandY: -245,
    playerHandY: 240,
    tableY: -77,
    tableStepX: 130,
    tableStepY: 122,
    tableColumns: 3,
    attackLineY: 300
};
const CardWidth = 146;
const CardHeight = 196;
const TouchHandScale = 1.4;
const TouchFanRadius = 900;
const TouchFanAngle = 4;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
let layout = window.innerWidth < window.innerHeight ? PortraitLayout : LandscapeLayout;
let sceneScale = 1;
function GetDeckTransform(index) {
    return `translate(${layout.deckX}%,${layout.deckY + ((10 - index / 2) > 0 ? (10 - index / 2) * -1 : 10 - index / 2)}%)`;
}
function GetTrumpTransform() {
    return `translate(${layout.deckX + 40}%, ${layout.deckY - 7}%) rotate(${86 + Math.floor(Math.random() * 10)}deg)`;
}
function GetDiscardPosition() {
    return new Position(layout.discardX + Math.random() * layout.discardWidth, layout.discardY + Math.random() * layout.discardHeight, -25 + Math.random() * 50);
}
function GetHandScale() {
    return isTouch ? ` scale(${TouchHandScale})` : '';
}
function GetPlayerHandY() {
    return layout.playerHandY - (isTouch ? (TouchHandScale - 1) * 50 : 0);
}
function GetTouchFanPosition(index, count) {
    let angle = (index - (count - 1) / 2) * TouchFanAngle;
    let radians = angle * Math.PI / 180;
    return new Position(TouchFanRadius * Math.sin(radians) / CardWidth * 100, GetPlayerHandY() + TouchFanRadius * (1 - Math.cos(radians)) / CardHeight * 100, angle);
}
function RelayoutCards() {
    for (let i = 0; i < deck.cards.length; i++) {
        let cardItem = document.getElementById(`card${deck.cards[i].id}`);
        if (cardItem !== null) {
            cardItem.style.transform = i === 0 ? GetTrumpTransform() : GetDeckTransform(i);
        }
    }
    ArrangeCards(deck.player.cards, true);
    ArrangeCards(deck.bot.cards, false);
    deck.heap.CalcPosition();
    for (const card of deck.heap.discardedCards) {
        card.position = GetDiscardPosition();
    }
    for (const card of deck.heap.activeCards.concat(deck.heap.discardedCards)) {
        let cardItem = document.getElementById(`card${card.id}`);
        cardItem.style.transform = `translate(${card.position.x}%, ${card.position.y}%) rotate(${card.position.angle}deg)`;
    }
}
