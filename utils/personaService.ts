import { collection, query, getDocs, doc, setDoc, deleteDoc, DocumentData, getDoc, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';

// Updated Persona Interface with required and optional fields
export interface Persona extends DocumentData {
  id: string; // Document ID from Firestore

  // Required fields
  personaName: string;
  roleTitle: string;
  industry: string;
  typicalAudience: string;
  resultsYouCreate: string;
  tone: string;
  keyTopics: string[];

  // Optional fields
  formality?: string;
  humour?: string;
  sentenceLengthPreference?: string;
  signaturePhrases?: string[];
  avoidPhrases?: string[];
  coreBeliefs?: string[];
  contrarianViews?: string[];
  backgroundStory?: string;
  quirks?: string;
  personalStoryLevel?: string;
  hookPreference?: string;
  hookStyle?: string;
  ctaPreference?: string;
  ctaType?: string;
  emojiUsage?: string;
  lineBreaks?: boolean;
  prefersLists?: boolean;
  formattingRules?: string;
  likedExamples?: string[];
  dislikedExamples?: string[];
  isDefault?: boolean;
}

const PERSONA_DOC_ID = 'defaultPersona'; // Using a fixed ID for the user's primary persona

/**
 * Fetches the active persona for the currently logged-in user from Firestore.
 * It fetches all personas and finds the one marked as default. If none is found,
 * it falls back to the first persona available for that user.
 * @returns {Promise<Persona | null>} The active persona object or null if none is found or user is not logged in.
 */
export async function fetchActivePersona(): Promise<Persona | null> {
  const user = auth.currentUser;
  if (!user) {
    console.log("fetchActivePersona: No user logged in.");
    return null;
  }

  const collectionPath = `users/${user.uid}/personas`;
  const personasRef = collection(db, collectionPath);

  try {
    const defaultPersonaDoc = await getDoc(doc(personasRef, PERSONA_DOC_ID));
    if (defaultPersonaDoc.exists()) {
      return { id: defaultPersonaDoc.id, ...defaultPersonaDoc.data() } as Persona;
    }

    const fallbackQuery = query(personasRef, limit(1));
    const querySnapshot = await getDocs(fallbackQuery);

    if (querySnapshot.empty) {
      console.log("fetchActivePersona: No personas found for this user.");
      return null;
    }

    const fallbackDoc = querySnapshot.docs[0];
    return { id: fallbackDoc.id, ...fallbackDoc.data() } as Persona;

  } catch (error) {
    console.error("fetchActivePersona: Error fetching from Firestore:", error);
    throw new Error("Unable to load your persona. Please try again.");
  }
}

/**
 * Saves (creates or updates) the user's default persona in Firestore.
 * @param {Partial<Persona>} personaData - The persona data to save.
 * @returns {Promise<void>}
 */
export async function savePersona(personaData: Partial<Persona>): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Authentication error: No user is signed in.");
    }
    try {
        const personaRef = doc(db, `users/${user.uid}/personas`, PERSONA_DOC_ID);
        // Using setDoc with merge: true allows this to work for both create and update
        await setDoc(personaRef, { ...personaData, isDefault: true }, { merge: true });
    } catch (error) {
        console.error("savePersona: Error saving to Firestore:", error);
        throw new Error("There was a problem saving your persona. Please try again.");
    }
}

/**
 * Deletes the user's default persona from Firestore.
 * @returns {Promise<void>}
 */
export async function deletePersona(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Authentication error: No user is signed in.");
    }
    try {
        const personaRef = doc(db, `users/${user.uid}/personas`, PERSONA_DOC_ID);
        await deleteDoc(personaRef);
    } catch (error) {
        console.error("deletePersona: Error deleting from Firestore:", error);
        throw new Error("There was a problem deleting your persona. Please try again.");
    }
}
