interface ILayout {
    isPortrait: boolean;
    sceneWidth: number;
    sceneHeight: number;
    deckX: number;
    deckY: number;
    discardX: number;
    discardY: number;
    discardWidth: number;
    discardHeight: number;
    botHandX: number;
    botHandY: number;
    playerHandY: number;
    tableY: number;
    tableStepX: number;
    tableStepY: number;
    tableColumns: number;
    attackLineY: number;
}

const LandscapeLayout: ILayout = {
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

const PortraitLayout: ILayout = {
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
const MinTouchTarget = 48;

const isTouch = window.matchMedia('(pointer: coarse)').matches;
let layout: ILayout = window.innerWidth < window.innerHeight ? PortraitLayout : LandscapeLayout;
let sceneScale = 1;

function GetDeckTransform(index: number): string {
    return `translate(${layout.deckX}%,${layout.deckY + ((10 - index / 2) > 0 ? (10 - index / 2) * -1 : 10 - index / 2)}%)`;
}

function GetTrumpTransform(): string {
    return `translate(${layout.deckX + 40}%, ${layout.deckY - 7}%) rotate(${86 + Math.floor(Math.random() * 10)}deg)`;
}

function GetDiscardPosition(): Position {
    return new Position(
        layout.discardX + Math.random() * layout.discardWidth,
        layout.discardY + Math.random() * layout.discardHeight,
        -25 + Math.random() * 50
    );
}

function GetTouchHandSpread(count: number): number {
    let step = MinTouchTarget / sceneScale;
    if (count > 1) {
        step = Math.min(step, (layout.sceneWidth * 0.95 - CardWidth) / (count - 1));
    }
    return step / CardWidth * 100 / 20;
}

function RelayoutCards(): void {
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
        let cardItem = document.getElementById(`card${card.id}`)!;
        cardItem.style.transform = `translate(${card.position!.x}%, ${card.position!.y}%) rotate(${card.position!.angle}deg)`;
    }
}
