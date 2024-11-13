import React, { useCallback, useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import YouTube, { YouTubePlayer } from "./YouTube";
import {
  initSwipedEvents,
  TYPE_EVENT,
  DOUBLE_TAP_EVENT,
  TAP_START_EVENT,
  TAP_END_EVENT,
  TAP_MOVE_EVENT,
} from "./swiped-events";

import "./styles.css";
import { isMobile } from "./is-mobile";
import { getDocumentWidth } from "./get-document-width";

const VIDEO = "https://www.youtube.com/watch?v=xyAhDn_oFI8";

initSwipedEvents(window, document);

const youtubeParser = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : false;
};

function YouTubeComponentExample() {
  const ref = useRef<any>();
  const isMob = useRef<any>(isMobile()).current;
  const [seek, setSeek] = useState<string>("5");
  const [seekForPlay, setSeekForPlay] = useState<number>(0);
  // const refSeekForPlay = useRef<number>(0);
  const [youtubeUrl, setYoutubeUrl] = useState<string>(VIDEO);

  const [player, setPlayer] = useState<YouTubePlayer>();
  const [width, setWidth] = useState(
    isMob ? getDocumentWidth() /* костыль для паддингов */ : 600
  );

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
        } else if (state === 2 /* paused */) {
          play();
        }
      }
    }

    document.addEventListener("keyup", keyup);

    return () => {
      document.removeEventListener("keyup", keyup);
    };
  }, [prevHandler, nextHandler]);

  useEffect(() => {
    if (!ref.current || !prevHandler || !nextHandler) {
      return;
    }

    async function typeEvent(e) {
      const { dir } = e.detail;

      if (dir === "left") {
        nextHandler();
      } else if (dir === "right") {
        prevHandler();
      }
    }

    async function handleTouchStart(e) {
      pause();
    }

    async function handleTouchEnd(e) {
      play();
    }

    async function handleTouchMove(e) {
      console.log("xDiff", e.detail.xDiff);
      const xDiff = Math.abs(e.detail.xDiff);
      const round = Math.round(xDiff / 30);
      setSeekForPlay(round);
      setSeek(String(round));
    }

    // async function doubleTapeHandle(e) {
    //   console.log("doubleTapeHandle");
    //   const state = await player?.getPlayerState();
    //   if (state === 1 /* playing */) {
    //     pause();
    //   } else if (state === 2 /* paused */) {
    //     play();
    //   }
    // }

    document.addEventListener(TYPE_EVENT, typeEvent);
    document.addEventListener(TAP_START_EVENT, handleTouchStart);
    document.addEventListener(TAP_MOVE_EVENT, handleTouchMove);
    document.addEventListener(TAP_END_EVENT, handleTouchEnd, false);

    return () => {
      document.removeEventListener(TYPE_EVENT, typeEvent);
      document.removeEventListener(TAP_START_EVENT, handleTouchStart);
      document.removeEventListener(TAP_MOVE_EVENT, handleTouchMove);
      document.removeEventListener(TAP_END_EVENT, handleTouchEnd);
    };
  }, [ref, prevHandler, nextHandler]);

  const idVideo = youtubeParser(youtubeUrl) as string;
  console.log(idVideo);
  console.log("state", player?.getPlayerState());

  return (
    <div>
      {!isMob && (
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
      )}

      <div
        className="controls-view"
        style={{ display: "flex", marginBottom: "1em" }}
      >
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
      </div>

      <div className="app" ref={ref}>
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
        <div>seekForPlay: {seekForPlay}</div>
      </div>
    </div>
  );
}

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<YouTubeComponentExample />);
