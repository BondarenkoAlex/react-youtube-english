import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import YouTube, { YouTubePlayer } from "./YouTube";

import "./styles.css";

const VIDEO = "https://www.youtube.com/watch?v=xyAhDn_oFI8";

const youtubeParser = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
};

function YouTubeComponentExample() {
  const [seek, setSeek] = useState<string>("5");
  const [youtubeUrl, setYoutubeUrl] = useState<string>(VIDEO);

  const [player, setPlayer] = useState<YouTubePlayer>();
  // const [videoIndex, setVideoIndex] = useState(0);
  const [width, setWidth] = useState(600);
  // const [hidden, setHidden] = useState(false);
  // const [autoplay, setAutoplay] = useState(false);

  const prevHandler = useCallback(async () => {
    const currentTime = (await player?.getCurrentTime()) || 0;
    let prev = currentTime - parseInt(seek);
    prev = prev < 0 ? 0 : prev;
    player?.seekTo(prev, true);
  }, [seek, player]);

  const nextHandler = useCallback(async () => {
    const currentTime = (await player?.getCurrentTime()) || 0;
    const duration = (await player?.getDuration()) || 0;
    let next = currentTime + parseInt(seek);
    next = next > duration ? duration : next;
    player?.seekTo(next, true);
  }, [seek, player]);

  const pause = useCallback(async () => {
    player?.pauseVideo();
  }, [player]);

  const play = useCallback(async () => {
    player?.playVideo();
  }, [player]);

  useEffect(() => {
    async function keyup(e) {
      if (e.code === "ArrowLeft") {
        prevHandler();
      } else if (e.code === "ArrowRight") {
        nextHandler();
      } else if (e.code === "ArrowUp") {
        pause();
      } else if (e.code === "ArrowDown") {
        play();
      } else if (e.code === "Space") {
        const state = await player?.getPlayerState();
        if (state === 1 /* playing */) {
          pause();
        } else if (state === 2  /* paused */) {
          play();
        }
      }
    }
    document.addEventListener("keyup", keyup);

    return () => document.removeEventListener("keyup", keyup);
  }, [prevHandler, nextHandler]);

  const idVideo = youtubeParser(youtubeUrl) as string;
  console.log(idVideo);

  return (
    <div className="App">
      <div>
        <label>
          <input
            type="range"
            min="300"
            max="1080"
            value={width}
            onChange={(event) => setWidth(event.currentTarget.valueAsNumber)}
          />
          <span>Width ({width}px)</span>
        </label>
      </div>
      <div
        className="controls-view"
        style={{ display: "flex", marginBottom: "1em" }}
      >
        {/*<button type="button" onClick={() => player?.seekTo(120, true)}>
          Seek to 2 minutes
        </button>*/}
        {/*<button type="button" onClick={() => setVideoIndex((videoIndex + 1) % VIDEOS.length)}>*/}
        {/*  Change video*/}
        {/*</button>*/}
        <div className="controls-view__url">
          <label className="controls-url">
            <span>Youtube url:</span>
            <input
              className="controls-url__input"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
            />
          </label>
        </div>
        {/*<button type="button" onClick={() => setHidden(!hidden)}>
          {hidden ? "Show" : "Hide"}
        </button>*/}
        {/*<label>
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(event) => setAutoplay(event.currentTarget.checked)}
          />
          Autoplaying
        </label>*/}
      </div>

      {/*      {hidden ? (
        "mysterious"
      ) : (*/}
      <YouTube
        videoId={idVideo}
        opts={{
          width,
          height: width * (9 / 16),
          playerVars: {
            autoplay: /*autoplay ? 1 :*/ 0,
            controls: 1,
          },
        }}
        className="container"
        onReady={(event) => setPlayer(event.target)}
      />
      {/*      )}*/}
      <div>
        <button type="button" onClick={prevHandler}>
          <span>Prev Seek</span> <kbd>←</kbd>
        </button>
        <input
          type="number"
          step="1"
          min="1"
          max="100"
          value={seek}
          onChange={(e) => setSeek(e.target.value)}
        />
        <button type="button" onClick={nextHandler}>
          <span>Next Seek</span> <kbd>→</kbd>
        </button>
        &nbsp;&nbsp;
        <span>
          Pause - <kbd>↑, Space</kbd>
        </span>
        &nbsp;&nbsp;
        <span>
          Play - <kbd>↓, Space</kbd>
        </span>
      </div>
    </div>
  );
}

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<YouTubeComponentExample />);
