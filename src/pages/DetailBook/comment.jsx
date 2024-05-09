import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth, db } from "../../../firebase";
import dayjs from "dayjs";
import { DeleteIcon, EditIcon, SendIcon } from "../../assets/icon";

export default function Comment() {
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const booksId = useSelector((state) => state.books.idBooks);
  const [currentUID, setCurrentUID] = useState("");

  const fetchComment = async () => {
    try {
      const bookRef = doc(db, "books", booksId);
      const unsubscribe = onSnapshot(bookRef, (doc) => {
        if (doc.exists()) {
          setComments(doc.data().comments || []);
        } else {
          console.log("Books not found in Firestore.");
        }
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching comment data:", error);
    }
  };

  useEffect(() => {
    fetchComment();
    setCurrentUID(auth.currentUser?.uid || "");
  }, []);

  async function handleAddComment(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser?.uid);
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        console.log("User not found in Firestore.");
        return;
      }

      const userData = userSnapshot.data();
      const postRef = doc(db, "books", booksId);
      const postSnapshot = await getDoc(postRef);
      if (postSnapshot.exists()) {
        await updateDoc(postRef, {
          comments: arrayUnion({
            UID: auth.currentUser?.uid,
            text: newComment,
            createdAt: dayjs().format(),
            name: userData.fullName,
          }),
        });
      } else {
        await setDoc(postRef, {
          comments: [
            {
              UID: auth.currentUser?.uid,
              text: newComment,
              createdAt: dayjs().format(),
              name: userData.fullName,
            },
          ],
        });
      }
      setIsLoading(false);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const handleEditComment = async (commentIndex) => {
    try {
      const updatedComments = comments.map((comment, index) => {
        if (index === commentIndex) {
          return {
            ...comment,
            text: editedCommentText,
          };
        }
        return comment;
      });

      const postRef = doc(db, "books", booksId);
      await updateDoc(postRef, {
        comments: updatedComments,
      });
      setEditingCommentId(null);
      setEditedCommentText("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentIndex) => {
    try {
      const updatedComments = comments.filter((_, index) => index !== commentIndex);
      const postRef = doc(db, "books", booksId);
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="">
      <h1 className="font-bold lg:text-xl">Komentar</h1>
      <div className="mt-2 rounded-lg bg-[#262626] max-h-[200px] overflow-y-auto">
        {comments.map((comment, index) => (
          <div key={index} className="px-5 py-2 border-b border-white">
            <div className="flex justify-between items-center">
              <p className="font-bold lg:text-lg">
                {comment.UID === currentUID ? "You" : comment.name}
              </p>
              <p className="font-light lg:text-base text-xs">
                {dayjs(comment.createdAt).format("DD MMMM YYYY")}
              </p>
            </div>
            <div className="flex justify-between gap-2 items-center">
              {editingCommentId === index ? (
                <input
                  type="text"
                  value={editedCommentText}
                  onChange={(e) => setEditedCommentText(e.target.value)}
                  className="rounded-lg px-2 py-1 focus: outline-none text-black w-full"
                />
              ) : (
                <p className="w-4/5 text-sm">{comment.text}</p>
              )}
              {comment.UID === currentUID && (
                <div>
                  {editingCommentId === index ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleEditComment(index)} className="border border-white px-2">
                        Save
                      </button>
                      <button onClick={() => setEditingCommentId(null)} className="border border-white px-2">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <div
                        onClick={() => {
                          setEditingCommentId(index);
                          setEditedCommentText(comment.text);
                        }}
                        className="cursor-pointer"
                      >
                        <EditIcon />
                      </div>
                      <div
                        onClick={() => handleDeleteComment(index)}
                        className="cursor-pointer"
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="px-5 py-5">
          <form
            onSubmit={handleAddComment}
            className="bg-[#CFCFCF] flex justify-between items-center rounded-2xl px-4 py-1"
          >
            <input
              type="text"
              className="bg-transparent focus: outline-none text-black w-full"
              placeholder="Tulis komentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="text-black" disabled={isLoading}>
              {isLoading ? "Loading..." : (
                <div>
                  <SendIcon />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
