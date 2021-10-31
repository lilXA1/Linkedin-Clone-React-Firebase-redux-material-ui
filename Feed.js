import "./Feed.css";
import React, {
  useEffect,
  useState,
} from "react";
import CreateIcon from "@material-ui/icons/Create";
import ImageIcon from "@material-ui/icons/Image";
import InputOptions from "./InputOptions";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import EventNoteIcon from "@material-ui/icons/EventNote";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import Post from "./Post";
import { db } from "./firebase";
import firebase from "firebase";
import { selectUser } from "./features/userSlice";
import { useSelector } from "react-redux";

function Feed() {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
  }, []);

  const sendPost = (e) => {
    e.preventDefault();

    db.collection("posts").add({
      name: user.displayName,
      description: user.email,
      message: input,
      photoUrl: user.photoUrl || "",
      timestamp:
        firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="feed">
      <div className="feed__inputContainer">
        <div className="feed__input">
          <CreateIcon />
          <form>
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              type="text"
            />
            <button
              onClick={sendPost}
              type="submit"
            >
              Send
            </button>
          </form>
        </div>
        <div className="feed__inputOptions">
          <InputOptions
            Icon={ImageIcon}
            title="Photo"
            color="lightblue"
          />
          <InputOptions
            Icon={SubscriptionsIcon}
            title="Video"
            color="yellow"
          />
          <InputOptions
            Icon={EventNoteIcon}
            title="Event"
            color="green"
          />
          <InputOptions
            Icon={CalendarViewDayIcon}
            title="write article"
            color="lightgreen"
          />
        </div>
      </div>
      {/* Posts */}
      {posts.map(
        ({
          id,
          data: {
            name,
            description,
            message,
            photoUrl,
          },
        }) => (
          <Post
            key={id}
            name={name}
            description={description}
            message={message}
            photoUrl={photoUrl}
          />
        )
      )}
    </div>
  );
}

export default Feed;