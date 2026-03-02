import Hyperlink from "../components/Hyperlink";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import useGetPlaylist from "../hooks/useGetPlaylist";
import useGetCurrent from "../hooks/useGetCurrent";
import MainContent from "../components/MainContent";
import { useState } from "react";
import useGetTop from "../hooks/useGetTop";
import ShareButton from "../components/ShareButton";
import { motion, useIsPresent, useScroll, useSpring } from "framer-motion";
import Navbar from "../components/Navbar";
import MotionTemplate from "../components/MotionTemplate";
import Char from "../components/Char";

const Index = () => {
  const {
    token,
    error,
    userImage,
    userURL,
    data,
    CLIENT_ID,
    REDIRECT_URI,
    AUTH_ENDPOINT,
    RESPONSE_TYPE,
    SCOPE,
    logout,
  } = useSpotifyAuth();
  const { userPlaylist } = useGetPlaylist();
  const { currentTrack } = useGetCurrent();
  const [selectedTerm, setSelectedTerm] = useState("short_term");
  const isPresent = useIsPresent();
  const { userTerm } = useGetTop(selectedTerm);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleTermChange = (term) => {
    setSelectedTerm(term);
  };

  const display_name = data.display_name;

  // Modal mana yang mau di hidupin
  const [modalStates, setModalStates] = useState({
    setting: false,
    datatrack: false,
  });

  const toggleModal = (modalName) => {
    setModalStates((prevStates) => ({
      ...prevStates,
      [modalName]: !prevStates[modalName],
    }));
  };

  let number = 1;

  //? Parsing Duration dari ms Ke format yang lebih  jelas DD:MM:HH
  let durationInSeconds = Math.floor(
    (currentTrack.duration - currentTrack.currentTime) / 1000
  );

  let formattedTime = [
    Math.floor(durationInSeconds / 3600)
      .toString()
      .padStart(2, "0"),
    Math.floor((durationInSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0"),
    (durationInSeconds % 60).toString().padStart(2, "0"),
  ].join(":");
  //? Parsing Duration dari ms Ke format yang lebih  jelas DD:MM:HH

  return (
    <>
      {!token ? (
        <div className=" bg-slate-950 flex flex-col gap-5 justify-center items-center w-screen h-screen">
          <motion.h1 className="font-pacifico text-white text-4xl md:text-6xl">
            Welcome To{" "}
            <span className="text-green-500 font-bold font-montserrat leading-4">
              Meify
            </span>
          </motion.h1>
          <svg
            width="100"
            height="100"
            viewBox="0 0 168 168"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#1ED760"
              d="M84,0C37.664,0,0,37.664,0,84s37.664,84,84,84s84-37.664,84-84S130.336,0,84,0z M120.292,122.184
        c-1.528,2.508-4.792,3.32-7.3,1.796c-20.036-12.168-45.268-14.888-75.072-8.028c-2.84,0.648-5.704-1.124-6.34-3.964
        c-0.648-2.84,1.124-5.704,3.964-6.34c31.752-7.144,59.588-4.064,82.908,9.264C121.088,115.844,121.812,119.676,120.292,122.184z
        M133.988,97.604c-1.904,3.116-5.944,4.1-9.06,2.196c-23.02-14.064-58.204-18.144-85.412-9.796c-3.344,1.048-7.032-0.82-8.064-4.168
        c-1.048-3.344,0.82-7.032,4.168-8.064c30.568-9.06,69.008-4.648,95.88,10.732C134.592,90.768,135.896,94.492,133.988,97.604z
        M134.396,74.376c-27.628-16.548-73.256-18.096-98.9-9.768c-4.24,1.34-8.752-1.132-10.092-5.36
        c-1.34-4.228,1.132-8.752,5.36-10.092c29.96-9.46,79.68-7.712,110.804,11.04c3.776,2.24,5.04,7.14,2.8,10.916
        C143.22,75.056,138.172,76.616,134.396,74.376z"
            />
          </svg>
          {error && <h1 className="text-red-500 font-semibold">{error}</h1>}
          <Hyperlink
            classname="bg-green-500 text-white py-4 px-8"
            to={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
          >
            Get Started
          </Hyperlink>
          <div className="text-white font-montserrat md:text-base text-xs">
            By continuing you agree with our{" "}
            <Hyperlink classname="underline text-blue-700" to="/privacy">
              Privacy Policy
            </Hyperlink>
          </div>
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{
              scaleX: 0,
              transition: { duration: 0.5, ease: "circOut" },
            }}
            exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
            style={{ originX: isPresent ? 0 : 1 }}
            className="fixed top-0 right-0 bottom-0 left-0 bg-green-700 z-20"
          />
        </div>
      ) : (
        <div className="h-full">
          <Navbar></Navbar>
          <video
            src="./videoBg.mp4"
            autoPlay
            loop
            muted
            className="w-screen absolute object-fill -z-50 h-3/4"
          ></video>
          <header className="pt-3 md:py-5 md:px-16 flex justify-center items-center md:justify-end gap-4">
            <div className="relative group w-20 h-20 md:w-24 md:h-24">
              <img
                src={userImage || "./dummyuser.jpeg"}
                alt="Profile Picture"
                loading="lazy"
                className="rounded-full w-full h-full object-cover object-center transition-all duration-300 group-hover:blur-sm"
              />
              <Hyperlink
                to={userURL}
                target="_blank"
                classname="absolute inset-0 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity group-hover:border"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  fill="white"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92-1.06L14.44 7.66l1.41 1.41L7.34 17.6H5.92v-1.41zm13.54-9.54c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 00-1.41 0L14.34 4.66l3.75 3.75 1.37-1.37z" />
                </svg>
              </Hyperlink>
            </div>
            <div className="flex flex-col gap-1">
              <div className="mb-1">
                <Hyperlink to={userURL} target="_blank">
                  <div className="font-semibold font-lato text-green-500 text-sm md:text-base">
                    Welcome,{" "}
                    <span className="underline-offset-4 underline">
                      {display_name
                        ? display_name.length > 13
                          ? display_name.substring(0, 13) + "..."
                          : display_name
                        : "Unknown User".substring(0, 20)}
                    </span>
                  </div>
                </Hyperlink>
                <Hyperlink
                  classname="text-white text-xs font-montserrat"
                  target="_blank"
                  to="https://open.spotify.com"
                >
                  Your Playlist: {userPlaylist || 0}
                </Hyperlink>
              </div>
              <Button
                classname="bg-green-500 text-xs md:text-base text-white py-2 md:py-2 font-montserrat"
                onClick={() => toggleModal("setting")}
              >
                Settings
              </Button>
            </div>
          </header>

          <div
            id="currently-playing"
            className="relative md:absolute md:-top-12 md:-left-12 -left-8 pt-3 text-sm md:text-md flex justify-start md:justify-center lg:justify-start items-center gap-4"
          >
            <div
              id="image-current"
              className={`relative p-3 ${
                currentTrack.isPlaying && currentTrack.poster
                  ? "animate-spin"
                  : ""
              }`}
            >
              <img
                src="./cd-icon.png"
                alt="Cd's"
                loading="lazy"
                className={`w-28 md:w-40 md:h-40`}
              />
              <img
                src={
                  currentTrack.poster ? currentTrack.poster : "./dummyuser.jpeg"
                }
                alt="Unrender"
                loading="lazy"
                className="absolute rounded-full w-12 h-12 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div className="text-current">
              <div className="text-white font-lato">
                <MotionTemplate
                  duration={0.5}
                  delay={0.25}
                  x={-100}
                  vh={false}
                  inf={false}
                  opacity={0}
                  type="spring"
                  bounce={0.4}
                >
                  <div>
                    Currently {currentTrack.isPlaying ? "Playing" : "Paused"}:
                  </div>
                </MotionTemplate>
                <MotionTemplate
                  duration={0.5}
                  delay={0.5}
                  x={-100}
                  vh={false}
                  inf={false}
                  opacity={0}
                  type="spring"
                  bounce={0.4}
                >
                  <div className="font-mono text-xs md:text-base font-montserrat">
                    {currentTrack.artist ? currentTrack.artist : "Spotify"} -{" "}
                    {currentTrack.title
                      ? currentTrack.title
                      : "Ads Or Not Playing Anything"}
                  </div>
                </MotionTemplate>
                <MotionTemplate
                  duration={0.5}
                  delay={0.75}
                  x={-100}
                  vh={false}
                  inf={false}
                  opacity={0}
                  type="spring"
                  bounce={0.4}
                >
                  <div className="text-xs font-lato">{formattedTime}</div>
                </MotionTemplate>
              </div>
            </div>
          </div>

          <main className="bg-slate-950 py-12 relative overflow-hidden">
            {/* SVG untuk background */}
            <svg
              className="absolute top-0 -left-4 rotate-12 z-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 100 Q 150 200 300 100 T 600 100 T 900 100"
                stroke="green"
                strokeWidth="1"
                fill="transparent"
                strokeDasharray="10,10"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;100"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>

            {/* Konten utama */}
            <div className="relative z-10 text-white text-center font-lato font-serif flex justify-center items-center">
              <div className="animate-bounce text-xl md:text-3xl">🏡</div>
              <MotionTemplate
                duration={0.5}
                delay={0.25}
                x={0}
                y={-50}
                vh={true}
                inf={false}
                opacity={0}
                type="spring"
                bounce={0.4}
              >
                <h1 className="text-3xl md:text-5xl text-green-500 font-pacifico font-extrabold">
                  <span className=" text-white">Me</span>ify
                </h1>
              </MotionTemplate>
              <div className="animate-bounce text-xl md:text-3xl">🎧</div>
            </div>

            <MotionTemplate
              duration={0.25}
              delay={0.25}
              x={0}
              vh={true}
              inf={false}
              opacity={0}
              type="spring"
              bounce={0.4}
            >
              <p className="relative z-10 text-white text-xs text-center font-semibold pt-1 md:pt-5 font-motserrat">
                Me-ify, Wrapped Story
              </p>
            </MotionTemplate>

            <div className="relative z-10 flex md:block items-center justify-between px-4 pb-6">
              <div className="w-[40%] md:w-full">
                <MainContent
                  title="Top 5 Tracks"
                  type="track"
                  classname="font-montserrat pb-8"
                ></MainContent>
              </div>
              <div className="w-[40%] md:w-full">
                <MainContent
                  title="Top 5 Artists"
                  type="artist"
                  classname="text-right font-montserrat pb-8"
                ></MainContent>
              </div>
            </div>

            <div className="relative z-10 flex justify-center items-center md:p-8 p-2">
              <Button
                onClick={() => toggleModal("datatrack")}
                classname="text-white text-center text-xs md:text-base border px-5 md:px-10 py-3 md:py-5 border-green-500 hover:bg-green-500 hover:text-black transition-colors duration-200"
              >
                More...
              </Button>
            </div>
          </main>

          <Char></Char>
          {/* <div className="bg-slate-700 flex justify-center items-center h-screen">
            <h1 className="text-white font-montserrat">NEXT FEATURE HERE</h1>
          </div> */}
          <motion.div
            className="progress-bar fixed bottom-0 left-0 right-0 h-2 origin-center bg-green-500 z-10"
            style={{ scaleX }}
          />

          <Modal
            isOpen={modalStates.setting} // Hanya untuk 'setting' modal
            toggleModal={() => toggleModal("setting")} // Ubah fungsi untuk toggle modal ini
            title="Settings"
            content={
              <ul className="p-2 font-montserrat">
                <li className="mb-5">
                  Action
                  <ul>
                    <Hyperlink to={userURL} target="_blank">
                      <li className="mb-2 transition-all border border-green-500 px-10 py-2 text-center md:p-5 hover:bg-green-500 hover:text-white active:bg-green-500 active:text-black">
                        Edit Profile&apos;s
                      </li>
                    </Hyperlink>
                    <ShareButton classname="mr-2"></ShareButton>
                    <Button onClick={logout}>
                      <li className="mb-2 transition-all border border-red-500 px-16 py-2 md:px-32 hover:bg-red-700 hover:text-white active:bg-green-500 active:text-black text-center">
                        Logout
                      </li>
                    </Button>
                  </ul>
                </li>
                <li className="mb-8">
                  Contact Developer
                  <ul>
                    <Hyperlink to="https://wa.me/6281231196670" target="_blank">
                      <li className="mb-2 transition-all border border-green-500 p-1 md:py-2 md:px-20 hover:bg-green-500 hover:text-white active:bg-green-500 active:text-black text-center">
                        WhatsApp
                      </li>
                    </Hyperlink>
                    <Hyperlink
                      to="https://instagram.com/vyanzll"
                      target="_blank"
                    >
                      <li className="mb-2 transition-all border border-purple-500 p-1 md:py-2 md:px-20 hover:bg-purple-500 hover:text-white active:bg-green-500 active:text-black text-center">
                        Instagram
                      </li>
                    </Hyperlink>
                  </ul>
                </li>
              </ul>
            }
            footer={
              <Button
                onClick={() => toggleModal("setting")}
                classname="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </Button>
            }
            layout="default"
          />

          <Modal
            isOpen={modalStates.datatrack}
            toggleModal={() => toggleModal("datatrack")}
            title="Data Tracks"
            content={
              <div className="block justify-center items-center text-center text-xs md:text-base">
                <div className="mb-4 ">
                  {/* Tombol Term */}
                  <Button
                    onClick={() => handleTermChange("short_term")}
                    classname={`px-2 py-1 rounded ${
                      selectedTerm === "short_term"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    Short Term
                  </Button>
                  <Button
                    onClick={() => handleTermChange("medium_term")}
                    classname={`px-2 py-1 rounded mx-2 ${
                      selectedTerm === "medium_term"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    Medium Term
                  </Button>
                  <Button
                    onClick={() => handleTermChange("long_term")}
                    classname={`px-2 py-1 rounded ${
                      selectedTerm === "long_term"
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    Long Term
                  </Button>
                </div>

                <div className="overflow-x-auto w-full transition-all">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="bg-slate-200">
                        <th
                          scope="col"
                          className="px-2 py-1 text-center text-xs font-medium text-green-800 uppercase tracking-wider"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-center text-green-500 uppercase tracking-wider"
                        >
                          Track Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-center text-green-500 uppercase tracking-wider"
                        >
                          Artist
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium text-center text-green-500 uppercase tracking-wider"
                        >
                          Album And Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userTerm.map((res) => (
                        <tr key={res.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {number++}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {res.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {res.artists[0].name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {res.album.album_type}:
                            {res.album.name.length < 35
                              ? res.album.name
                              : res.album.name.substring(0, 35) + "..."}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            }
            footer={
              <Button
                onClick={() => toggleModal("datatrack")}
                classname="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </Button>
            }
            layout="wide"
          />

          <motion.div
            initial={{ scaleX: 1 }}
            animate={{
              scaleX: 0,
              transition: { duration: 0.5, ease: "circOut" },
            }}
            exit={{ scaleX: 1, transition: { duration: 0.5, ease: "circIn" } }}
            style={{ originX: isPresent ? 0 : 1 }}
            className="fixed top-0 right-0 bottom-0 left-0 bg-green-700 z-20"
          />
        </div>
      )}
    </>
  );
};

export default Index;
