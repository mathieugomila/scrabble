firebase.initializeApp({
    apiKey: "apiKey",
    authDomain: "projectId.firebaseapp.com",
    projectId: "lucky-lead-398919"
});

const db = firebase.firestore();
// Écrire
db.collection("scores").add({ name: "Alice", score: 50 });

// Lire
db.collection("scores").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
    });
});
