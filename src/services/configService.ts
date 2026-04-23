import { doc, setDoc, onSnapshot, collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface BrandConfig {
  name?: string;
  slogan?: string;
  description?: string;
  icon?: string;
  bg?: string;
  aboutTitle?: string;
  aboutText1?: string;
  aboutText2?: string;
  aboutImg1?: string;
  aboutImg2?: string;
}

const SETTINGS_COLLECTION = 'brandSettings';

export const saveBrandConfig = async (config: BrandConfig) => {
  try {
    const promises = Object.entries(config).map(([key, value]) => {
      if (value === undefined) return Promise.resolve();
      const docRef = doc(db, SETTINGS_COLLECTION, key);
      return setDoc(docRef, {
        value,
        updatedAt: new Date().toISOString()
      });
    });
    await Promise.all(promises);
  } catch (error) {
    console.error("Error saving brand config:", error);
    throw error;
  }
};

export const subscribeToBrandConfig = (callback: (config: BrandConfig) => void) => {
  const colRef = collection(db, SETTINGS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const config: BrandConfig = {};
    snapshot.forEach((docSnap) => {
      config[docSnap.id as keyof BrandConfig] = docSnap.data().value;
    });
    if (Object.keys(config).length > 0) {
      callback(config);
    }
  });
};
