import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import YouTube, { YouTubePlayer } from "./YouTube";

import "./styles.css";

const VIDEOS = "xyAhDn_oFI8";

function YouTubeComponentExample() {
  const [seek, setSeek] = useState<string>(5);
  const [id, setId] = useState<string>(VIDEOS);

  const [player, setPlayer] = useState<YouTubePlayer>();
  // const [videoIndex, setVideoIndex] = useState(0);
  const [width, setWidth] = useState(600);
  const [hidden, setHidden] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  //debugger
  console.log("getCurrentTime", player && player.getCurrentTime());

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
    function keyup(e) {
      debugger;
      if (e.code === "ArrowLeft") {
        prevHandler();
      } else if (e.code === "ArrowRight") {
        nextHandler();
      } else if (e.code === "ArrowUp") {
        pause();
      } else if (e.code === "ArrowDown") {
        play();
      }
    }
    document.addEventListener("keyup", keyup);

    return () => document.removeEventListener("keyup", keyup);
  }, [prevHandler, nextHandler]);

  return (
    <div className="App">
      <div style={{ display: "flex", marginBottom: "1em" }}>
        {/*<button type="button" onClick={() => player?.seekTo(120, true)}>
          Seek to 2 minutes
        </button>*/}
        {/*<button type="button" onClick={() => setVideoIndex((videoIndex + 1) % VIDEOS.length)}>*/}
        {/*  Change video*/}
        {/*</button>*/}
        <label>
          id youtube video
          <input value={id} onChange={(event) => setId(event.target.value)} />
        </label>
        <label>
          <input
            type="range"
            min="300"
            max="1080"
            value={width}
            onChange={(event) => setWidth(event.currentTarget.valueAsNumber)}
          />
          Width ({width}px)
        </label>
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

      {hidden ? (
        "mysterious"
      ) : (
        <YouTube
          videoId={id}
          opts={{
            width,
            height: width * (9 / 16),
            playerVars: {
              autoplay: autoplay ? 1 : 0,
              controls: 1,
            },
          }}
          className="container"
          onReady={(event) => setPlayer(event.target)}
        />
      )}
      <div>
        <button type="button" onClick={prevHandler}>
          <span>Prev Seek</span> <kbd>←</kbd>
        </button>
        <input value={seek} onChange={(e) => setSeek(e.target.value)} />
        <button type="button" onClick={nextHandler}>
          <span>Next Seek</span> <kbd>→</kbd>
        </button>
        &nbsp;&nbsp;
        <span>
          Pause - <kbd>↑</kbd>
        </span>
        &nbsp;&nbsp;
        <span>
          Play - <kbd>↓</kbd>
        </span>
      </div>
    </div>
  );
}

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<YouTubeComponentExample />);
