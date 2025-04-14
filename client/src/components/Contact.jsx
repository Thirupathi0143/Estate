import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [user, setUser] = useState();
  const [message, setMessage] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`, {
          method: "GET"
        });
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.warn(error.message);
      }
    }
    fetchUser();
  }, []);


  return (
    <div className="flex flex-col gap-2">
      {
        user && (
          <div className="">
            <p className="font-semibold">
              Contact: <span className="text-blue-800">{user.userName}</span> for <span className="text-blue-800">{listing.name.toLowerCase()}</span>
            </p>
          </div>
        )
      }
      {
        user && (
          <React.Fragment>
            <textarea
              id="message"
              rows={1}
              style={{ textIndent: "15px" }}
              placeholder="Enter your message here . . . ."
              className="w-full p-3 rounded-lg font-semibold border border-slate-300 focus:outline-none focus:border-green-600 "
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            ></textarea>
            <Link
              to={`mailto:${user.email}?subject=Regarding ${listing.name}&body=${message}`}
              className="w-full bg-slate-700 text-white font-semibold rounded-lg p-3 text-center uppercase tracking-wider hover:opacity-85"
            >
              Send Message
            </Link>
          </React.Fragment>
        )
      }
    </div>
  );
}