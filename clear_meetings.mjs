import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAg0r3z00cIc2bNNV6LaxBqzA5VFbObN68",
    authDomain: "markly-88bc6.firebaseapp.com",
    projectId: "markly-88bc6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearMeetings() {
    console.log("Fetching meetings...");
    const meetingsRef = collection(db, "meetings");
    const snapshot = await getDocs(meetingsRef);
    console.log(`Found ${snapshot.size} meetings.`);
    for (const d of snapshot.docs) {
        await deleteDoc(doc(db, "meetings", d.id));
        console.log(`Deleted ${d.id}`);
    }
    
    console.log("Done. Exiting process.");
    process.exit(0);
}

clearMeetings();
