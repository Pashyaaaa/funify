/* eslint-disable react/prop-types */
import useGetTop from "../../hooks/useGetTop";
import Hyperlink from "../Hyperlink";
import { useState } from "react";
import MotionTemplate from "../MotionTemplate";
import { easeInOut } from "framer-motion";

const SkeletonItem = ({ number }) => (
  <MotionTemplate
    duration={1}
    delay={0.25}
    x={0}
    initScale={1}
    scale={0}
    vh={false}
    inf={false}
    opacity={1}
    type="spring"
    bounce={1}
  >
    <div className="flex justify-center items-center gap-4 mb-12">
      <p className="text-white text-2xl font-bold">{number}.</p>
      <div id="banner">
        <img
          src="./dummyuser.jpeg"
          alt="Skeleton"
          className="w-16 md:w-24 lg:w-32"
        />
        <p className="text-[0.6rem] break-all md:text-xs text-white">
          Loading...
        </p>
        <p className="text-[0.5rem] break-all md:text-xs text-white">
          [Loading...]
        </p>
      </div>
    </div>
  </MotionTemplate>
);

const ContentItem = ({ res, type, number }) => {
  const [imageSrc, setImageSrc] = useState(
    type === "track" ? res.album?.images[0]?.url : res.images[0]?.url
  );
  const [loadingImage, setLoadingImage] = useState(true);

  const handleError = () => {
    setImageSrc("./dummyuser.jpeg");
    setLoadingImage(false);
  };

  const handleLoad = () => {
    setLoadingImage(false);
  };

  return (
    <MotionTemplate
      duration={0.5}
      delay={0}
      x={0}
      scale={1}
      initScale={0}
      vh={true}
      inf={false}
      opacity={1}
      type="spring"
      bounce={0.4}
      ease={easeInOut}
    >
      <Hyperlink
        key={res.id}
        to={res.external_urls.spotify}
        target="_blank"
        classname="flex justify-center items-center gap-4 mb-12 md:mb-0"
      >
        <p className="text-white text-2xl font-bold">{number}.</p>
        <div id="banner" className="group relative">
          {loadingImage && (
            <img
              src="./dummyuser.jpeg"
              alt="Loading"
              loading="lazy"
              className="w-16 md:w-24 lg:w-32 inset-0"
            />
          )}
          <img
            src={imageSrc}
            alt={res.name}
            className={`w-16 md:w-24 lg:w-32 ${
              loadingImage ? "opacity-0" : "opacity-100"
            } duration-300 group-hover:scale-110 transition-all`}
            onError={handleError}
            onLoad={handleLoad}
            loading="lazy"
          />
          <p className="text-[0.6rem] break-all md:text-sm font-lato text-green-500 md:group-hover:scale-125 transition-all">
            {res.name.length < 16
              ? res.name
              : res.name.substring(0, 16) + "..."}
          </p>
          <p className="text-[0.5rem] break-all md:text-sm font-lato text-white md:group-hover:scale-110 transition-all">
            {type === "track"
              ? res.artists
                  .map((artist) =>
                    artist.name.length < 15
                      ? artist.name
                      : artist.name.substring(0, 15) + "..."
                  )
                  .join(", ")
              : `Followers: ${res.followers.total.toLocaleString()}`}
          </p>
        </div>
      </Hyperlink>
    </MotionTemplate>
  );
};

const MainContent = ({ title, classname, type }) => {
  const { userTrack, userArtist, loading, error } = useGetTop();
  const skeletonArray = [1, 2, 3, 4, 5];
  const data = type === "track" ? userTrack : userArtist;

  let child_content;

  if (loading) {
    child_content = skeletonArray.map((_, index) => (
      <SkeletonItem key={index} number={index + 1} />
    ));
  } else if (error) {
    child_content = (
      <p className="text-white text-sm font-montserrat font-semibold text-center py-12">
        Error loading data.
      </p>
    );
  } else if ((userTrack.length === 0 && userArtist.length === 0) || error) {
    child_content = (
      <p className="text-white text-center text-sm sm:text-lg md:text-xl font-semibold font-montserrat py-8">
        You don&apos;t have any top {type === "track" ? "Tracks" : "Artists"}.{" "}
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-500 underline"
        >
          Explore Spotify
        </a>{" "}
        to find more music!
      </p>
    );
  } else {
    child_content = data.map((res, index) => (
      <ContentItem key={res.id} res={res} type={type} number={index + 1} />
    ));
  }

  return (
    <div className="flex flex-col md:block justify-center items-center w-full mt-8 md:mb-16 md:mt-12">
      <MotionTemplate
        duration={0.8}
        delay={0.25}
        x={type == "track" ? -50 : 50}
        vh={true}
        inf={false}
        opacity={0}
        type="spring"
        bounce={0.4}
      >
        <h2
          className={`${classname} first-letter:text-green-500 first-letter:text-4xl text-white text-md sm:text-lg md:text-3xl font-semibold`}
        >
          {title}
        </h2>
      </MotionTemplate>
      <div className="flex flex-col md:flex-row justify-evenly">
        {child_content}
      </div>
    </div>
  );
};

export default MainContent;
