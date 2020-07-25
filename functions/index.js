const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.scheduledFunction = functions.pubsub.schedule('every day 00:00').timeZone('America/New_York').onRun(async (context) => {
  const rooms = await db.collection("rooms").get();
  rooms.forEach(room => {
    const roomData = room.data();
    const currentTimestamp = new Date();
    var hours = Math.abs(currentTimestamp - new Date(roomData.timeChanged)) / 36e5;
    if (hours > 6) {
      return db.collection('rooms').doc(room.id).delete();
    }
  })
  return null;
});

exports.startGame = functions.firestore
  .document("rooms/{roomCode}")
  .onUpdate(async (change, context) => {
    const previousRoomRef = change.before.data();
    const currentRoomRef = change.after.data();
    const roomCode = context.params.roomCode;
    const roomRef = db.collection("rooms").doc(roomCode);
    if (previousRoomRef.timeChanged !== currentRoomRef.timeChanged) {
      console.log("Timestamp updated for room: ", roomCode);
    } else {
      roomRef.update({ timeChanged: context.timestamp });
    }
    // prettier-ignore
    const fullLettersList = ["A", "A", "A", "A", "B", "B", "C", "C", "C", "D", "D", "D", "E", "E", 
    "E", "E", "E", "E", "F", "F", "G", "G", "H", "H", "H", "I", "I", "I", "I", "K", "K", "L", "L", 
    "L", "M", "M", "N", "N", "N", "O", "O", "O", "O", "P", "P", "R", "R", "R", "R", "S", "S", "S", 
    "S", "T", "T", "T", "T", "U", "U", "U", "W", "W", "Y", "Y"];
    const gameSetupConfig = {
      2: {
        requiredPerPlayer: 3,
        total: 11,
        standConfig: [7, 8, 9, 10],
      },
      3: {
        requiredPerPlayer: 2,
        total: 11,
        standConfig: [7, 8, 9],
      },
      4: {
        requiredPerPlayer: 1,
        total: 11,
        standConfig: [7, 8],
      },
      5: {
        requiredPerPlayer: 1,
        total: 11,
        standConfig: [7],
      },
      6: {
        requiredPerPlayer: 1,
        total: 11,
        standConfig: null,
      },
    };
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };

    if (!previousRoomRef.gameStarted && currentRoomRef.gameStarted) {
      const shuffledDeck = shuffle(fullLettersList);
      const numPlayers = currentRoomRef.players.length;
      const sectionSize = Math.floor(shuffledDeck.length / numPlayers);
      const deckSplitsForInitialWords = [];

      for (var i = 0; i < numPlayers; i++) {
        deckSplitsForInitialWords.push(shuffledDeck.splice(0, sectionSize));
      }

      const playersWithCards = currentRoomRef.players.map((player, i) => ({
        ...player,
        initialCards: deckSplitsForInitialWords[i],
      }));

      roomRef.update({
        players: playersWithCards,
      });
    }

    const allPlayersLockedIn =
      currentRoomRef.players &&
      !currentRoomRef.players.find((player) => !player.chosenSecretWord);
    if (
      allPlayersLockedIn &&
      currentRoomRef.gamePhase &&
      currentRoomRef.gamePhase === "secretWordSetup"
    ) {
      const lettersListWithoutSecretWordLetters = [...fullLettersList];
      const numPlayers = currentRoomRef.players.length;
      const playerListWithDealtSecretWords = currentRoomRef.players.map(
        (player, i) => {
          if (i === numPlayers - 1) {
            return {
              ...player,
              secretWord: {
                ...currentRoomRef.players[0].chosenSecretWord,
                letters: shuffle(
                  currentRoomRef.players[0].chosenSecretWord.letters
                ),
              },
              clues: [],
              currentVisibleIndex: 0,
            };
          } else {
            return {
              ...player,
              secretWord: {
                ...currentRoomRef.players[i + 1].chosenSecretWord,
                letters: shuffle(
                  currentRoomRef.players[i + 1].chosenSecretWord.letters
                ),
              },
              clues: [],
              currentVisibleIndex: 0,
            };
          }
        }
      );

      const listOfSecretLetters = currentRoomRef.players.reduce(
        (fullList, player) => fullList.concat(player.chosenSecretWord.letters),
        []
      );
      listOfSecretLetters.forEach((letter) => {
        const indexOfLetter = lettersListWithoutSecretWordLetters.indexOf(
          letter
        );
        if (indexOfLetter !== -1) {
          lettersListWithoutSecretWordLetters.splice(indexOfLetter, 1);
        }
      });

      const shuffledDeck = shuffle(lettersListWithoutSecretWordLetters);
      const gameConfig = gameSetupConfig[numPlayers];
      let nonPlayerStands = null;
      const cluesLeft = [];
      for (
        var ndex = 0;
        ndex < gameConfig.requiredPerPlayer * numPlayers;
        ndex++
      ) {
        cluesLeft.push("red");
      }
      for (
        var ndex2 = 0;
        ndex2 < gameConfig.total - gameConfig.requiredPerPlayer * numPlayers;
        ndex2++
      ) {
        cluesLeft.push("green");
      }
      gameConfig.requiredPerPlayer;
      if (numPlayers < 6) {
        nonPlayerStands = gameConfig.standConfig.reduce(
          (obj, numCards, i) => ({
            ...obj,
            [i]: shuffledDeck.splice(0, numCards).concat(["END"]),
          }),
          {}
        );
      }
      roomRef.update({
        players: playerListWithDealtSecretWords,
        shuffledDeck,
        nonPlayerStands,
        cluesConfig: gameConfig,
        cluesLeft,
        // THIS LINE IS EXTREMELY IMPORTANT AS IT STOPS THE FN FROM INFINITELY LOOPING
        gamePhase: "main",
      });
    }

    const allPlayersDone =
      currentRoomRef.players.filter(
        (player) => player.guessedLetters && player.guessedLetters.length < 5
      ).length === 0;
    const playersWereNotDone =
      previousRoomRef.players.filter(
        (player) => player.guessedLetters && player.guessedLetters.length < 5
      ).length > 0;

    if (allPlayersDone && playersWereNotDone && gamePhase !== "reveal") {
      roomRef.update({
        gamePhase: "reveal",
      });
    }
  });
