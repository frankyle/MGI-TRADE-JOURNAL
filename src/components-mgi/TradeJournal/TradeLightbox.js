import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Plugins
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

const TradeLightbox = ({ isOpen, slides, index, onClose }) => {
  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides.map((img) => ({
        src: img.src,
        title: img.label,
        description: img.description,
      }))}
      index={index}
      plugins={[Zoom, Thumbnails, Fullscreen]}
      animation={{
        fade: 250,
        swipe: 150,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
      }}
      thumbnails={{
        border: true,
        height: 70,
        gap: 8,
        borderRadius: 8,
      }}
      styles={{
        container: { backgroundColor: "rgba(0, 0, 0, 0.95)" }, // dark background
        slide: { maxHeight: "80vh" },
        caption: { color: "#f0f0f0", textAlign: "center", fontSize: "0.9rem" },
      }}
    />
  );
};

export default TradeLightbox;
