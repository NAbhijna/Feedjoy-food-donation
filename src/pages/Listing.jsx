import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { FaWeightScale } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import Contact from "../components/Contact";
import { getAuth } from "firebase/auth";
import { FaBackward } from "react-icons/fa";
export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  console.log(auth);
  console.log(listing);
  if (contactLandlord) {
    return (
      <div>
        <Contact userRef={listing.userRef} listing={listing} />
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <div className=" bg-slate-200">
          <div className="Announcment">
            <div className="bg-indigo-600 px-4 py-3 text-white">
              <p className="text-center text-sm font-medium">
                Love To Donate?
                <p className="inline-block underline">
                  Check out this Donation!
                </p>
                <div className="fixed top-[20%] left-[3%] z-10 cursor-pointer   rounded-full w-12 h-12 flex justify-center items-center">
                  <button
                    className="absolute left-4 top-4 bg-blue-500 text-black rounded-full p-2"
                    onClick={goBack}
                  >
                    <FaBackward />
                  </button>
                </div>
              </p>
            </div>
          </div>

          <div className="Stats text-left justify-start">
            {listing.imgUrls.map((url, index) => (
              <section
                key={index}
                className="bg-cover bg-top bg-no-repeat dynamic-background"
                style={{ backgroundImage: `url(${url})` }}
              >
                <div class="bg-black/25 p-8 md:p-12 lg:px-16 lg:py-24">
                  <div class="text-center md:text-left rtl:sm:text-right">
                    <h2 class="text-2xl font-bold text-white sm:text-3xl md:text-5xl">
                    {listing.name}
                    </h2>

                    <p class="hidden max-w-lg text-white/90 md:mt-6 md:block md:text-lg md:leading-relaxed">
                    {listing.description}
                    </p>
                  </div>
                </div>
              </section>
            ))}
            <div
              className="fixed top-[20%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShareLinkCopied(true);
                setTimeout(() => {
                  setShareLinkCopied(false);
                }, 2000);
              }}
            >
              <FaShare className="text-lg text-slate-500" />
            </div>
            {shareLinkCopied && (
              <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
                Link Copied
              </p>
            )}
          </div>
          {/* //------------------------- */}
          <div>
            <article className=" rounded-xl border   shadow-xl m-10 flex bg-white transition hover:shadow-xl">
              <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
                <time
                  datetime="2022-10-10"
                  className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
                >
                  <span>Use By</span>
                  <span className="w-px flex-1 bg-gray-900/10"></span>
                  <span>{listing.expiry}</span>
                </time>
              </div>

              <div className="hidden sm:block sm:basis-56">
                <img
                  alt=""
                  src={listing.imgUrls[0]}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                  <div className="flex flex-row ">
                    <div>
                      <a
                        className="group relative inline-block focus:outline-none focus:ring"
                        href="#"
                      >
                        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

                        <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75">
                          {listing.name}
                        </span>
                      </a>
                    </div>
                    <div className="ml-6 right-0 ">
                      {" "}
                      <a
                        className="group relative inline-block focus:outline-none focus:ring"
                        href="#"
                      >
                        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

                        <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75">
                          Type: {listing.type}
                        </span>
                      </a>
                    </div>
                    <div className="ml-6 right-0 ">
                      {" "}
                      <a
                        className="group relative inline-block focus:outline-none focus:ring"
                        href="#"
                      >
                        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-yellow-300 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

                        <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75">
                          For:{listing.animal ? "Animal" : "Human"}
                        </span>
                      </a>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm/relaxed text-gray-700">
                    {listing.description}
                  </p>
                  <div className="flex flex-row mt-2 ">
                    <div>
                      {" "}
                      <MdLocationPin className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-3 font-bold text-black">
                      {listing.address}
                    </div>
                  </div>
                  <div className="flex flex-row mt-2 ">
                    <div className="ml-2">
                      {" "}
                      <FaWeightScale className="h-6 w-6 text-blue-900" />
                    </div>
                    <div className="ml-3 font-bold text-black">
                      {" "}
                      {listing.quantity > 1
                        ? `${listing.quantity} kgs`
                        : "1 kg"}
                    </div>
                  </div>
                </div>
                {listing.userRef == auth.currentUser?.uid &&
                  !contactLandlord && (
                    <div className="mt-6 sm:flex sm:items-end sm:justify-end m-10">
                      <button
                        onClick={() => setContactLandlord(true)}
                        className="block bg-black px-5 py-3 text-center text-xs font-bold uppercase text-white transition hover:bg-gray-200 hover:text-black"
                      >
                        Contact Doner
                      </button>
                    </div>
                  )}
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
