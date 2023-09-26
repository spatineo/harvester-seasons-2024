function EmbeddedYouTubeVideo() {
  return (
    <div>
      <iframe
        id="ytplayer"
        width="100%"
        height="360"
        style={{ maxWidth: "640px" }}
        src={`https://www.youtube-nocookie.com/embed/zk-Lq4O_ZJI?cc_load_policy=1&cc_lang_pref=en&origin=https://harvesterseasons.com`}
        allowFullScreen
        title="Embedded YouTube Video"
      ></iframe>
    </div>
  );
}

export default EmbeddedYouTubeVideo;