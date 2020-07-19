const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.startGame = functions.firestore
  .document("rooms/{roomCode}")
  .onUpdate(async (change, context) => {
    const previousRoomRef = change.before.data();
    const currentRoomRef = change.after.data();
    const roomCode = context.params.roomCode;
    // prettier-ignore
    const fullLettersList = ["A", "A", "A", "A", "B", "B", "C", "C", "C", "D", "D", "D", "E", "E", 
    "E", "E", "E", "E", "F", "F", "G", "G", "H", "H", "H", "I", "I", "I", "I", "K", "K", "L", "L", 
    "L", "M", "M", "N", "N", "N", "O", "O", "O", "O", "P", "P", "R", "R", "R", "R", "S", "S", "S", 
    "S", "T", "T", "T", "T", "U", "U", "U", "W", "W", "Y", "Y"];
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

      db.collection("rooms").doc(roomCode).update({
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
      const playerListWithDealtSecretWords = currentRoomRef.players.map(
        (player, i) => {
          if (i === currentRoomRef.players.length - 1) {
            return {
              ...player,
              secretWord: {
                ...currentRoomRef.players[0].chosenSecretWord,
                letters: shuffle(
                  currentRoomRef.players[0].chosenSecretWord.letters
                ),
              },
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

      db.collection("rooms")
        .doc(roomCode)
        .update({
          players: playerListWithDealtSecretWords,
          shuffledDeck: shuffle(lettersListWithoutSecretWordLetters),
          // THIS LINE IS EXTREMELY IMPORTANT AS IT STOPS THE FN FROM INFINITELY LOOPING
          gamePhase: "main",
        });
    }
  });
