import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { FaBackward } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);
  function onChange(e) {
    setMessage(e.target.value);
  }

  const backgroundImageUrl =
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRCxl7GGxflQoamqaucgrH0IikHkeGrPHycfiCBAN8lU4ES7LEPkhwMOKkctGsQvP9kZXP3J5qN-xVAItkFi0er8kuJs26gVf2kwAjKcl7EeLvBSkwXveqWpWMx_kD8lryE1hmUdyk6HWJCNo_eaJ7GjoyW6UQVEfddVUJWdbrID7p30qxB3p3B22y/s1600/Android%20Devs%20Banner%20.png";

  const divStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom",
  };
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      {landlord !== null && (
        <section className="overflow-hidden rounded-lg shadow-2xl md:grid md:grid-cols-3 backdrop-blur bg-opacity-30 bg-transparent m-20">
          <img
            alt=""
            src="https://www.shutterstock.com/shutterstock/photos/1912062127/display_1500/stock-vector-food-donation-banner-or-poster-design-with-cartoon-characters-of-volunteers-flat-vector-1912062127.jpg"
            className="h-25 w-full object-cover md:h-25"
          />

          <div
            style={divStyle}
            className=" relative  bg-gray-50 border border-gray-300 p-4 text-center sm:p-6 md:col-span-2 lg:p-8"
          >
            <button
              className="absolute left-4 top-4 bg-blue-500 text-white rounded-full p-2"
              onClick={goBack}
            >
              <FaBackward />
            </button>

            <p className="text-sm font-semibold uppercase tracking-widest">
              Alert Doner
            </p>

            <h2 className="mt-4 mb-4 font-black uppercase">
              <span className="text-4xl font-black sm:text-5xl lg:text-6xl">
                {" "}
                No Hunger
              </span>
            </h2>
            <div className="mt-3 mb-1">
              <textarea
                placeholder="Enter Your Confirmation Message"
                name="message"
                id="message"
                rows="2"
                value={message}
                onChange={onChange}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              ></textarea>
            </div>
            <a
              className="mt-4 inline-block w-[170px] bg-black py-4 text-sm font-bold uppercase tracking-widest text-white"
              href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
            >
              Send Message
            </a>

            <p className="mt-1 text-xs font-medium uppercase text-gray-400">
              valid until {listing.expiry}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
