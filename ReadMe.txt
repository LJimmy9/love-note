
Player = {
    playerId,
    displayName,
    avatarUrl,
    identity
    hands
}

Notes {
    id,
    description: give emoji options
    crossedOut: boolean
}

loveNote = {
    cardId
    cardNum: 0
    numberOfNote
    notes: Notes
}

GameState = {
    players,
    current_turn,
    game_phase: draw | play | resolve,
    current_round,
    timer: 45 seconds,
    cardPriority,
    playField,
    discard,
    deck,
    hasWinner
}

card = {
    cardId
    image,
    number,
    description,
    restrictionToPlayer: identityCardName,
}

identityCard = {
    image:
    name:
    description:

}

4 players: 3 messages - 4 rounds
5 - 6 players: 4 messages - 6 rounds

Exchange / Peeking / Remove / Tattle (highlighted on screen)
