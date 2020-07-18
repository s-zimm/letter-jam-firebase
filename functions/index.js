const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.startGame = functions.firestore
  .document("rooms/{roomCode}")
  .onUpdate(async (change, context) => {
    const previousValue = change.before.data();
	const currentRoomRef = change.after.data();
	const roomCode = context.params.roomCode;

    if (!previousValue.gameStarted && currentRoomRef.gameStarted) {
      const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * i);
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      };
      // prettier-ignore
      const fullLettersList = ["A", "A", "A", "A", "B", "B", "C", "C", "C", "D", "D", "D", "E", "E", 
				"E", "E", "E", "E", "F", "F", "G", "G", "H", "H", "H", "I", "I", "I", "I", "K", "K", "L", "L", 
				"L", "M", "M", "N", "N", "N", "O", "O", "O", "O", "P", "P", "R", "R", "R", "R", "S", "S", "S", 
				"S", "T", "T", "T", "T", "U", "U", "U", "W", "W", "Y", "Y"];
      const shuffledDeck = shuffle(fullLettersList);
      const numPlayers = currentRoomRef.players.length;
      const sectionSize = Math.floor(shuffledDeck.length / numPlayers);
      const deckSplitsForInitialWords = [];

      for (var i = 0; i < numPlayers; i++) {
        deckSplitsForInitialWords.push(
          shuffledDeck.splice(0, sectionSize)
        );
      }

      const playersWithCards = currentRoomRef.players.map((player, i) => ({
        ...player,
        initialCards: deckSplitsForInitialWords[i],
      }));

      db.collection("rooms").doc(roomCode).update({
        players: playersWithCards,
      });
    }
  });
