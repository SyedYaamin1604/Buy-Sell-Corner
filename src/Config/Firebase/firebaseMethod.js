import {app} from './firebaseConfig';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const auth = getAuth(app);

//initialize firestore database
export const db = getFirestore(app);

//initialize firestore database
export const storage = getStorage(app);

// register user
export let signUpUser = (obj) => {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, obj.email, obj.password)
            .then(async (res) => {
                resolve((obj.uid = res.user.uid));
                delete obj.password
                await addDoc(collection(db, "users"), obj)
                    .then((res) => {
                        console.log("user added to database successfully", res.id);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                reject(err.message);
            });
    });
};

// login user
export let loginUser = (obj) => {
    return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(auth, obj.email, obj.password)
            .then(async () => {
                const q = query(
                    collection(db, "users"),
                    where("uid", "==", auth.currentUser.uid)
                );
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    resolve(doc.data());
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

//signout User
export const signOutUser = () => {
    return new Promise((resolve, reject) => {
        signOut(auth)
            .then(() => {
                resolve("user Signout Successfully");
            })
            .catch((error) => {
                reject(error);
            });
    });
};

//send data to firestore
export const sendData = (obj, colName) => {
    return new Promise((resolve, reject) => {
        addDoc(collection(db, colName), obj)
            .then((res) => {
                resolve("data send to db successfully", res.id);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

//get data with id from firestore
export const getData = (colName, uid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dataArr = [];
            const q = query(collection(db, colName), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const obj = { ...doc.data(), documentId: doc.id };
                dataArr.push(obj);
                // console.log(doc.id);
            });
            resolve(dataArr);
        } catch (error) {
            reject("Error occurred while fetching data: " + error.message);
        }
    });
};


//get all data
export const getAllData = (colName) => {
    return new Promise(async (resolve, reject) => {
        const dataArr = []
        const querySnapshot = await getDocs(collection(db, colName));
        querySnapshot.forEach((doc) => {
            const obj = { ...doc.data(), documentId: doc.id }
            dataArr.push(obj)
            resolve(dataArr);
        });
        reject("error occured")
    })
}

//Delete document by id
export const deleteDocument = async (id, name) => {
    return new Promise((resolve, reject) => {
        deleteDoc(doc(db, name, id));
        resolve("document deleted")
        reject("error occured")
    })
}

//update document by id
export const updateDocument = async (obj, id, name) => {
    try {
        const update = doc(db, name, id);
        console.log(update);
        await updateDoc(update, obj);
        return "Document updated successfully";
    } catch (error) {
        console.error("Error updating document:", error);
        return "An error occurred while updating the document";
    }
};

// Upload Image and Get Image URL
export async function uploadImage(files) {
    const storageRef = ref(storage, `image/${files.name}`);
    try {
        const uploadImg = await uploadBytes(storageRef, files);
        console.log("Profile Image Uploaded!");
        const url = await getDownloadURL(storageRef);
        console.log(url);
        return url;
    } catch {
        console.log("Error Upload Image");
    }
}
